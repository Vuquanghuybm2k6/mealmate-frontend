"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarCheck,
  ChefHat,
  ChevronDown,
  Clock,
  Clock3,
  Flame,
  Heart,
  Home,
  LayoutGrid,
  RefreshCw,
  Refrigerator,
  Search,
  ShoppingCart,
  Star,
  Tag,
  User,
  Utensils,
} from "lucide-react";
import {
  BackendRecipeSummary,
  fetchFavoriteIds,
  fetchRecipes,
  fetchUserProfile,
  toggleFavoriteRecipe,
} from "../lib/services/recipeService";

/* ─── Helpers ─────────────────────────────────────────── */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

const vnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

function getRecipeEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("bánh mì")) return "🥪";
  if (t.includes("khoai")) return "🍠";
  if (t.includes("phở") || t.includes("bún")) return "🍜";
  if (t.includes("mì")) return "🍝";
  if (t.includes("gà")) return "🍗";
  if (t.includes("cá")) return "🐟";
  if (t.includes("thịt")) return "🍖";
  if (t.includes("canh") || t.includes("súp") || t.includes("cháo")) return "🍲";
  if (t.includes("trứng")) return "🍳";
  if (t.includes("rau") || t.includes("cải") || t.includes("salad")) return "🥗";
  if (t.includes("đậu")) return "🧊";
  if (t.includes("cơm") || t.includes("xôi")) return "🍚";
  return "🥘";
}

/* ─── Cấu hình điều hướng & Danh mục giao diện ───────── */
const CATEGORIES = [
  { id: "all", label: "Tất cả", emoji: "" },
  { id: "com", label: "Món cơm", emoji: "🍚" },
  { id: "canh", label: "Món canh", emoji: "🍲" },
  { id: "xao", label: "Món xào", emoji: "🍤" },
  { id: "chay", label: "Món chay", emoji: "🥗" },
  { id: "sang", label: "Bữa sáng", emoji: "🥪" },
  { id: "healthy", label: "Healthy", emoji: "🥑" },
];

const MORE_CATEGORIES = [
  { id: "trua", label: "Bữa trưa" },
  { id: "toi", label: "Bữa tối" },
  { id: "nhanh", label: "Nấu nhanh ≤ 15p" },
];

const NAV_ITEMS = [
  { href: "/", label: "Trang chủ", Icon: Home },
  { href: "/recipes", label: "Công thức", Icon: Utensils },
  { href: "/fridge", label: "Tủ lạnh thông minh", Icon: Refrigerator },
  { href: "/shopping", label: "Danh sách mua", Icon: ShoppingCart },
  { href: "/history", label: "Lịch sử ăn uống", Icon: Clock },
  { href: "/meal-plan", label: "Lên thực đơn", Icon: CalendarCheck },
  { href: "/profile", label: "Hồ sơ cá nhân", Icon: User },
];

/* ─── Ảnh món ăn có fallback ──────────────────────────── */
function FoodImage({
  src,
  alt,
  emoji,
  className = "",
}: {
  src?: string | null;
  alt: string;
  emoji: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed || src.includes("placehold.co")) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 text-5xl select-none`}
      >
        {emoji}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

/* ─── Mascot sidebar ─────────────────────────────────── */
function SidebarMascot() {
  return (
    <div className="flex select-none flex-col items-center">
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full bg-[#DDEBDD]/15 text-6xl"
        aria-hidden="true"
      >
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

/* ─── Thẻ Skeleton khi đang tải ───────────────────────── */
function RecipeCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-[#EEE7DF] bg-[#FFFDF9] shadow-sm">
      <div className="h-[140px] w-full bg-[#EFE8DF]" />
      <div className="flex flex-1 flex-col p-3.5">
        <div className="mb-2 h-4 w-3/4 rounded bg-[#EFE8DF]" />
        <div className="mb-2.5 flex items-center gap-2">
          <div className="h-3 w-14 rounded bg-[#EFE8DF]" />
          <div className="h-3 w-px bg-[#E5DDD2]" />
          <div className="h-3 w-16 rounded bg-[#EFE8DF]" />
          <div className="h-3 w-px bg-[#E5DDD2]" />
          <div className="h-3 w-14 rounded bg-[#EFE8DF]" />
        </div>
        <div className="mb-3 flex gap-1.5">
          <div className="h-5 w-14 rounded-full bg-[#EFE8DF]" />
          <div className="h-5 w-14 rounded-full bg-[#EFE8DF]" />
        </div>
        <div className="mt-auto h-8 w-full rounded-full bg-[#EFE8DF]" />
      </div>
    </div>
  );
}

/* ─── Trạng thái lỗi ──────────────────────────────────── */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/60 p-8 text-center shadow-xs">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h4 className="text-base font-bold text-red-900">Không thể tải dữ liệu công thức</h4>
      <p className="mt-1 max-w-md text-sm text-red-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 flex items-center gap-2 rounded-full bg-[#184B3A] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#205543]"
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Thử lại
      </button>
    </div>
  );
}

/* ─── Trạng thái rỗng ─────────────────────────────────── */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#E5DDD2] bg-[#FFFDF9] p-10 text-center">
      <div className="mb-3 flex justify-center text-5xl" aria-hidden="true">
        🍲
      </div>
      <h4 className="text-base font-bold text-[#202B24]">Chưa có dữ liệu món ăn</h4>
      <p className="mt-1 text-sm text-[#77736D]">{message}</p>
    </div>
  );
}

/* ─── Thẻ công thức thực tế từ API ─────────────────────── */
function RecipeCard({
  recipe,
  fav,
  onToggleFav,
}: {
  recipe: BackendRecipeSummary;
  fav: boolean;
  onToggleFav: () => void;
}) {
  const emoji = getRecipeEmoji(recipe.title);

  // Sinh thẻ dựa trên thuộc tính thực tế từ Backend (không bịa đặt)
  const tags = useMemo(() => {
    const list: string[] = [];
    if (recipe.isHealthy) list.push("Healthy");
    if (recipe.difficulty === "easy") list.push("Dễ làm");
    else if (recipe.difficulty === "hard") list.push("Cầu kỳ");
    else if (recipe.difficulty === "medium") list.push("Vừa sức");

    if (recipe.dietTypes?.includes("vegetarian") || recipe.dietTypes?.includes("vegan")) {
      list.push("Món chay");
    }
    if (recipe.cookMinutes <= 15) {
      list.push("Nấu nhanh");
    }
    return list;
  }, [recipe]);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#EEE7DF] bg-[#FFFDF9] shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-[140px] w-full shrink-0 overflow-hidden">
        <FoodImage
          src={recipe.imageUrl}
          alt={recipe.title}
          emoji={emoji}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <button
          type="button"
          onClick={onToggleFav}
          aria-pressed={fav}
          aria-label={fav ? `Bỏ yêu thích ${recipe.title}` : `Yêu thích ${recipe.title}`}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
        >
          <Heart
            className={`h-4 w-4 ${fav ? "fill-red-500 text-red-500" : "text-stone-500"}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h4 className="mb-2 truncate text-[15px] font-bold text-[#202B24]" title={recipe.title}>
          {recipe.title}
        </h4>

        <div className="mb-2.5 flex items-center text-xs text-[#4b4741]">
          <span className="flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5 text-[#F59E0B]" aria-hidden="true" />
            {recipe.cookMinutes} phút
          </span>
          <span className="mx-2 h-3.5 w-px bg-[#E5DDD2]" aria-hidden="true" />
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" aria-hidden="true" />
            {Math.round(recipe.kcal)} kcal
          </span>
          <span className="mx-2 h-3.5 w-px bg-[#E5DDD2]" aria-hidden="true" />
          <span className="flex items-center gap-1 font-semibold text-[#C86218]">
            {vnd(recipe.costEstimate)}
          </span>
        </div>

        {tags.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {tags.map((tag, i) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-[#F4EFEA] px-2 py-0.5 text-[11px] font-medium text-[#5f5b55]"
              >
                {i === 0 && <Tag className="h-3 w-3 text-[#184B3A]" aria-hidden="true" />}
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-1">
          <Link
            href={`/recipes/${recipe.id}`}
            className="flex w-full items-center justify-center gap-1 rounded-full bg-[#2F5D46] py-2 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-[#184B3A]"
          >
            Xem công thức <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function SectionHeader({
  icon,
  title,
  href = "/recipes",
}: {
  icon: React.ReactNode;
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="flex items-center gap-2 text-lg font-black text-[#202B24]">
        {icon}
        {title}
      </h3>
      <Link
        href={href}
        className="flex items-center gap-1 text-xs font-semibold text-[#184B3A] transition-colors hover:underline"
      >
        Xem tất cả <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    </div>
  );
}

/* ─── Nội dung chính trang Công thức ──────────────────── */
function RecipesContent() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const urlQuery = params.get("q") ?? "";
  const maxTime = Number(params.get("maxTime")) || 0;
  const isFilterFavorites = params.get("filter") === "favorites";

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [category, setCategory] = useState("all");
  const [moreOpen, setMoreOpen] = useState(false);

  // Trạng thái dữ liệu Backend
  const [recipes, setRecipes] = useState<BackendRecipeSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Người dùng & Yêu thích từ API
  const [userName, setUserName] = useState<string>("");
  const [favs, setFavs] = useState<Record<string, boolean>>({});
  const [favCount, setFavCount] = useState<number>(0);

  // Tải dữ liệu từ Backend API
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [recipesData, profileData, favoritesData] = await Promise.allSettled([
        fetchRecipes({ maxTime: maxTime > 0 ? maxTime : undefined }),
        fetchUserProfile(),
        fetchFavoriteIds(),
      ]);

      // Xử lý danh sách công thức
      if (recipesData.status === "fulfilled") {
        setRecipes(recipesData.value);
      } else {
        throw new Error(recipesData.reason?.message || "Không thể tải danh sách công thức");
      }

      // Xử lý thông tin người dùng
      if (profileData.status === "fulfilled") {
        setUserName(profileData.value.name || "");
      }

      // Xử lý danh sách yêu thích
      if (favoritesData.status === "fulfilled") {
        const map: Record<string, boolean> = {};
        for (const id of favoritesData.value.ids) {
          map[id] = true;
        }
        setFavs(map);
        setFavCount(favoritesData.value.count);
      } else if (profileData.status === "fulfilled" && profileData.value.stats?.saved !== undefined) {
        setFavCount(profileData.value.stats.saved);
      }
    } catch (err: any) {
      setError(err?.message || "Lỗi kết nối đến Backend API");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [maxTime]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Đồng bộ ô tìm kiếm khi URL thay đổi
  useEffect(() => setSearchQuery(urlQuery), [urlQuery]);

  // Phím tắt Ctrl/Cmd + K
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

  const handleToggleFav = async (id: string) => {
    const nextVal = !favs[id];
    // Cập nhật lạc quan giao diện
    setFavs((prev) => ({ ...prev, [id]: nextVal }));
    setFavCount((c) => (nextVal ? c + 1 : Math.max(0, c - 1)));

    try {
      const res = await toggleFavoriteRecipe(id);
      setFavs((prev) => ({ ...prev, [id]: res.isFavorited }));
      setFavCount(res.count);
    } catch {
      // Revert lại nếu API thất bại
      setFavs((prev) => ({ ...prev, [id]: !nextVal }));
      setFavCount((c) => (!nextVal ? c + 1 : Math.max(0, c - 1)));
    }
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Kiểm tra điều kiện lọc
  const filtering = category !== "all" || urlQuery.trim() !== "" || maxTime > 0 || isFilterFavorites;

  // Lọc dữ liệu thực tế từ Backend
  const results = useMemo(() => {
    const q = norm(urlQuery.trim());
    return recipes.filter((r) => {
      // Lọc yêu thích
      if (isFilterFavorites && !favs[r.id]) return false;

      // Lọc thời gian nấu
      if (maxTime > 0 && r.cookMinutes > maxTime) return false;

      // Lọc danh mục dựa trên dữ liệu thực tế
      if (category === "com" && !norm(r.title).includes("com")) return false;
      if (category === "canh" && !norm(r.title).includes("canh") && !norm(r.title).includes("sup")) return false;
      if (category === "xao" && !norm(r.title).includes("xao")) return false;
      if (category === "chay" && !r.dietTypes?.some((d) => d === "vegetarian" || d === "vegan")) return false;
      if (category === "sang" && !r.mealTypes?.includes("breakfast")) return false;
      if (category === "trua" && !r.mealTypes?.includes("lunch")) return false;
      if (category === "toi" && !r.mealTypes?.includes("dinner")) return false;
      if (category === "healthy" && !r.isHealthy) return false;
      if (category === "nhanh" && r.cookMinutes > 15) return false;

      // Tìm kiếm từ khóa theo tiêu đề món
      if (q && !norm(r.title).includes(q)) return false;

      return true;
    });
  }, [recipes, category, urlQuery, maxTime, isFilterFavorites, favs]);

  // Phân bổ danh mục nổi bật và phổ biến từ dữ liệu thực tế của Backend
  const featured = useMemo(() => recipes.slice(0, 4), [recipes]);
  const popular = useMemo(() => (recipes.length > 4 ? recipes.slice(4) : recipes), [recipes]);

  const chipBase =
    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold shadow-sm transition-all";

  // Chữ cái đại diện người dùng
  const userInitials = useMemo(() => {
    if (!userName) return "NA";
    const parts = userName.trim().split(" ");
    return parts.map((p) => p[0]).slice(-2).join("").toUpperCase();
  }, [userName]);

  return (
    <div className="flex min-h-screen bg-[#F7F1EC] font-sans text-[#202B24]">
      {/* ─── SIDEBAR (chỉ hiện từ màn hình lg) ─── */}
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
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all ${
                    active
                      ? "bg-[#DDEBDD] font-bold text-[#184B3A] shadow-sm"
                      : "text-[#A3C4B6] hover:bg-[#205543] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${active ? "text-[#184B3A]" : "text-[#8EAE9F]"}`}
                    aria-hidden="true"
                  />
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
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#202B24]"
              aria-hidden="true"
            />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm công thức món ăn... (ví dụ: bún cá, cơm gà, canh rau,...)"
              aria-label="Tìm kiếm công thức món ăn"
              className="w-full rounded-full border border-[#EEE7DF] bg-[#FFFDF9] py-2.5 pl-11 pr-4 text-[13px] text-[#202B24] shadow-sm placeholder:text-[#9E9A93] focus:outline-none focus:ring-2 focus:ring-[#184B3A] sm:pr-20"
            />
            <kbd className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-[#EEE7DF] bg-[#F4EFEA] px-1.5 py-0.5 text-[10px] font-bold text-[#77736D] sm:block">
              Ctrl + K
            </kbd>
          </form>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="Thông báo"
              className="relative rounded-full p-2.5 transition-colors hover:bg-[#FAF4ED]"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
            </button>

            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-[#FAF4ED]"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#184B3A] text-xs font-bold text-white uppercase select-none"
                aria-hidden="true"
              >
                {userInitials}
              </span>
              <span className="hidden text-[13px] font-semibold sm:inline">
                {userName || "Người dùng"}
              </span>
              <ChevronDown className="h-4 w-4 text-[#202B24]" aria-hidden="true" />
            </Link>
          </div>
        </header>

        {/* Menu cho màn hình nhỏ */}
        <nav
          className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden"
          aria-label="Điều hướng chính di động"
        >
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  active
                    ? "bg-[#184B3A] text-white"
                    : "border border-[#EEE7DF] bg-[#FFFDF9] text-[#202B24]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Thân trang */}
        <main className="flex flex-1 flex-col gap-5 px-4 pb-8 lg:px-6">
          {/* Tiêu đề + nút yêu thích */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFFDF9] shadow-sm"
                aria-hidden="true"
              >
                <ChefHat className="h-7 w-7 text-[#184B3A]" />
              </span>
              <div>
                <h2 className="text-3xl font-black leading-tight text-[#202B24]">
                  Công thức nấu ăn
                </h2>
                <p className="text-sm text-[#5f5b55]">
                  Khám phá hàng chục công thức ngon, tiết kiệm và giàu dinh dưỡng
                </p>
              </div>
            </div>

            <Link
              href={isFilterFavorites ? "/recipes" : "/recipes?filter=favorites"}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-sm transition-colors ${
                isFilterFavorites
                  ? "border-[#184B3A] bg-[#DDEBDD] text-[#184B3A]"
                  : "border-[#EEE7DF] bg-[#FFFDF9] hover:bg-[#FAF4ED]"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isFilterFavorites ? "fill-red-500 text-red-500" : ""}`}
                aria-hidden="true"
              />
              Công thức yêu thích ({favCount})
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Danh mục */}
          <div className="relative">
            <div
              className="flex items-center gap-2.5 overflow-x-auto pb-1"
              role="tablist"
              aria-label="Danh mục món ăn"
            >
              {CATEGORIES.map((c) => {
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(c.id)}
                    className={`${chipBase} ${
                      active
                        ? "bg-[#2F5D46] text-white"
                        : "border border-[#EEE7DF] bg-[#FFFDF9] text-[#202B24] hover:bg-[#FAF4ED]"
                    }`}
                  >
                    {c.id === "all" ? (
                      <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <span aria-hidden="true">{c.emoji}</span>
                    )}
                    {c.label}
                  </button>
                );
              })}

              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((v) => !v)}
                className={`${chipBase} border border-[#EEE7DF] bg-[#FFFDF9] text-[#5f5b55] hover:bg-[#FAF4ED]`}
              >
                Khác <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-20 mt-1 w-44 rounded-2xl border border-[#EEE7DF] bg-[#FFFDF9] p-1.5 shadow-lg"
              >
                {MORE_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setCategory(c.id);
                      setMoreOpen(false);
                    }}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition-colors ${
                      category === c.id
                        ? "bg-[#DDEBDD] font-bold text-[#184B3A]"
                        : "hover:bg-[#FAF4ED]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Banner */}
          <div className="relative h-[180px] shrink-0 overflow-hidden rounded-3xl border border-[#EEE7DF] bg-gradient-to-r from-[#F4F7E9] via-[#F7F3E3] to-[#F2E7D3] shadow-sm">
            <div className="relative z-10 flex h-full max-w-[620px] flex-col justify-center px-6 sm:px-10">
              <h3 className="text-3xl font-black italic leading-tight text-[#184B3A] sm:text-4xl">
                Công thức ngon
              </h3>
              <p className="text-2xl font-black italic leading-tight text-[#E86B1F] sm:text-4xl">
                Cho bữa ăn thêm trọn vẹn!
              </p>
              <p className="mt-3 flex items-center gap-2 text-[13px] italic text-[#3f3b36]">
                Dễ làm <span aria-hidden="true">•</span> Bổ dưỡng <span aria-hidden="true">•</span>{" "}
                Tốt cho sức khỏe
                <Heart className="h-4 w-4 fill-red-400 text-red-500" aria-hidden="true" />
              </p>
            </div>

            <div className="absolute right-0 top-0 hidden h-full w-[55%] sm:block">
              <FoodImage
                src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
                alt="Đĩa món ăn"
                emoji="🥘"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#F5EFDF] via-[#F5EFDF]/80 to-transparent" />
            </div>
          </div>

          {/* Trạng thái Loading */}
          {loading && (
            <div className="space-y-4">
              <div className="h-6 w-48 rounded bg-[#EFE8DF] animate-pulse" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <RecipeCardSkeleton key={idx} />
                ))}
              </div>
            </div>
          )}

          {/* Trạng thái Lỗi */}
          {!loading && error && <ErrorState message={error} onRetry={loadData} />}

          {/* Trạng thái Thành công & Rỗng */}
          {!loading && !error && (
            <>
              {recipes.length === 0 ? (
                <EmptyState message="Hệ thống chưa có công thức nào. Vui lòng quay lại sau." />
              ) : filtering ? (
                <section aria-live="polite">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-black text-[#202B24]">
                      Kết quả{urlQuery ? ` cho “${urlQuery}”` : ""}{" "}
                      {isFilterFavorites ? "(Mục yêu thích)" : ""} ({results.length})
                    </h3>
                    {(category !== "all" || urlQuery || isFilterFavorites) && (
                      <button
                        type="button"
                        onClick={() => {
                          setCategory("all");
                          setSearchQuery("");
                          router.push("/recipes");
                        }}
                        className="text-xs font-semibold text-[#184B3A] hover:underline"
                      >
                        Xóa bộ lọc
                      </button>
                    )}
                  </div>

                  {results.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#E5DDD2] bg-[#FFFDF9] p-8 text-center text-sm text-[#77736D]">
                      Không tìm thấy công thức phù hợp. Hãy thử từ khóa hoặc danh mục khác.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {results.map((r) => (
                        <RecipeCard
                          key={r.id}
                          recipe={r}
                          fav={!!favs[r.id]}
                          onToggleFav={() => handleToggleFav(r.id)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              ) : (
                <>
                  {featured.length > 0 && (
                    <section>
                      <SectionHeader
                        icon={
                          <Star
                            className="h-6 w-6 fill-orange-500 text-orange-500"
                            aria-hidden="true"
                          />
                        }
                        title="Công thức nổi bật"
                      />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {featured.map((r) => (
                          <RecipeCard
                            key={r.id}
                            recipe={r}
                            fav={!!favs[r.id]}
                            onToggleFav={() => handleToggleFav(r.id)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {popular.length > 0 && (
                    <section>
                      <SectionHeader
                        icon={
                          <Flame
                            className="h-6 w-6 fill-orange-500 text-orange-500"
                            aria-hidden="true"
                          />
                        }
                        title="Công thức cho sinh viên"
                      />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {popular.map((r) => (
                          <RecipeCard
                            key={r.id}
                            recipe={r}
                            fav={!!favs[r.id]}
                            onToggleFav={() => handleToggleFav(r.id)}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// useSearchParams cần Suspense khi build Next.js (App Router)
export default function RecipesPage() {
  return (
    <Suspense fallback={null}>
      <RecipesContent />
    </Suspense>
  );
}
