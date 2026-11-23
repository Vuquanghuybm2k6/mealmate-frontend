"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarCheck,
  CalendarDays,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Home,
  Lightbulb,
  Moon,
  Plus,
  RefreshCw,
  Refrigerator,
  Search,
  ShoppingCart,
  Sparkles,
  Sunrise,
  User,
  Utensils,
  X,
} from "lucide-react";
import {
  fetchMealPlanDishes,
  fetchMealPlan,
  saveMealPlan,
  autoGenerateMealPlan,
  copyMealPlan,
  Dish,
  MealType,
} from "@/lib/services/mealPlanService";
import { fetchUserProfile } from "@/lib/services/profileService";

/* ─── Helpers ─────────────────────────────────────────── */
const vnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";
const pad = (n: number) => String(n).padStart(2, "0");

// Ngày tính theo UTC để không bị lệch múi giờ
const addDays = (iso: string, n: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
};
const dayParts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
};
const weekLabel = (start: string) => {
  const a = dayParts(start);
  const b = dayParts(addDays(start, 6));
  return a.m === b.m
    ? `${a.d} – ${b.d} tháng ${a.m}, ${a.y}`
    : `${pad(a.d)}/${pad(a.m)} – ${pad(b.d)}/${pad(b.m)}/${b.y}`;
};
const weeksBetween = (from: string, to: string) => {
  const f = dayParts(from);
  const t = dayParts(to);
  const ms = Date.UTC(t.y, t.m - 1, t.d) - Date.UTC(f.y, f.m - 1, f.d);
  return Math.round(ms / (7 * 86400000));
};

type Plan = Record<string, string>; // key: `${dayIndex}-${mealType}` → dishId

// Tuần hiện tại
const CURRENT_WEEK = "2026-11-16";
const DEFAULT_LIMIT = 500000;

const MEALS: { id: MealType; label: string }[] = [
  { id: "breakfast", label: "Bữa sáng" },
  { id: "lunch", label: "Bữa trưa" },
  { id: "dinner", label: "Bữa tối" },
];
const WEEKDAYS = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

const NAV_ITEMS = [
  { href: "/", label: "Trang chủ", Icon: Home },
  { href: "/recipes", label: "Công thức", Icon: Utensils },
  { href: "/fridge", label: "Tủ lạnh thông minh", Icon: Refrigerator },
  { href: "/shopping", label: "Danh sách mua", Icon: ShoppingCart },
  { href: "/history", label: "Lịch sử ăn uống", Icon: Clock },
  { href: "/meal-plan", label: "Lên thực đơn", Icon: CalendarCheck },
  { href: "/profile", label: "Hồ sơ cá nhân", Icon: User },
];

/* ─── Mascot sidebar (TODO: thay bằng <ChibiChefMascot /> từ trang chủ) ─── */
function SidebarMascot() {
  return (
    <div className="flex select-none flex-col items-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#DDEBDD]/15 text-6xl" aria-hidden="true">
        👨‍🍳
      </div>
      <p className="mt-1 text-center text-[11px] font-medium italic leading-snug text-[#A3C4B6]">
        &ldquo;Ăn ngon mỗi ngày
        <br />
        cùng BếpSV nhé! ♡&rdquo;
      </p>
    </div>
  );
}

const MealIcon = ({ meal }: { meal: MealType }) =>
  meal === "breakfast" ? (
    <Sunrise className="h-7 w-7 text-orange-400" aria-hidden="true" />
  ) : meal === "lunch" ? (
    <Utensils className="h-7 w-7 text-emerald-700" aria-hidden="true" />
  ) : (
    <Moon className="h-7 w-7 fill-indigo-300 text-indigo-400" aria-hidden="true" />
  );

/* ─── Trang Lên thực đơn ──────────────────────────────── */
export default function MealPlanPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestRef = useRef<HTMLUListElement>(null);

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [userProfile, setUserProfile] = useState<{ name: string; avatarUrl?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [weekStart, setWeekStart] = useState(CURRENT_WEEK);
  const [plans, setPlans] = useState<Record<string, Plan>>({});
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [editingLimit, setEditingLimit] = useState(false);
  const [limitDraft, setLimitDraft] = useState("");
  const [picker, setPicker] = useState<{ day: number; meal: MealType } | null>(null);
  const [pickerQuery, setPickerQuery] = useState("");
  const [hiddenSuggestions, setHiddenSuggestions] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dishById = useMemo(() => {
    const map: Record<string, Dish> = {};
    for (const d of dishes) map[d.id] = d;
    return map;
  }, [dishes]);

  const plan = plans[weekStart] ?? {};

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };
  useEffect(() => () => void (toastTimer.current && clearTimeout(toastTimer.current)), []);

  // Tải thông tin người dùng và danh sách món từ backend
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prof, dishesList] = await Promise.all([
          fetchUserProfile().catch(() => null),
          fetchMealPlanDishes(),
        ]);
        if (prof?.name) {
          setUserProfile({ name: prof.name });
        }
        setDishes(dishesList);
      } catch (err: any) {
        setError(err?.message || "Không thể tải dữ liệu lên thực đơn");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Tải thực đơn của tuần khi thay đổi weekStart
  useEffect(() => {
    const fetchWeekPlan = async () => {
      try {
        const data = await fetchMealPlan(weekStart);
        if (data?.plan) {
          setPlans((prev) => ({ ...prev, [weekStart]: data.plan }));
        }
        if (data?.budget) {
          setLimit(data.budget);
        }
      } catch {
        // Tuần mới chưa có thực đơn
      }
    };
    fetchWeekPlan();
  }, [weekStart]);

  // Ctrl/Cmd + K để focus ô tìm kiếm
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") setPicker(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/recipes?q=${encodeURIComponent(q)}` : "/recipes");
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const setWeekPlan = (next: Plan) => setPlans((prev) => ({ ...prev, [weekStart]: next }));

  const total = useMemo(
    () => Object.values(plan).reduce((s, id) => s + (dishById[id]?.cost ?? 0), 0),
    [plan, dishById]
  );
  const remaining = limit - total;

  /* Thao tác trên ô */
  const setDish = async (day: number, meal: MealType, dishId: string) => {
    const next = { ...plan, [`${day}-${meal}`]: dishId };
    setWeekPlan(next);
    setPicker(null);
    try {
      await saveMealPlan(weekStart, limit, next);
    } catch (err: any) {
      showToast(err?.message || "Không thể lưu món ăn");
    }
  };

  const removeDish = async (day: number, meal: MealType) => {
    const next = { ...plan };
    delete next[`${day}-${meal}`];
    setWeekPlan(next);
    try {
      await saveMealPlan(weekStart, limit, next);
    } catch (err: any) {
      showToast(err?.message || "Không thể xóa món ăn");
    }
  };

  /* Gợi ý nhanh: thêm vào ô trống đầu tiên hợp bữa */
  const addSuggestion = (dish: Dish) => {
    for (let day = 0; day < 7; day++) {
      for (const meal of MEALS) {
        if (dish.meals.includes(meal.id) && !plan[`${day}-${meal.id}`]) {
          setDish(day, meal.id, dish.id);
          showToast(`Đã thêm “${dish.name}” vào ${meal.label.toLowerCase()} ${WEEKDAYS[day]}.`);
          return;
        }
      }
    }
    showToast("Không còn ô trống phù hợp trong tuần này.");
  };

  /* Lên thực đơn tự động cho các ô còn trống, trong hạn mức */
  const autoPlan = async () => {
    try {
      const data = await autoGenerateMealPlan(weekStart, limit, plan);
      if (data?.plan) {
        setWeekPlan(data.plan);
        showToast("Đã lên thực đơn tự động phù hợp với ngân sách của bạn!");
      }
    } catch (err: any) {
      showToast(err?.message || "Không thể tự động lên thực đơn");
    }
  };

  const copyPrevWeek = async () => {
    const prevWeekDate = addDays(weekStart, -7);
    try {
      const data = await copyMealPlan(prevWeekDate, weekStart);
      if (data?.plan) {
        setWeekPlan(data.plan);
        showToast("Đã sao chép thực đơn tuần trước thành công!");
      }
    } catch (err: any) {
      showToast(err?.message || "Tuần trước chưa có thực đơn để sao chép.");
    }
  };

  const commitLimit = async () => {
    const n = Number(limitDraft.replace(/\D/g, ""));
    if (n > 0) {
      setLimit(n);
      try {
        await saveMealPlan(weekStart, n, plan);
      } catch (err: any) {
        showToast(err?.message || "Không thể cập nhật hạn mức");
      }
    }
    setEditingLimit(false);
  };

  /* Điều hướng tuần */
  const weekOffset = weeksBetween(CURRENT_WEEK, weekStart);
  const gotoWeek = (offset: number) => setWeekStart(addDays(CURRENT_WEEK, offset * 7));

  /* Danh sách chọn món trong hộp thoại */
  const pickerDishes = useMemo(() => {
    if (!picker) return [];
    const q = pickerQuery.trim().toLowerCase();
    return dishes.filter((d) => d.meals.includes(picker.meal) && (!q || d.name.toLowerCase().includes(q)));
  }, [picker, pickerQuery, dishes]);
  const pickerCurrentCost = picker ? (dishById[plan[`${picker.day}-${picker.meal}`]]?.cost ?? 0) : 0;

  const suggestions = dishes
    .filter((d) => !hiddenSuggestions.includes(d.id))
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-[#F7F1EC] font-sans text-[#202B24]">
      {/* ─── SIDEBAR (chỉ hiện từ lg) ─── */}
      <aside className="sticky top-0 hidden h-screen w-[200px] shrink-0 flex-col justify-between border-r border-[#143d2f] bg-[#184B3A] px-3 py-5 lg:flex 2xl:w-[212px]">
        <div>
          <div className="flex flex-col items-center border-b border-[#235846] pb-4 text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#f4a340] bg-[#f4a340]/15 shadow-inner">
              <ChefHat className="h-7 w-7 text-[#f4a340]" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Bếp<span className="text-[#F4A340]">SV</span>
            </h1>
            <p className="mt-0.5 text-[11px] font-medium leading-tight text-[#A3C4B6]">
              Ăn ngon - Sống khỏe
              <br />
              Học tốt hơn!
            </p>
          </div>

          <nav className="mt-4 space-y-1" aria-label="Điều hướng chính">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all ${active
                    ? "bg-[#DDEBDD] font-bold text-[#184B3A] shadow-sm"
                    : "text-[#A3C4B6] hover:bg-[#205543] hover:text-white"
                    }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#184B3A]" : "text-[#8EAE9F]"}`} aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#235846] pt-3">
          <SidebarMascot />
        </div>
      </aside>

      {/* ─── CỘT NỘI DUNG ─── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <form onSubmit={handleSearch} className="relative max-w-xl flex-1" role="search">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#202B24]" aria-hidden="true" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm món ăn, nguyên liệu... (ví dụ: trứng, mì, rau muống)"
              aria-label="Tìm món ăn hoặc nguyên liệu"
              className="w-full rounded-full border border-[#EEE7DF] bg-[#FFFDF9] py-2.5 pl-11 pr-4 text-[13px] text-[#202B24] shadow-sm placeholder:text-[#9E9A93] focus:outline-none focus:ring-2 focus:ring-[#184B3A] sm:pr-20"
            />
            <kbd className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-[#EEE7DF] bg-[#F4EFEA] px-1.5 py-0.5 text-[10px] font-bold text-[#77736D] sm:block">
              Ctrl + K
            </kbd>
          </form>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="Thông báo, 3 chưa đọc"
              className="relative rounded-full p-2.5 transition-colors hover:bg-[#FAF4ED]"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-[#FAF4ED]"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#184B3A] text-xs font-bold text-white uppercase"
                aria-hidden="true"
              >
                {userProfile?.name
                  ? userProfile.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(-2)
                    .join("")
                  : "NA"}
              </span>
              <span className="hidden text-[13px] font-semibold sm:inline">
                {userProfile?.name ?? "Nguyễn Minh Anh"}
              </span>
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Menu cho màn hình nhỏ (thay sidebar) */}
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="Điều hướng chính">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${active ? "bg-[#184B3A] text-white" : "border border-[#EEE7DF] bg-[#FFFDF9] text-[#202B24]"
                  }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Thân trang */}
        <main className="flex flex-1 flex-col gap-4 px-4 pb-8 lg:px-6">
          {/* Tiêu đề */}
          <div className="relative shrink-0 overflow-hidden rounded-3xl">
            <div className="relative z-10 py-1">
              <h2 className="flex items-center gap-3 text-4xl font-black leading-tight text-[#184B3A]">
                <CalendarCheck className="h-12 w-12 shrink-0 text-emerald-700" aria-hidden="true" />
                <span>
                  Lên <span className="text-[#F4A340]">thực đơn</span>
                </span>
              </h2>
              <p className="mt-1 text-[15px] font-medium text-[#3f3b36]">
                Sắp xếp bữa ăn hợp túi tiền, đủ dinh dưỡng cả tuần
              </p>
            </div>
            <div
              className="pointer-events-none absolute right-6 top-0 hidden select-none gap-3 text-6xl opacity-80 md:flex"
              aria-hidden="true"
            >
              <span>🥬</span>
              <span>🍅</span>
              <span>👨‍🍳</span>
            </div>
          </div>

          {/* Thanh tổng kết */}
          <div className="flex shrink-0 flex-wrap items-center gap-4 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-4 shadow-sm">
            <div className="flex items-center gap-3 pr-4 sm:border-r sm:border-[#EEE7DF]">
              <span className="text-4xl" aria-hidden="true">
                🪙
              </span>
              <div>
                <p className="text-xs text-[#3f3b36]">Chi phí dự kiến tuần</p>
                <p className="text-2xl font-black">{vnd(total)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pr-4 sm:border-r sm:border-[#EEE7DF]">
              <span className="text-4xl" aria-hidden="true">
                🐷
              </span>
              <div>
                <p className="text-xs text-[#3f3b36]">Hạn mức tuần</p>
                {editingLimit ? (
                  <input
                    autoFocus
                    inputMode="numeric"
                    value={limitDraft}
                    onChange={(e) => setLimitDraft(e.target.value)}
                    onBlur={commitLimit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitLimit();
                      if (e.key === "Escape") setEditingLimit(false);
                    }}
                    aria-label="Hạn mức tuần (đồng)"
                    className="w-32 rounded-lg border border-[#EEE7DF] bg-white px-2 py-0.5 text-xl font-black focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setLimitDraft(String(limit));
                      setEditingLimit(true);
                    }}
                    title="Bấm để đổi hạn mức"
                    className="text-2xl font-black hover:underline"
                  >
                    {vnd(limit)}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pr-2">
              <span className="text-4xl" aria-hidden="true">
                👛
              </span>
              <div>
                <p className="text-xs text-[#3f3b36]">{remaining >= 0 ? "Còn lại" : "Vượt hạn mức"}</p>
                <p className={`text-2xl font-black ${remaining >= 0 ? "text-[#1F9D4D]" : "text-red-600"}`}>
                  {vnd(Math.abs(remaining))}
                </p>
              </div>
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={autoPlan}
                className="flex items-center gap-2 rounded-full border border-[#DCE6CF] bg-[#EAF2DC] px-7 py-3.5 text-sm font-semibold text-[#184B3A] shadow-sm transition-colors hover:bg-[#DFEBCB]"
              >
                <Sparkles className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                Lên thực đơn cho tôi
              </button>
              <button
                type="button"
                onClick={copyPrevWeek}
                className="flex items-center gap-2 rounded-full bg-[#FDE7C2] px-7 py-3.5 text-sm font-semibold text-[#C86218] shadow-sm transition-colors hover:bg-[#FBDCA9]"
              >
                <Copy className="h-5 w-5" aria-hidden="true" />
                Sao chép tuần trước
              </button>
            </div>
          </div>

          {/* Chọn tuần */}
          <div className="relative flex shrink-0 items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              aria-label="Tuần trước"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-[#EEE7DF] bg-[#F1ECE3] shadow-sm hover:bg-[#E9E3D8]"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="flex items-center gap-3 text-lg font-black">
              <CalendarDays className="h-7 w-7 text-[#184B3A]" aria-hidden="true" />
              {weekLabel(weekStart)}
            </p>
            <button
              type="button"
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              aria-label="Tuần sau"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-[#EEE7DF] bg-[#F1ECE3] shadow-sm hover:bg-[#E9E3D8]"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>

            <label className="absolute right-0 top-1/2 hidden -translate-y-1/2 sm:block">
              <span className="sr-only">Chọn tuần nhanh</span>
              <select
                value={weekOffset >= -1 && weekOffset <= 1 ? String(weekOffset) : "other"}
                onChange={(e) => e.target.value !== "other" && gotoWeek(Number(e.target.value))}
                className="cursor-pointer rounded-full border border-[#EEE7DF] bg-[#FFFDF9] px-5 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
              >
                <option value="-1">Tuần trước</option>
                <option value="0">Tuần này</option>
                <option value="1">Tuần sau</option>
                {(weekOffset < -1 || weekOffset > 1) && <option value="other">Tuần khác</option>}
              </select>
            </label>
          </div>

          {/* Lưới thực đơn */}
          <div className="overflow-x-auto rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] shadow-sm">
            <div className="grid min-w-[1000px] grid-cols-[84px_repeat(7,minmax(0,1fr))]">
              <div className="bg-[#EEF4E2]" aria-hidden="true" />
              {WEEKDAYS.map((name, day) => {
                const { d, m } = dayParts(addDays(weekStart, day));
                return (
                  <div key={name} className="bg-[#EEF4E2] px-2 py-3 text-center">
                    <p className="text-[15px] font-black">{name}</p>
                    <p className="text-xs text-[#3f3b36]">
                      ({pad(d)}/{pad(m)})
                    </p>
                  </div>
                );
              })}

              {MEALS.map((meal, mi) => (
                <React.Fragment key={meal.id}>
                  <div
                    className={`flex flex-col items-center justify-center gap-1 px-1 py-3 text-center ${mi === 1 ? "bg-[#E9F3E0]" : ""
                      }`}
                  >
                    <MealIcon meal={meal.id} />
                    <span className="text-sm font-bold leading-tight">{meal.label}</span>
                  </div>

                  {WEEKDAYS.map((name, day) => {
                    const dish = dishById[plan[`${day}-${meal.id}`]];
                    return (
                      <div key={name + meal.id} className={`p-1.5 ${mi === 1 ? "bg-[#F4F9EE]" : ""}`}>
                        {dish ? (
                          <div className="relative flex h-[96px] items-center gap-2 rounded-2xl border border-[#F0E9DF] bg-white p-2 pr-6 shadow-sm">
                            <span
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F8F4EC] text-3xl"
                              aria-hidden="true"
                            >
                              {dish.emoji}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="line-clamp-2 block text-[13px] font-semibold leading-tight">{dish.name}</span>
                              <span className="mt-0.5 block text-[11px] text-[#C86218]">{vnd(dish.cost)}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setPickerQuery("");
                                setPicker({ day, meal: meal.id });
                              }}
                              aria-label={`Đổi món ${meal.label.toLowerCase()} ${name}`}
                              className="absolute right-1 top-1 rounded-full p-0.5 text-[#3f3b36] hover:bg-[#F4EFEA]"
                            >
                              <Plus className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeDish(day, meal.id)}
                              aria-label={`Xóa món ${dish.name}`}
                              className="absolute bottom-1 right-1 rounded-full p-0.5 text-[#77736D] hover:bg-red-50 hover:text-red-500"
                            >
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setPickerQuery("");
                              setPicker({ day, meal: meal.id });
                            }}
                            aria-label={`Thêm món ${meal.label.toLowerCase()} ${name}`}
                            className="group flex h-[96px] w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#C5DEC8] bg-[#EEF6EB] text-xs font-semibold text-[#184B3A] transition-all hover:border-[#184B3A] hover:bg-[#E2F0DD]"
                          >
                            <span
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DDEBDD] text-[#184B3A] shadow-xs transition-transform group-hover:scale-110"
                              aria-hidden="true"
                            >
                              <Plus className="h-4 w-4" />
                            </span>
                            <span>Thêm món</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Gợi ý nhanh + Kiểm tra tủ lạnh */}
          <div className="flex shrink-0 flex-col gap-4 xl:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-4 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-4 shadow-sm">
              <div className="flex shrink-0 items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50" aria-hidden="true">
                  <Lightbulb className="h-8 w-8 fill-amber-300 text-amber-500" />
                </span>
                <div className="hidden sm:block">
                  <p className="text-lg font-black">Gợi ý nhanh</p>
                  <p className="text-xs text-[#77736D]">Món ngon, dễ nấu, tiết kiệm</p>
                </div>
              </div>

              {suggestions.length === 0 ? (
                <p className="flex-1 text-sm text-[#77736D]">Bạn đã xem hết gợi ý rồi.</p>
              ) : (
                <ul ref={suggestRef} className="flex min-w-0 flex-1 gap-3 overflow-x-auto pb-1">
                  {suggestions.map((dish) => (
                    <li
                      key={dish.id}
                      className="relative flex w-[132px] shrink-0 flex-col items-center rounded-2xl border border-[#F0E9DF] bg-[#FFFCF7] px-2 pb-2 pt-3"
                    >
                      <button
                        type="button"
                        onClick={() => addSuggestion(dish)}
                        aria-label={`Thêm ${dish.name} vào thực đơn`}
                        className="flex w-full flex-col items-center"
                      >
                        <span className="text-4xl" aria-hidden="true">
                          {dish.emoji}
                        </span>
                        <span className="mt-1 w-full truncate text-center text-xs font-semibold">{dish.name}</span>
                        <span className="text-[11px] text-[#C86218]">{vnd(dish.cost)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHiddenSuggestions((h) => [...h, dish.id])}
                        aria-label={`Ẩn gợi ý ${dish.name}`}
                        className="absolute right-1 top-1 rounded-full p-0.5 text-[#77736D] hover:bg-[#F4EFEA]"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={() => suggestRef.current?.scrollBy({ left: 280, behavior: "smooth" })}
                aria-label="Xem thêm gợi ý"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EEE7DF] bg-white shadow-sm hover:bg-[#FAF4ED]"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <Link
              href="/fridge"
              className="flex shrink-0 items-center gap-4 rounded-3xl border border-[#DCE6CF] bg-gradient-to-r from-[#EEF4E2] to-[#E4EEDA] p-5 shadow-sm transition-shadow hover:shadow-md xl:w-[340px]"
            >
              <span className="text-5xl" aria-hidden="true">
                🧊
              </span>
              <span className="flex-1 text-base font-bold leading-snug">
                Kiểm tra
                <br />
                <span className="font-semibold">Tủ lạnh thông minh</span>
              </span>
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </Link>
          </div>
        </main>
      </div>

      {/* Thông báo nhỏ */}
      <div aria-live="polite" className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2">
        {toast && (
          <p className="rounded-full bg-[#184B3A] px-5 py-2.5 text-sm font-semibold text-white shadow-lg">{toast}</p>
        )}
      </div>

      {/* Hộp thoại chọn món */}
      {picker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPicker(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="picker-title"
            className="relative flex max-h-[80vh] w-full max-w-md flex-col rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-5 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setPicker(null)}
              aria-label="Đóng"
              className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-stone-100"
            >
              <X className="h-4 w-4 text-stone-500" aria-hidden="true" />
            </button>

            <h3 id="picker-title" className="pr-8 text-base font-black">
              {MEALS.find((m) => m.id === picker.meal)?.label} • {WEEKDAYS[picker.day]} (
              {pad(dayParts(addDays(weekStart, picker.day)).d)}/{pad(dayParts(addDays(weekStart, picker.day)).m)})
            </h3>
            <p className="mb-3 text-xs text-[#77736D]">
              Còn lại {vnd(Math.max(remaining + pickerCurrentCost, 0))} trong hạn mức tuần
            </p>

            <input
              type="text"
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              placeholder="Tìm món..."
              aria-label="Tìm món trong danh sách"
              autoFocus
              className="mb-3 w-full rounded-full border border-[#EEE7DF] bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
            />

            <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto">
              {pickerDishes.length === 0 && (
                <li className="py-6 text-center text-sm text-[#77736D]">Không tìm thấy món phù hợp.</li>
              )}
              {pickerDishes.map((d) => {
                const over = d.cost > remaining + pickerCurrentCost;
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => setDish(picker.day, picker.meal, d.id)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-[#F0E9DF] bg-white p-2.5 text-left transition-colors hover:bg-[#FAF4ED]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F4EC] text-2xl" aria-hidden="true">
                        {d.emoji}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{d.name}</span>
                      <span className="text-right">
                        <span className="block text-xs font-bold text-[#C86218]">{vnd(d.cost)}</span>
                        {over && <span className="block text-[10px] font-semibold text-red-500">Vượt hạn mức</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {plan[`${picker.day}-${picker.meal}`] && (
              <button
                type="button"
                onClick={() => {
                  removeDish(picker.day, picker.meal);
                  setPicker(null);
                }}
                className="mt-3 rounded-full border border-red-200 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                Xóa món khỏi ô này
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
