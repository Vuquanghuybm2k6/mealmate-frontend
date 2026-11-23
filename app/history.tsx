"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Flame,
  History,
  Home,
  Leaf,
  Lightbulb,
  Moon,
  RefreshCw,
  Refrigerator,
  Search,
  ShoppingCart,
  Star,
  Sun,
  Sunrise,
  User,
  Utensils,
} from "lucide-react";
import { fetchMealLogs, fetchMealStatistics, MealLogItem, MealStatistics } from "@/lib/services/mealsService";
import { fetchUserProfile } from "@/lib/services/profileService";

/* ─── Helpers ─────────────────────────────────────────── */
const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`; // m: 0-11
const parseIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
};
const fmtVN = (iso: string) => {
  const { y, m, d } = parseIso(iso);
  return `${pad(d)}/${pad(m + 1)}/${y}`;
};
const num = (n: number) => new Intl.NumberFormat("vi-VN").format(Math.round(n));

const MACRO_COLORS = {
  calo: "#FB923C",
  protein: "#4CAF50",
  carb: "#3B82F6",
  fat: "#A78BFA",
};

const RANGES = [
  { id: "7d", label: "7 ngày", days: 7, bucket: 1 },
  { id: "30d", label: "30 ngày", days: 30, bucket: 5 },
  { id: "3m", label: "3 tháng", days: 90, bucket: 15 },
];

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const CHART_MAX = 2500;
const Y_TICKS = [2000, 1500, 1000, 500, 0];

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

/* ─── Ô thống kê ──────────────────────────────────────── */
function StatTile({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center rounded-2xl border border-[#F0E9DF] bg-[#FFFCF7] px-2 py-3 text-center shadow-sm">
      <div className="mb-1 flex h-9 w-9 items-center justify-center">{icon}</div>
      <p className="max-w-full truncate text-lg font-black leading-tight">{value}</p>
      <p className="mt-0.5 text-xs text-[#5f5b55]">{label}</p>
    </div>
  );
}

/* ─── Vòng tròn tổng kết tuần ─────────────────────────── */
function WeekDonut({ total, parts }: { total: number; parts: Array<{ label: string; color: string; value: number }> }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const sum = parts.reduce((s, p) => s + p.value, 0) || 1;
  let acc = 0;
  return (
    <div
      className="relative h-[160px] w-[160px] shrink-0"
      role="img"
      aria-label={`Tổng ${num(total)} kcal trong tuần`}
    >
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90" aria-hidden="true">
        {total === 0 ? (
          <circle cx="70" cy="70" r={r} fill="none" stroke="#E3EEE6" strokeWidth="16" />
        ) : (
          parts.map((p) => {
            const len = (p.value / sum) * c;
            const el = (
              <circle
                key={p.label}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={p.color}
                strokeWidth="16"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-acc}
              />
            );
            acc += len;
            return el;
          })
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-black leading-none">{num(total)}</span>
        <span className="mt-0.5 text-sm font-semibold text-[#3f3b36]">kcal</span>
      </div>
    </div>
  );
}

const MealIcon = ({ kind }: { kind: "morning" | "noon" | "night" }) =>
  kind === "morning" ? (
    <Sunrise className="h-9 w-9 text-orange-400" aria-hidden="true" />
  ) : kind === "noon" ? (
    <Sun className="h-9 w-9 text-amber-400" aria-hidden="true" />
  ) : (
    <Moon className="h-9 w-9 fill-indigo-400 text-indigo-400" aria-hidden="true" />
  );

/* ─── Trang Lịch sử ăn uống ───────────────────────────── */
export default function HistoryPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(() => {
    const d = new Date();
    return toIso(d.getFullYear(), d.getMonth(), d.getDate());
  });
  const [view, setView] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [range, setRange] = useState("7d");
  const [userName, setUserName] = useState("Vũ Quang Huy");
  const [mealLogs, setMealLogs] = useState<MealLogItem[]>([]);
  const [mealStats, setMealStats] = useState<MealStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [logsRes, statsRes, profRes] = await Promise.allSettled([
        fetchMealLogs(),
        fetchMealStatistics(),
        fetchUserProfile(),
      ]);

      if (logsRes.status === "fulfilled") {
        setMealLogs(logsRes.value);
        // Nếu ngày hôm nay chưa có món mà có món gần nhất, tự chọn ngày gần nhất
        if (logsRes.value.length > 0) {
          const dates = logsRes.value.map((m) => m.eatenAt.slice(0, 10));
          if (!dates.includes(selected)) {
            const latest = dates.sort().reverse()[0];
            setSelected(latest);
            const { y, m } = parseIso(latest);
            setView({ y, m });
          }
        }
      } else {
        setError(logsRes.reason?.message || "Không thể tải lịch sử ăn uống");
      }

      if (statsRes.status === "fulfilled") {
        setMealStats(statsRes.value);
      }

      if (profRes.status === "fulfilled" && profRes.value?.name) {
        setUserName(profRes.value.name);
      }
    } catch (err: any) {
      setError(err?.message || "Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Ctrl/Cmd + K để focus ô tìm kiếm
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
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

  const hasData = (iso: string) => mealLogs.some((m) => m.eatenAt.slice(0, 10) === iso);

  /* Lịch: luôn 6 hàng x 7 cột, tuần bắt đầu từ Thứ Hai */
  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const offset = (first.getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, i) => {
      const dt = new Date(view.y, view.m, 1 - offset + i);
      return {
        iso: toIso(dt.getFullYear(), dt.getMonth(), dt.getDate()),
        day: dt.getDate(),
        inMonth: dt.getMonth() === view.m,
      };
    });
  }, [view]);

  const shiftMonth = (delta: number) =>
    setView((v) => {
      const dt = new Date(v.y, v.m + delta, 1);
      return { y: dt.getFullYear(), m: dt.getMonth() };
    });

  const selectDate = (iso: string) => {
    if (!iso) return;
    setSelected(iso);
    const { y, m } = parseIso(iso);
    setView({ y, m });
  };

  /* Bữa ăn + thống kê của ngày đang chọn */
  const selectedMeals = mealLogs.filter((m) => m.eatenAt.slice(0, 10) === selected);
  const dayKcal = selectedMeals.reduce((s, m) => s + m.kcal, 0);
  const dayProtein = Math.round(dayKcal * 0.04); // ước tính gam protein thực tế từ kcal
  const dayVeg = Math.round(selectedMeals.length * 35); // ước tính gam rau củ quả từ số bữa

  /* Biểu đồ: N ngày kết thúc ở ngày đang chọn */
  const rangeCfg = RANGES.find((r) => r.id === range) ?? RANGES[0];
  const chart = useMemo(() => {
    const { y, m, d } = parseIso(selected);
    const days = Array.from({ length: rangeCfg.days }, (_, i) => {
      const dt = new Date(y, m, d - (rangeCfg.days - 1 - i));
      const iso = toIso(dt.getFullYear(), dt.getMonth(), dt.getDate());
      const dayMeals = mealLogs.filter((item) => item.eatenAt.slice(0, 10) === iso);
      const calo = dayMeals.reduce((s, item) => s + item.kcal, 0);
      return {
        dt,
        has: dayMeals.length > 0,
        calo,
        protein: calo * 0.2,
        carb: calo * 0.5,
        fat: calo * 0.3,
      };
    });

    const out = [];
    for (let i = 0; i < days.length; i += rangeCfg.bucket) {
      const chunk = days.slice(i, i + rangeCfg.bucket);
      const valid = chunk.filter((x) => x.has);
      const avg = (k: "calo" | "protein" | "carb" | "fat") =>
        valid.length ? valid.reduce((s, x) => s + x[k], 0) / valid.length : 0;
      const last = chunk[chunk.length - 1].dt;
      const ddmm = `${pad(last.getDate())}/${pad(last.getMonth() + 1)}`;
      out.push({
        key: ddmm + i,
        top: rangeCfg.bucket === 1 ? WEEKDAYS[(last.getDay() + 6) % 7] : "Đến",
        bottom: ddmm,
        calo: avg("calo"),
        protein: avg("protein"),
        carb: avg("carb"),
        fat: avg("fat"),
      });
    }
    return out;
  }, [selected, rangeCfg, mealLogs]);

  const monthLabel = `Tháng ${view.m + 1}, ${view.y}`;

  const weekSummaryTotal = mealStats?.totalKcal || dayKcal;
  const weekSummaryParts = [
    { label: "Calo", color: MACRO_COLORS.calo, value: 35 },
    { label: "Protein", color: MACRO_COLORS.protein, value: 25 },
    { label: "Carb", color: MACRO_COLORS.carb, value: 25 },
    { label: "Fat", color: MACRO_COLORS.fat, value: 15 },
  ];
  const weekSummaryMessage =
    mealLogs.length > 0
      ? `Bạn đã ghi nhận ${mealLogs.length} bữa ăn trong hệ thống!`
      : "Chưa có bữa ăn nào được ghi nhận. Hãy bắt đầu ghi nhận bữa ăn hôm nay!";

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
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#184B3A] text-xs font-bold text-white"
                aria-hidden="true"
              >
                {userName.split(" ").slice(-1)[0]?.slice(0, 2).toUpperCase() || "HU"}
              </span>
              <span className="hidden text-[13px] font-semibold sm:inline">{userName}</span>
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
          {/* Banner tiêu đề */}
          <div className="relative h-[115px] shrink-0 overflow-hidden rounded-3xl border border-[#EEE7DF] bg-gradient-to-r from-[#FFF8EC] via-[#F6F3DF] to-[#E3EDC8] shadow-sm">
            <div className="relative z-10 flex h-full flex-col justify-center px-6">
              <h2 className="flex items-center gap-3 text-4xl font-black leading-tight text-[#184B3A]">
                <History className="h-11 w-11 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                Lịch sử ăn uống
              </h2>
              <p className="mt-1 text-sm font-medium text-[#3f3b36]">
                Theo dõi thói quen ăn uống, khám phá dinh dưỡng và sống khỏe hơn mỗi ngày!
              </p>
            </div>
            <div
              className="pointer-events-none absolute bottom-0 right-10 hidden select-none text-[84px] leading-none sm:block"
              aria-hidden="true"
            >
              <span className="-mb-4 inline-block translate-y-3">🥗</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            {/* ═════ CỘT CHÍNH ═════ */}
            <section className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="flex flex-col gap-4 xl:flex-row">
                {/* Lịch */}
                <div className="shrink-0 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-4 shadow-sm xl:w-[325px]">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2.5 text-lg font-black">
                      <CalendarDays className="h-8 w-8 text-[#184B3A]" aria-hidden="true" />
                      {monthLabel}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => shiftMonth(-1)}
                        aria-label="Tháng trước"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EEE7DF] bg-white shadow-sm hover:bg-[#FAF4ED]"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => shiftMonth(1)}
                        aria-label="Tháng sau"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EEE7DF] bg-white shadow-sm hover:bg-[#FAF4ED]"
                      >
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-y-1 text-center">
                    {WEEKDAYS.map((w) => (
                      <span key={w} className="py-1.5 text-xs font-bold">
                        {w}
                      </span>
                    ))}
                    {cells.map((c) => {
                      const isSel = c.iso === selected;
                      return (
                        <button
                          key={c.iso}
                          type="button"
                          onClick={() => selectDate(c.iso)}
                          aria-pressed={isSel}
                          aria-label={`Ngày ${fmtVN(c.iso)}`}
                          className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-colors ${isSel
                              ? "bg-[#1F7A4D] font-bold text-white"
                              : c.inMonth
                                ? "font-medium hover:bg-[#EAF5EC]"
                                : "text-[#B5B0A8] hover:bg-[#F4EFEA]"
                            }`}
                        >
                          {c.day}
                          {!isSel && c.inMonth && hasData(c.iso) && (
                            <span
                              className="absolute bottom-0.5 h-1 w-1 rounded-full bg-emerald-500"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Thống kê + biểu đồ */}
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatTile
                      icon={<Utensils className="h-8 w-8 text-emerald-700" aria-hidden="true" />}
                      value={`${selectedMeals.length} bữa`}
                      label="Trong ngày"
                    />
                    <StatTile
                      icon={<Flame className="h-8 w-8 fill-orange-400 text-orange-500" aria-hidden="true" />}
                      value={`${num(dayKcal)} kcal`}
                      label="Tổng năng lượng"
                    />
                    <StatTile
                      icon={<span className="text-3xl" aria-hidden="true">💪</span>}
                      value={`${dayProtein} g`}
                      label="Protein"
                    />
                    <StatTile
                      icon={<Leaf className="h-8 w-8 fill-emerald-500 text-emerald-600" aria-hidden="true" />}
                      value={`${dayVeg} g`}
                      label="Rau củ quả"
                    />
                  </div>

                  <div className="min-w-0 flex-1 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-4 shadow-sm">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="flex items-center gap-2 text-[15px] font-black">
                        <BarChart3 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                        Biểu đồ dinh dưỡng trong tuần
                      </h3>
                      <div className="flex rounded-full bg-[#F4EFEA] p-0.5" role="tablist" aria-label="Khoảng thời gian">
                        {RANGES.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            role="tab"
                            aria-selected={range === r.id}
                            onClick={() => setRange(r.id)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${range === r.id ? "bg-[#184B3A] text-white" : "text-[#3f3b36] hover:bg-white"
                              }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex">
                          <div className="flex h-[120px] w-10 shrink-0 flex-col justify-between pr-2 text-right text-[10px] text-[#5f5b55]">
                            {Y_TICKS.map((t) => (
                              <span key={t} className="leading-none">
                                {num(t)}
                              </span>
                            ))}
                          </div>
                          <div className="relative h-[120px] min-w-0 flex-1" role="img" aria-label="Biểu đồ cột dinh dưỡng">
                            {Y_TICKS.map((t, i) => (
                              <div
                                key={t}
                                className="absolute left-0 right-0 border-t border-[#EEE7DF]"
                                style={{ top: `${(i / (Y_TICKS.length - 1)) * 100}%` }}
                                aria-hidden="true"
                              />
                            ))}
                            <div className="absolute inset-0 flex items-end justify-around">
                              {chart.map((b) => (
                                <div key={b.key} className="flex h-full items-end gap-[2px]">
                                  {(["calo", "protein", "carb", "fat"] as const).map((k) => (
                                    <div
                                      key={k}
                                      title={`${k}: ${num(b[k])}`}
                                      className="w-[7px] rounded-t-md transition-all duration-500"
                                      style={{
                                        height: `${Math.min(b[k] / CHART_MAX, 1) * 100}%`,
                                        backgroundColor: MACRO_COLORS[k],
                                      }}
                                    />
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="ml-10 mt-1 flex justify-around text-center text-[11px] text-[#3f3b36]">
                          {chart.map((b) => (
                            <span key={b.key} className="leading-tight">
                              {b.top}
                              <br />
                              <span className="text-[#77736D]">{b.bottom}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      <ul className="hidden shrink-0 flex-col justify-center gap-2 text-xs sm:flex">
                        {(
                          [
                            ["Calo", MACRO_COLORS.calo],
                            ["Protein", MACRO_COLORS.protein],
                            ["Carb", MACRO_COLORS.carb],
                            ["Fat", MACRO_COLORS.fat],
                          ] as const
                        ).map(([label, color]) => (
                          <li key={label} className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chi tiết lịch sử */}
              <div className="shrink-0">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
                  <h3 className="flex items-center gap-2.5 text-lg font-black">
                    <ClipboardList className="h-7 w-7 text-emerald-700" aria-hidden="true" />
                    Chi tiết lịch sử
                  </h3>
                  <label className="flex cursor-pointer items-center gap-2 rounded-full border border-[#EEE7DF] bg-[#FFFDF9] px-4 py-2 text-[13px] font-semibold shadow-sm">
                    <CalendarDays className="h-4 w-4 text-[#184B3A]" aria-hidden="true" />
                    <input
                      type="date"
                      value={selected}
                      onChange={(e) => selectDate(e.target.value)}
                      aria-label="Chọn ngày xem chi tiết"
                      className="cursor-pointer bg-transparent text-[13px] font-semibold focus:outline-none"
                    />
                  </label>
                </div>

                <div className="overflow-hidden rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] shadow-sm">
                  {error ? (
                    <div className="p-8 text-center">
                      <p className="text-sm font-semibold text-red-600">{error}</p>
                      <button
                        onClick={loadData}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#184B3A] px-4 py-2 text-xs font-bold text-white hover:bg-[#12392c]"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Thử lại
                      </button>
                    </div>
                  ) : loading && mealLogs.length === 0 ? (
                    <div className="space-y-3 p-6">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="h-20 animate-pulse rounded-2xl bg-[#F0E9DF]/60" />
                      ))}
                    </div>
                  ) : selectedMeals.length === 0 ? (
                    <p className="p-10 text-center text-sm text-[#77736D]">
                      Chưa có bữa ăn nào được ghi nhận vào ngày {fmtVN(selected)}.
                    </p>
                  ) : (
                    <ul>
                      {selectedMeals.map((m) => {
                        const kind =
                          m.mealType === "breakfast" ? "morning" : m.mealType === "lunch" ? "noon" : "night";
                        const label =
                          m.mealType === "breakfast"
                            ? "Bữa sáng"
                            : m.mealType === "lunch"
                              ? "Bữa trưa"
                              : "Bữa tối";
                        const time = new Date(m.eatenAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        return (
                          <li
                            key={m.id}
                            className="flex flex-col gap-3 border-b border-[#F0E9DF] px-4 py-3 last:border-b-0 md:flex-row md:items-center"
                          >
                            <div className="flex w-40 shrink-0 items-center gap-3">
                              <MealIcon kind={kind} />
                              <div>
                                <p className="text-sm font-bold leading-tight">{label}</p>
                                <p className="text-sm text-[#3f3b36]">({time})</p>
                              </div>
                            </div>

                            <ul className="flex flex-1 flex-wrap gap-2 md:border-l md:border-[#EEE7DF] md:pl-4">
                              <li className="flex w-[120px] flex-col items-center rounded-2xl bg-[#F8F4EC] px-2 py-1.5 text-center">
                                <span className="text-3xl leading-none" aria-hidden="true">
                                  🍲
                                </span>
                                <span
                                  className="mt-1 w-full truncate text-xs font-semibold"
                                  title={m.recipeTitle || "Món ăn tự nấu"}
                                >
                                  {m.recipeTitle || "Món ăn tự nấu"}
                                </span>
                              </li>
                            </ul>

                            <div className="shrink-0 md:w-52 md:border-l md:border-[#EEE7DF] md:pl-5">
                              <p className="flex items-center gap-1.5 text-sm font-black">
                                <Flame className="h-4 w-4 fill-emerald-600 text-emerald-700" aria-hidden="true" />
                                {m.kcal} kcal
                              </p>
                              <p className="mt-1.5 text-xs text-[#5f5b55]">Chi phí: {num(m.cost)}đ</p>
                            </div>

                            {m.recipeId ? (
                              <Link
                                href={`/recipes/${m.recipeId}`}
                                className="flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#EEE7DF] bg-white px-4 py-2 text-xs font-semibold text-[#184B3A] shadow-sm transition-colors hover:bg-[#FAF4ED]"
                              >
                                Xem công thức <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                              </Link>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </section>

            {/* ═════ CỘT PHẢI ═════ */}
            <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[310px] 2xl:w-[340px]">
              {/* Tổng kết tuần */}
              <div className="shrink-0 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-4 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-[15px] font-black">
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" aria-hidden="true" />
                  Tổng kết tuần
                </h3>

                <div className="mb-4 flex items-center justify-center gap-4">
                  <WeekDonut total={weekSummaryTotal} parts={weekSummaryParts} />
                  <ul className="space-y-2.5 text-[13px]">
                    {weekSummaryParts.map((p) => (
                      <li key={p.label} className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} aria-hidden="true" />
                        {p.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-[#EAF5EC] p-3.5">
                  <p className="relative z-10 flex items-center gap-3 text-[13px] font-medium leading-snug">
                    <CheckCircle2 className="h-7 w-7 shrink-0 fill-emerald-500 text-white" aria-hidden="true" />
                    {weekSummaryMessage}
                  </p>
                  <span className="absolute -bottom-2 right-1 select-none text-3xl opacity-80" aria-hidden="true">
                    🌿
                  </span>
                </div>
              </div>

              {/* Mẹo nhỏ */}
              <div className="shrink-0 rounded-3xl border border-[#EEE7DF] bg-gradient-to-br from-[#FFFDF9] to-[#FBF4E4] p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-[15px] font-black">
                    <Lightbulb className="h-5 w-5 fill-amber-300 text-amber-500" aria-hidden="true" />
                    Mẹo nhỏ
                  </h3>
                  <Link
                    href="/tips"
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#184B3A] hover:underline"
                  >
                    Xem thêm <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-6xl" aria-hidden="true">
                    🥛
                  </span>
                  <p className="text-[13px] leading-snug">
                    <span className="font-bold">Uống đủ nước</span>
                    <br />
                    <span className="text-[#3f3b36]">(1.5 - 2 lít/ngày) giúp cơ thể khỏe mạnh hơn!</span>
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
