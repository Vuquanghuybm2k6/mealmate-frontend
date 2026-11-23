"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
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
  Refrigerator,
  Search,
  ShoppingCart,
  Star,
  User,
  Utensils,
} from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────── */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

/* ─── Mock data (TODO: thay bằng API qua Axios) ───────── */
type Recipe = {
  id: string;
  title: string;
  emoji: string;
  img: string;
  time: number;
  kcal: number;
  rating: number;
  cat: string; // khớp với id trong CATEGORIES
  tags: string[];
};

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const FEATURED: Recipe[] = [
  { id: "r1", title: "Phở bò truyền thống", emoji: "🍜", img: U("photo-1582878826629-29b7ad1cdc43"), time: 45, kcal: 420, rating: 4.9, cat: "canh", tags: ["Món nước", "Dễ làm"] },
  { id: "r2", title: "Tôm xào bông cải xanh", emoji: "🍤", img: U("photo-1512621776951-a57141f2eefd"), time: 20, kcal: 180, rating: 4.8, cat: "xao", tags: ["Món xào", "Healthy"] },
  { id: "r3", title: "Canh sườn ngô ngọt", emoji: "🍲", img: U("photo-1547592180-85f173990554"), time: 40, kcal: 250, rating: 4.7, cat: "canh", tags: ["Món canh", "Dinh dưỡng"] },
  { id: "r4", title: "Cơm chiên trứng", emoji: "🍚", img: U("photo-1603133872878-684f208fb84b"), time: 15, kcal: 350, rating: 4.7, cat: "com", tags: ["Món cơm", "Nhanh gọn"] },
];

const POPULAR: Recipe[] = [
  { id: "r5", title: "Bò xào rau củ", emoji: "🥘", img: U("photo-1512058564366-18510be2db19"), time: 25, kcal: 310, rating: 4.8, cat: "xao", tags: ["Món xào", "Đủ chất"] },
  { id: "r6", title: "Gà kho gừng", emoji: "🍗", img: U("photo-1604908176997-125f25cc6f3d"), time: 35, kcal: 380, rating: 4.7, cat: "com", tags: ["Món mặn", "Đưa cơm"] },
  { id: "r7", title: "Canh chua cá lóc", emoji: "🐟", img: U("photo-1569718212165-3a8278d5f624"), time: 30, kcal: 210, rating: 4.8, cat: "canh", tags: ["Món canh", "Thanh mát"] },
  { id: "r8", title: "Mì xào trứng rau củ", emoji: "🍝", img: U("photo-1546069901-ba9599a7e63c"), time: 15, kcal: 360, rating: 4.6, cat: "xao", tags: ["Món xào", "Tiết kiệm"] },
];

const ALL_RECIPES = [...FEATURED, ...POPULAR];

const CATEGORIES = [
  { id: "all", label: "Tất cả", emoji: "" },
  { id: "com", label: "Món cơm", emoji: "🍚" },
  { id: "canh", label: "Món canh", emoji: "🍲" },
  { id: "xao", label: "Món xào", emoji: "🍤" },
  { id: "hap", label: "Món hấp", emoji: "🥟" },
  { id: "nuong", label: "Món nướng", emoji: "🍖" },
  { id: "anvat", label: "Món ăn vặt", emoji: "🍡" },
  { id: "salad", label: "Salad", emoji: "🥗" },
  { id: "trangmieng", label: "Món tráng miệng", emoji: "🧁" },
];

const MORE_CATEGORIES = [
  { id: "chay", label: "Món chay" },
  { id: "lau", label: "Món lẩu" },
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

/* ─── Ảnh có fallback ─────────────────────────────────── */
function FoodImage({ src, alt, emoji, className = "" }: { src?: string; alt: string; emoji: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 text-5xl`}
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

/* ─── Thẻ công thức ───────────────────────────────────── */
function RecipeCard({ recipe, fav, onToggleFav }: { recipe: Recipe; fav: boolean; onToggleFav: () => void }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#EEE7DF] bg-[#FFFDF9] shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-[140px] w-full shrink-0 overflow-hidden">
        <FoodImage
          src={recipe.img}
          alt={recipe.title}
          emoji={recipe.emoji}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <button
          type="button"
          onClick={onToggleFav}
          aria-pressed={fav}
          aria-label={fav ? `Bỏ yêu thích ${recipe.title}` : `Yêu thích ${recipe.title}`}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-red-500 text-red-500" : "text-stone-500"}`} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h4 className="mb-2 truncate text-[15px] font-bold">{recipe.title}</h4>

        <div className="mb-2.5 flex items-center text-xs text-[#4b4741]">
          <span className="flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5 text-[#F59E0B]" aria-hidden="true" />
            {recipe.time} phút
          </span>
          <span className="mx-2 h-3.5 w-px bg-[#E5DDD2]" aria-hidden="true" />
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" aria-hidden="true" />
            {recipe.kcal} kcal
          </span>
          <span className="mx-2 h-3.5 w-px bg-[#E5DDD2]" aria-hidden="true" />
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            {recipe.rating}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {recipe.tags.map((tag, i) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-[#F4EFEA] px-2 py-0.5 text-[11px] font-medium text-[#5f5b55]"
            >
              {i === 0 && <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />}
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto">
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

function SectionHeader({ icon, title, href = "/recipes" }: { icon: React.ReactNode; title: string; href?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="flex items-center gap-2 text-lg font-black">
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

/* ─── Nội dung trang ──────────────────────────────────── */
function RecipesContent() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const urlQuery = params.get("q") ?? "";
  const maxTime = Number(params.get("maxTime")) || 0;

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [category, setCategory] = useState("all");
  const [moreOpen, setMoreOpen] = useState(false);
  const [favs, setFavs] = useState<Record<string, boolean>>({});
  const [userName, setUserName] = useState("Vũ Quang Huy");
  const [recipes, setRecipes] = useState<Recipe[]>(ALL_RECIPES);

  useEffect(() => {
    async function fetchData() {
      try {
        const profRes = await fetch("http://localhost:3000/api/v1/profile");
        if (profRes.ok) {
          const prof = await profRes.json();
          if (prof?.data?.name) setUserName(prof.data.name);
        }
      } catch {}

      try {
        const res = await fetch("http://localhost:3000/api/v1/recipes");
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            setRecipes(
              list.map((r: any) => ({
                id: r.id,
                title: r.title,
                emoji: r.title.includes("Cơm")
                  ? "🍚"
                  : r.title.includes("Bún")
                  ? "🍜"
                  : r.title.includes("Canh")
                  ? "🍲"
                  : r.title.includes("Mì")
                  ? "🍝"
                  : r.title.includes("Gà")
                  ? "🍗"
                  : r.title.includes("Trứng")
                  ? "🍳"
                  : "🥘",
                img:
                  r.imageUrl && !r.imageUrl.includes("placehold.co")
                    ? r.imageUrl
                    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                time: r.cookMinutes || 15,
                kcal: Math.round(r.kcal || 350),
                rating: 4.8,
                cat: r.title.includes("Cơm")
                  ? "com"
                  : r.title.includes("Canh")
                  ? "canh"
                  : r.title.includes("Xào")
                  ? "xao"
                  : "com",
                tags: [
                  r.isHealthy ? "Healthy" : "Nhanh gọn",
                  r.difficulty === "easy" ? "Dễ làm" : "Đủ chất",
                ],
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Chưa tải được recipes:", err);
      }
    }
    fetchData();
  }, []);

  // Đồng bộ ô tìm kiếm khi URL ?q= đổi
  useEffect(() => setSearchQuery(urlQuery), [urlQuery]);

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

  const toggleFav = (id: string) => setFavs((prev) => ({ ...prev, [id]: !prev[id] }));
  const favCount = 12 + Object.values(favs).filter(Boolean).length; // TODO: lấy từ API

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const filtering = category !== "all" || urlQuery.trim() !== "" || maxTime > 0;

  const results = useMemo(() => {
    const q = norm(urlQuery.trim());
    return recipes.filter(
      (r) =>
        (category === "all" || r.cat === category) &&
        (!maxTime || r.time <= maxTime) &&
        (!q || norm(`${r.title} ${r.tags.join(" ")}`).includes(q))
    );
  }, [recipes, category, urlQuery, maxTime]);

  const featured = useMemo(() => recipes.slice(0, 4), [recipes]);
  const popular = useMemo(() => (recipes.length > 4 ? recipes.slice(4) : recipes), [recipes]);

  const chipBase =
    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold shadow-sm transition-all";

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
              placeholder="Tìm kiếm công thức món ăn... (ví dụ: phở bò, salad,...)"
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
              <ChevronDown className="h-4 w-4 text-[#202B24]" aria-hidden="true" />
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
                <h2 className="text-3xl font-black leading-tight text-[#202B24]">Công thức nấu ăn</h2>
                <p className="text-sm text-[#5f5b55]">Khám phá hàng ngàn công thức ngon, dễ làm và tốt cho sức khỏe</p>
              </div>
            </div>

            <Link
              href="/recipes?filter=favorites"
              className="flex items-center gap-2 rounded-full border border-[#EEE7DF] bg-[#FFFDF9] px-4 py-2 text-xs font-semibold shadow-sm transition-colors hover:bg-[#FAF4ED]"
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              Công thức yêu thích ({favCount})
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Danh mục */}
          <div className="relative">
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1" role="tablist" aria-label="Danh mục món ăn">
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
                className="absolute right-0 top-full z-20 mt-1 w-40 rounded-2xl border border-[#EEE7DF] bg-[#FFFDF9] p-1.5 shadow-lg"
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
                    className="block w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold hover:bg-[#FAF4ED]"
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
              <h3 className="text-3xl font-black italic leading-tight text-[#184B3A] sm:text-4xl">Công thức ngon</h3>
              <p className="text-2xl font-black italic leading-tight text-[#E86B1F] sm:text-4xl">
                Cho bữa ăn thêm trọn vẹn!
              </p>
              <p className="mt-3 flex items-center gap-2 text-[13px] italic text-[#3f3b36]">
                Dễ làm <span aria-hidden="true">•</span> Bổ dưỡng <span aria-hidden="true">•</span> Tốt cho sức khỏe
                <Heart className="h-4 w-4" aria-hidden="true" />
              </p>
            </div>

            <div className="absolute right-0 top-0 hidden h-full w-[55%] sm:block">
              <FoodImage
                src={U("photo-1512058564366-18510be2db19")}
                alt="Đĩa bò xào rau củ"
                emoji="🥘"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#F5EFDF] via-[#F5EFDF]/80 to-transparent" />
            </div>
          </div>

          {/* Kết quả lọc / các mục gợi ý */}
          {filtering ? (
            <section aria-live="polite">
              <h3 className="mb-3 text-lg font-black">
                Kết quả{urlQuery ? ` cho “${urlQuery}”` : ""} ({results.length})
              </h3>
              {results.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E5DDD2] bg-[#FFFDF9] p-8 text-center text-sm text-[#77736D]">
                  Không tìm thấy công thức phù hợp. Hãy thử từ khóa hoặc danh mục khác.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {results.map((r) => (
                    <RecipeCard key={r.id} recipe={r} fav={!!favs[r.id]} onToggleFav={() => toggleFav(r.id)} />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <>
              <section>
                <SectionHeader
                  icon={<Star className="h-6 w-6 fill-orange-500 text-orange-500" aria-hidden="true" />}
                  title="Công thức nổi bật"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {featured.map((r) => (
                    <RecipeCard key={r.id} recipe={r} fav={!!favs[r.id]} onToggleFav={() => toggleFav(r.id)} />
                  ))}
                </div>
              </section>

              <section>
                <SectionHeader
                  icon={<Flame className="h-6 w-6 fill-orange-500 text-orange-500" aria-hidden="true" />}
                  title="Công thức được yêu thích"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {popular.map((r) => (
                    <RecipeCard key={r.id} recipe={r} fav={!!favs[r.id]} onToggleFav={() => toggleFav(r.id)} />
                  ))}
                </div>
              </section>
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
