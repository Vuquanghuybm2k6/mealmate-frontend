"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarCheck,
  CalendarDays,
  ChefHat,
  ChevronDown,
  Clock,
  Home,
  Leaf,
  Lightbulb,
  RefreshCw,
  Refrigerator,
  Search,
  ShoppingBasket,
  ShoppingCart,
  Star,
  User,
  Utensils,
  Plus,
  Trash2,
  Sparkles,
  X,
  FileText,
} from "lucide-react";
import {
  fetchFridgeItems,
  fetchFridgeSuggestions,
  addFridgeItem,
  removeFridgeItem,
  parseFridgeText,
  fetchMasterIngredients,
  FridgeItem,
  FridgeSuggestion,
  MasterIngredient,
} from "@/lib/services/fridgeService";
import { fetchUserProfile } from "@/lib/services/profileService";

/* ─── Types & Category Visual Helpers ───────────────── */
type DisplayIngredient = {
  id: string;
  name: string;
  emoji: string;
  daysLeft: number;
  category: string;
  quantity: number;
  unit: string;
};

const EXPIRING_LIMIT = 3;

const getCategoryEmoji = (name: string, category: string): string => {
  const lower = (name + " " + category).toLowerCase();
  if (lower.includes("trứng")) return "🥚";
  if (lower.includes("rau") || lower.includes("cải") || lower.includes("muống")) return "🥬";
  if (lower.includes("cà chua")) return "🍅";
  if (lower.includes("đậu") || lower.includes("hũ")) return "🧈";
  if (lower.includes("mì")) return "🍜";
  if (lower.includes("gạo") || lower.includes("cơm")) return "🍚";
  if (lower.includes("thịt") || lower.includes("heo") || lower.includes("bò")) return "🥩";
  if (lower.includes("gà")) return "🍗";
  if (lower.includes("cá") || lower.includes("tôm") || lower.includes("hải sản")) return "🐟";
  if (lower.includes("quả") || lower.includes("táo") || lower.includes("chuối")) return "🍎";
  if (category.toLowerCase().includes("đạm")) return "🥩";
  if (category.toLowerCase().includes("tinh bột")) return "🍚";
  return "🥗";
};

const calculateDaysLeft = (addedAt: string, category: string): number => {
  const addedDate = new Date(addedAt);
  const diffDays = Math.floor((Date.now() - addedDate.getTime()) / (1000 * 3600 * 24));
  let shelfLife = 7;
  const cat = category.toLowerCase();
  if (cat.includes("đạm") || cat.includes("thịt") || cat.includes("hải sản")) {
    shelfLife = 3;
  } else if (cat.includes("rau")) {
    shelfLife = 4;
  } else if (cat.includes("tinh bột") || cat.includes("gia vị")) {
    shelfLife = 30;
  }
  return Math.max(1, shelfLife - diffDays);
};

const TIP = {
  title: "Mẹo nhỏ từ BếpSV",
  text: "Bảo quản rau xanh trong hộp kín và để ở ngăn mát giúp giữ độ tươi lâu hơn nhé!",
};

const NAV_ITEMS = [
  { href: "/", label: "Trang chủ", Icon: Home },
  { href: "/recipes", label: "Công thức", Icon: Utensils },
  { href: "/fridge", label: "Tủ lạnh thông minh", Icon: Refrigerator },
  { href: "/shopping", label: "Danh sách mua", Icon: ShoppingCart },
  { href: "/history", label: "Lịch sử ăn uống", Icon: Clock },
  { href: "/meal-plan", label: "Lên thực đơn", Icon: CalendarCheck },
  { href: "/profile", label: "Hồ sơ cá nhân", Icon: User },
];

/* ─── Helpers ─────────────────────────────────────────── */
const pad = (n: number) => String(n).padStart(2, "0");
const formatNow = () => {
  const d = new Date();
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} • ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Màu theo số ngày còn lại: <=2 đỏ, <=3 cam, còn lại xanh/vàng
const urgency = (days: number) =>
  days <= 2
    ? { dot: "bg-red-500", text: "text-red-600", chip: "bg-red-50" }
    : days <= 3
      ? { dot: "bg-orange-500", text: "text-orange-600", chip: "bg-orange-50" }
      : { dot: "bg-amber-400", text: "text-amber-600", chip: "bg-amber-50" };

/* ─── Ảnh có fallback ─────────────────────────────────── */
function FoodImage({ src, alt, emoji, className = "" }: { src?: string; alt: string; emoji: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 text-6xl`}
      >
        {emoji}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />
  );
}

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

/* ─── Vòng tròn dung tích ─────────────────────────────── */
function SpaceRing({ percent }: { percent: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative h-[130px] w-[130px]"
        role="img"
        aria-label={`Dung tích còn lại ${percent}%`}
      >
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#E3EEE6" strokeWidth="9" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="#1F7A4D"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - percent / 100)}
            className="transition-all duration-700"
          />
        </svg>
        <Refrigerator
          className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-[#3b7a57]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
      <p className="mt-2 text-3xl font-black leading-none text-[#1F7A4D]">{percent}%</p>
      <p className="mt-1 text-xs text-[#5f5b55]">Dung tích còn lại</p>
    </div>
  );
}

/* ─── Ô thống kê ──────────────────────────────────────── */
function StatTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-[#FAF5EE] px-2 py-3 text-center">
      <div className="mb-1.5 flex h-10 w-10 items-center justify-center">{icon}</div>
      <p className="text-xl font-black leading-tight">{value}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-[#77736D]">{label}</p>
    </div>
  );
}

/* ─── Trang Tủ lạnh thông minh ────────────────────────── */
export default function FridgePage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<DisplayIngredient[]>([]);
  const [suggestions, setSuggestions] = useState<FridgeSuggestion[]>([]);
  const [userName, setUserName] = useState("Vũ Quang Huy");

  // State cho Modal thêm thủ công & NLP parse text
  const [showAddModal, setShowAddModal] = useState(false);
  const [showParseModal, setShowParseModal] = useState(false);
  const [masterIngredients, setMasterIngredients] = useState<MasterIngredient[]>([]);
  const [masterLoading, setMasterLoading] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [quantityInput, setQuantityInput] = useState("1");
  const [parseText, setParseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadMasterIngredients = async () => {
    if (masterIngredients.length > 0) return;
    try {
      setMasterLoading(true);
      const data = await fetchMasterIngredients();
      setMasterIngredients(data);
      if (data.length > 0 && !selectedIngredientId) {
        setSelectedIngredientId(data[0].id);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setMasterLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Xác nhận xóa "${name}" khỏi tủ lạnh?`)) return;
    try {
      setDeletingId(id);
      await removeFridgeItem(id);
      setIngredients((prev) => prev.filter((i) => i.id !== id));
      showToast(`Đã xóa ${name} khỏi tủ lạnh!`);
      loadData(true);
    } catch (err: any) {
      alert(err.message || "Không thể xóa nguyên liệu");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredientId) {
      alert("Vui lòng chọn một nguyên liệu");
      return;
    }
    const qty = parseFloat(quantityInput);
    if (isNaN(qty) || qty <= 0) {
      alert("Vui lòng nhập số lượng hợp lệ (> 0)");
      return;
    }

    try {
      setSubmitting(true);
      await addFridgeItem({ ingredientId: selectedIngredientId, quantity: qty });
      setShowAddModal(false);
      setQuantityInput("1");
      showToast("Đã thêm nguyên liệu vào tủ lạnh thành công!");
      await loadData(true);
    } catch (err: any) {
      alert(err.message || "Không thể thêm nguyên liệu vào tủ lạnh");
    } finally {
      setSubmitting(false);
    }
  };

  const handleParseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parseText.trim()) {
      alert("Vui lòng nhập hoặc dán danh sách nguyên liệu");
      return;
    }

    try {
      setSubmitting(true);
      const result = await parseFridgeText(parseText, true);
      setShowParseModal(false);
      setParseText("");
      const count = result.items?.length || 0;
      if (count > 0) {
        showToast(`Đã nhận diện & thêm thành công ${count} nguyên liệu vào tủ!`);
      } else {
        showToast("Không tìm thấy nguyên liệu khớp trong văn bản");
      }
      await loadData(true);
    } catch (err: any) {
      alert(err.message || "Không thể nhận diện văn bản");
    } finally {
      setSubmitting(false);
    }
  };

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [itemsRes, suggsRes, profRes] = await Promise.allSettled([
        fetchFridgeItems(),
        fetchFridgeSuggestions(),
        fetchUserProfile(),
      ]);

      if (itemsRes.status === "fulfilled") {
        const mapped: DisplayIngredient[] = itemsRes.value.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          emoji: getCategoryEmoji(item.name, item.category),
          daysLeft: calculateDaysLeft(item.addedAt, item.category),
        }));
        setIngredients(mapped);
      } else {
        setError(itemsRes.reason?.message || "Không thể tải nguyên liệu tủ lạnh");
      }

      if (suggsRes.status === "fulfilled") {
        setSuggestions(suggsRes.value);
      }

      if (profRes.status === "fulfilled" && profRes.value?.name) {
        setUserName(profRes.value.name);
      }

      setUpdatedAt(formatNow());
    } catch (err: any) {
      setError(err?.message || "Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const handleRefresh = () => {
    if (refreshing || loading) return;
    loadData(true);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const expiring = ingredients
    .filter((i) => i.daysLeft <= EXPIRING_LIMIT)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);
  const soonestDays = ingredients.length > 0 ? Math.min(...ingredients.map((i) => i.daysLeft)) : null;
  const soonest = soonestDays !== null ? ingredients.find((i) => i.daysLeft === soonestDays) : null;
  const spacePercent = Math.max(0, Math.min(100, Math.round(100 - (ingredients.length / 20) * 100)));
  const topSuggestion = suggestions.length > 0 ? suggestions[0] : null;

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
              Học tốt cả đời
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
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all ${
                    active
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
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  active ? "bg-[#184B3A] text-white" : "border border-[#EEE7DF] bg-[#FFFDF9] text-[#202B24]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Thân trang */}
        <main className="flex flex-1 flex-col gap-4 px-4 pb-8 lg:flex-row lg:px-6">
          {/* ═════ CỘT CHÍNH ═════ */}
          <section className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Hero */}
            <div className="relative h-[240px] shrink-0 overflow-hidden rounded-3xl border border-[#EEE7DF] bg-gradient-to-r from-[#FFFBF5] via-[#FAF3E8] to-[#F2E7D3] shadow-sm">
              <div className="relative z-10 flex h-full max-w-[400px] flex-col justify-center p-6 sm:p-8">
                <h2 className="text-4xl font-black leading-[1.05] text-[#184B3A] 2xl:text-[46px]">Tủ lạnh</h2>
                <p className="text-4xl font-black leading-[1.05] tracking-tight text-[#E86B1F] 2xl:text-[46px]">
                  thông minh.
                </p>
                <p className="mt-3 text-[13px] font-medium leading-snug text-[#3f3b36]">
                  Theo dõi nguyên liệu, nhận gợi ý món ăn
                  <br />
                  và không lo bỏ phí thực phẩm!
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(true);
                      loadMasterIngredients();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#184B3A] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-[#12392c] active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Thêm thực phẩm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowParseModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E5DA] bg-white/90 px-3.5 py-2 text-xs font-bold text-[#184B3A] shadow-sm transition-all hover:bg-white active:scale-[0.98]"
                  >
                    <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
                    Nhập văn bản nhanh
                  </button>
                </div>
              </div>

              <div className="absolute right-0 top-0 hidden h-full w-[52%] sm:block">
                <FoodImage
                  src={undefined}
                  alt="Tủ lạnh đầy rau củ và thực phẩm"
                  emoji="🧊"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#FAF3E8] via-[#FAF3E8]/80 to-transparent" />
                {soonest && (
                  <div className="absolute right-6 top-8 flex rotate-6 items-center gap-2.5 rounded-2xl bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-xl" aria-hidden="true">
                      {soonest.emoji}
                    </span>
                    <span>
                      <span className="block text-[13px] font-black">Còn {soonest.daysLeft} ngày</span>
                      <span className="block text-[11px] text-[#77736D]">{soonest.name}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tình trạng tủ lạnh */}
            <div className="shrink-0 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2.5 text-base font-black">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100" aria-hidden="true">
                    <Refrigerator className="h-5 w-5 text-emerald-700" />
                  </span>
                  Tình trạng tủ lạnh của bạn
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#77736D]">
                  <span>Cập nhật: {updatedAt || "--/--/---- • --:--"}</span>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    aria-label="Làm mới trạng thái tủ lạnh"
                    className="rounded-full p-1.5 text-[#184B3A] transition-colors hover:bg-[#F4EFEA]"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-5 md:flex-row">
                <div className="flex shrink-0 items-center justify-center md:w-[190px] md:border-r md:border-[#EEE7DF] md:pr-5">
                  <SpaceRing percent={spacePercent} />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="mb-3 flex items-center gap-2 text-[13px] font-bold">
                    <AlertCircle className="h-5 w-5 fill-red-500 text-white" aria-hidden="true" />
                    Nguyên liệu sắp hết
                  </h4>

                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
                      <p className="text-xs font-semibold text-red-700">{error}</p>
                      <button
                        onClick={() => loadData(false)}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
                      >
                        <RefreshCw className="h-3 w-3" /> Thử lại
                      </button>
                    </div>
                  ) : loading && ingredients.length === 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="h-28 animate-pulse rounded-2xl bg-[#F0E9DF]/60" />
                      ))}
                    </div>
                  ) : expiring.length === 0 ? (
                    <p className="rounded-2xl bg-[#FAF5EE] p-4 text-center text-xs text-[#77736D]">
                      Chưa có nguyên liệu nào sắp hết hạn. Tuyệt vời!
                    </p>
                  ) : (
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {expiring.map((i) => {
                        const u = urgency(i.daysLeft);
                        return (
                          <li
                            key={i.id}
                            className="flex flex-col items-center rounded-2xl border border-[#F0E9DF] bg-[#FFFCF7] px-2 pb-3 pt-2 text-center"
                          >
                            <span className="text-4xl" aria-hidden="true">
                              {i.emoji}
                            </span>
                            <span className="mt-1 text-[13px] font-semibold">{i.name}</span>
                            <span
                              className={`mt-1.5 flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.chip} ${u.text}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${u.dot}`} aria-hidden="true" />
                              Còn ~ {i.daysLeft} ngày
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <div className="mt-3 flex justify-center">
                    <Link
                      href="/fridge/items"
                      className="flex items-center gap-1.5 rounded-full bg-[#E9EFDF] px-5 py-1.5 text-xs font-bold text-[#184B3A] transition-colors hover:bg-[#DDE8CF]"
                    >
                      Xem chi tiết <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách nguyên liệu trong tủ */}
            <div id="nguyen-lieu" className="shrink-0 scroll-mt-4 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2.5 text-base font-black">
                  <span className="text-2xl" aria-hidden="true">
                    🍎
                  </span>
                  Danh sách nguyên liệu trong tủ
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(true);
                      loadMasterIngredients();
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-[#184B3A] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#12392c] transition"
                  >
                    <Plus className="h-3.5 w-3.5" /> Thêm nguyên liệu
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowParseModal(true)}
                    className="flex items-center gap-1.5 rounded-full border border-[#D5E5DA] bg-[#EAF2ED] px-3.5 py-1.5 text-xs font-bold text-[#184B3A] shadow-sm hover:bg-[#d9eadf] transition"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Nhập văn bản nhanh
                  </button>
                  <Link
                    href="/fridge/items"
                    className="flex items-center gap-1 text-xs font-semibold text-[#184B3A] hover:underline ml-1"
                  >
                    Xem tất cả <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {loading && ingredients.length === 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="h-28 animate-pulse rounded-2xl bg-[#F0E9DF]/60" />
                  ))}
                </div>
              ) : ingredients.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DDD6CC] bg-[#FFFBF5] p-6 text-center text-xs text-[#77736D]">
                  Tủ lạnh của bạn hiện đang trống. Thêm nguyên liệu để nhận gợi ý nấu ăn!
                </div>
              ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                  {ingredients.map((i) => {
                    const u = urgency(i.daysLeft);
                    return (
                      <li
                        key={i.id}
                        className="group relative flex flex-col items-center rounded-2xl border border-[#F0E9DF] bg-[#FFFCF7] px-2 py-3 text-center shadow-sm hover:shadow-md transition"
                      >
                        <button
                          type="button"
                          onClick={() => handleDelete(i.id, i.name)}
                          disabled={deletingId === i.id}
                          title={`Xóa ${i.name}`}
                          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-stone-300 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-5xl" aria-hidden="true">
                          {i.emoji}
                        </span>
                        <span className="mt-1.5 text-[13px] font-semibold">{i.name}</span>
                        <p className="text-[11px] font-bold text-[#184B3A]">
                          {i.quantity} {i.unit}
                        </p>
                        <span className={`mt-1 rounded-full px-3 py-0.5 text-xs font-semibold ${u.chip} ${u.text}`}>
                          (~ {i.daysLeft} ngày)
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* ═════ CỘT PHẢI ═════ */}
          <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[340px] 2xl:w-[385px]">
            {/* Thống kê nhanh */}
            <div className="shrink-0 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[15px] font-black">
                  <BarChart3 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  Thống kê nhanh
                </h3>
                <Link
                  href="/history"
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#184B3A] hover:underline"
                >
                  Xem chi tiết <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <StatTile
                  icon={<ShoppingBasket className="h-8 w-8 text-orange-500" aria-hidden="true" />}
                  value={String(ingredients.length)}
                  label={
                    <>
                      Nguyên liệu
                      <br />
                      trong tủ
                    </>
                  }
                />
                <StatTile
                  icon={<CalendarDays className="h-8 w-8 text-orange-400" aria-hidden="true" />}
                  value={soonest ? `${soonest.daysLeft} ngày` : "--"}
                  label={
                    <>
                      Thời gian còn lại
                      <br />
                      (ước tính)
                    </>
                  }
                />
                <StatTile
                  icon={<Leaf className="h-8 w-8 fill-emerald-500 text-emerald-600" aria-hidden="true" />}
                  value="0 kg"
                  label={
                    <>
                      Thực phẩm
                      <br />
                      bị bỏ phí
                    </>
                  }
                />
              </div>
            </div>

            {/* Gợi ý hôm nay */}
            <div className="shrink-0 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-[15px] font-black">
                <Lightbulb className="h-5 w-5 fill-amber-300 text-amber-500" aria-hidden="true" />
                Gợi ý hôm nay
              </h3>
              {loading && !topSuggestion ? (
                <div className="h-36 animate-pulse rounded-2xl bg-[#F0E9DF]/60" />
              ) : topSuggestion ? (
                <div className="flex overflow-hidden rounded-2xl bg-[#FFF8ED]">
                  <FoodImage
                    src={topSuggestion.recipe.imageUrl || undefined}
                    alt={topSuggestion.recipe.title}
                    emoji="🍲"
                    className="h-auto w-[42%] shrink-0 object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-center p-3.5">
                    <p className="text-base font-black">{topSuggestion.recipe.title}</p>
                    <p className="mt-1 text-xs leading-snug text-[#77736D]">
                      Có sẵn {topSuggestion.matchedIngredients.length} nguyên liệu
                      {topSuggestion.missingIngredients.length > 0
                        ? `, thiếu ${topSuggestion.missingIngredients.length} nguyên liệu`
                        : " (đủ nguyên liệu)"}
                    </p>
                    <Link
                      href={`/recipes/${topSuggestion.recipe.id}`}
                      className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#184B3A] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#12392c]"
                    >
                      Xem công thức <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#FAF5EE] p-4 text-center text-xs text-[#77736D]">
                  Chưa có gợi ý phù hợp với nguyên liệu hiện tại trong tủ.
                </div>
              )}
            </div>

            {/* Mẹo nhỏ */}
            <div className="relative flex min-h-[200px] shrink-0 overflow-hidden rounded-3xl border border-[#E4EBCB] bg-gradient-to-br from-[#FBFCEF] via-[#F3F7DD] to-[#E6EFC4] p-5 shadow-sm">
              <div className="relative z-10 flex max-w-[58%] flex-col">
                <h3 className="mb-3 flex items-center gap-2 text-[15px] font-black">
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {TIP.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[#3f3b36]">{TIP.text}</p>
              </div>
              <span
                className="absolute -bottom-2 right-3 select-none text-[84px] leading-none drop-shadow-sm"
                aria-hidden="true"
              >
                🥬
              </span>
              <span className="absolute right-6 top-5 select-none text-lg text-amber-400" aria-hidden="true">
                ✦
              </span>
              <span className="absolute bottom-4 left-[52%] select-none text-sm text-amber-400" aria-hidden="true">
                ✦
              </span>
            </div>
          </aside>
        </main>
      </div>

      {/* ─── MODAL THÊM NGUYÊN LIỆU THỦ CÔNG ─── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EEE7DF] pb-3 mb-4">
              <h3 className="text-lg font-black text-[#184B3A] flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Thêm thực phẩm vào tủ
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#202B24] mb-1.5">
                  Chọn loại thực phẩm / nguyên liệu
                </label>
                {masterLoading ? (
                  <div className="h-10 rounded-2xl bg-[#F0E9DF]/60 animate-pulse" />
                ) : (
                  <select
                    value={selectedIngredientId}
                    onChange={(e) => setSelectedIngredientId(e.target.value)}
                    className="w-full rounded-2xl border border-[#EEE7DF] bg-white px-3.5 py-2.5 text-xs font-bold text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
                  >
                    {masterIngredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({ing.category} - đơn vị: {ing.unit})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202B24] mb-1.5">
                  Số lượng (theo đơn vị của thực phẩm)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(e.target.value)}
                  placeholder="Ví dụ: 2 quả, 200g, 1 bó..."
                  required
                  className="w-full rounded-2xl border border-[#EEE7DF] bg-white px-3.5 py-2.5 text-xs font-bold text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
                />
              </div>

              <div className="rounded-2xl bg-[#FAF5EE] p-3 text-xs text-[#77736D]">
                💡 Mẹo: Hệ thống sẽ tự động tính toán thời hạn bảo quản tối ưu và đưa ra gợi ý nấu ăn tương ứng ngay khi thêm.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-full border border-[#EEE7DF] bg-white px-5 py-2 text-xs font-bold text-[#5f5b55] hover:bg-[#FAF4ED]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting || masterLoading}
                  className="rounded-full bg-[#184B3A] px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-[#12392c] disabled:opacity-50"
                >
                  {submitting ? "Đang thêm..." : "Thêm vào tủ lạnh"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL NHẬP VĂN BẢN NHANH (NLP) ─── */}
      {showParseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowParseModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EEE7DF] pb-3 mb-4">
              <h3 className="text-lg font-black text-[#184B3A] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Nhập văn bản nhanh (NLP)
              </h3>
              <button
                type="button"
                onClick={() => setShowParseModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleParseSubmit} className="space-y-4">
              <p className="text-xs text-[#77736D] leading-relaxed">
                Dán danh sách đồ vừa đi chợ hoặc gõ tự nhiên, AI sẽ tự bóc tách số lượng và thêm ngay vào tủ lạnh của bạn:
              </p>

              <textarea
                rows={4}
                value={parseText}
                onChange={(e) => setParseText(e.target.value)}
                placeholder="Ví dụ: 3 quả trứng gà, 1 mớ rau muống, 200g thịt heo xay, 1 hộp cá ngừ..."
                className="w-full rounded-2xl border border-[#EEE7DF] bg-white p-3.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
              />

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] text-[#77736D] font-semibold">Mẫu thử nhanh:</span>
                <button
                  type="button"
                  onClick={() => setParseText("2 quả trứng gà, 1 quả cà chua, 1 miếng đậu hũ")}
                  className="rounded-full bg-[#FAF5EE] px-2.5 py-0.5 text-[11px] font-medium text-[#184B3A] hover:bg-[#EEE4D4]"
                >
                  Trứng + Cà chua + Đậu hũ
                </button>
                <button
                  type="button"
                  onClick={() => setParseText("200g thịt heo xay, 1 bó rau muống, 2 củ tỏi")}
                  className="rounded-full bg-[#FAF5EE] px-2.5 py-0.5 text-[11px] font-medium text-[#184B3A] hover:bg-[#EEE4D4]"
                >
                  Thịt heo xay + Rau muống
                </button>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowParseModal(false)}
                  className="rounded-full border border-[#EEE7DF] bg-white px-5 py-2 text-xs font-bold text-[#5f5b55] hover:bg-[#FAF4ED]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting || !parseText.trim()}
                  className="rounded-full bg-[#184B3A] px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-[#12392c] disabled:opacity-50"
                >
                  {submitting ? "Đang nhận diện..." : "Phân tích & Tự động lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast thông báo */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#184B3A] px-5 py-2.5 text-xs font-bold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
