"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarCheck,
  CalendarDays,
  ChefHat,
  ChevronDown,
  ChevronUp,
  Clock,
  Home,
  Leaf,
  Lightbulb,
  Plus,
  RefreshCw,
  Refrigerator,
  Search,
  ShoppingBasket,
  ShoppingCart,
  SlidersHorizontal,
  Trash2,
  User,
  Utensils,
  Wallet,
  X,
} from "lucide-react";
import {
  RecentList,
  ShoppingItem,
  addShoppingItem,
  fetchRecentShoppingLists,
  fetchShoppingList,
  removeShoppingItem,
  toggleShoppingItem,
} from "../lib/services/shoppingService";
import { fetchUserProfile } from "../lib/services/recipeService";

/* ─── Helpers ─────────────────────────────────────────── */
const vnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

const GROUPS = [
  { id: "veg", label: "Rau củ quả", emoji: "🍅", defaultEmoji: "🥬" },
  { id: "meat", label: "Thịt - Cá", emoji: "🥩", defaultEmoji: "🍖" },
  { id: "other", label: "Gia vị - Khác", emoji: "🍯", defaultEmoji: "🛒" },
];

const RANGES = [
  { id: "7d", label: "7 ngày tới", Icon: CalendarDays, hasCaret: true },
  { id: "1m", label: "1 tháng", Icon: CalendarDays, hasCaret: false },
  { id: "custom", label: "Tùy chỉnh", Icon: SlidersHorizontal, hasCaret: false },
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

/* ─── Ô thống kê ──────────────────────────────────────── */
function StatTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center rounded-2xl bg-[#FAF5EE] px-1.5 py-3 text-center">
      <div className="mb-1.5 flex h-9 w-9 items-center justify-center">{icon}</div>
      <p className="max-w-full truncate text-lg font-black leading-tight text-[#202B24]">{value}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-[#77736D]">{label}</p>
    </div>
  );
}

/* ─── Trang Danh sách mua ─────────────────────────────── */
export default function ShoppingPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [range, setRange] = useState("7d");
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [recentLists, setRecentLists] = useState<RecentList[]>([]);
  const [plannedMeals, setPlannedMeals] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", qty: "", price: "", group: "veg" });
  const [ordered, setOrdered] = useState(false);

  // Trạng thái dữ liệu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [listData, recentData, profData] = await Promise.allSettled([
        fetchShoppingList(),
        fetchRecentShoppingLists(),
        fetchUserProfile(),
      ]);

      if (listData.status === "fulfilled") {
        setItems(listData.value.items || []);
        setPlannedMeals(listData.value.plannedMeals || 0);
      } else {
        throw new Error(listData.reason?.message || "Không thể tải danh sách mua sắm");
      }

      if (recentData.status === "fulfilled") {
        setRecentLists(recentData.value || []);
      }

      if (profData.status === "fulfilled") {
        setUserName(profData.value.name || "");
      }
    } catch (err: any) {
      setError(err?.message || "Lỗi kết nối máy chủ");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items]);

  const toggleDone = async (id: string) => {
    // Cập nhật lạc quan
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
    try {
      await toggleShoppingItem(id);
    } catch {
      // Revert lại nếu lỗi
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
    }
  };

  const removeItem = async (id: string) => {
    const backup = [...items];
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await removeShoppingItem(id);
    } catch {
      setItems(backup);
    }
  };

  const toggleGroup = (id: string) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    const group = GROUPS.find((g) => g.id === form.group) ?? GROUPS[0];

    try {
      const created = await addShoppingItem({
        name,
        group: group.id,
        qty: form.qty.trim() || undefined,
        price: Math.max(0, Number(form.price) || 0),
        emoji: group.defaultEmoji,
      });

      setItems((prev) => [...prev, created]);
      setForm({ name: "", qty: "", price: "", group: "veg" });
      setAdding(false);
    } catch (err: any) {
      alert(err.message || "Không thể thêm món");
    }
  };

  const handleClear = async () => {
    if (items.length === 0) return;
    if (window.confirm("Xóa toàn bộ các món trong danh sách mua?")) {
      const currentItems = [...items];
      setItems([]);
      try {
        await Promise.all(currentItems.map((item) => removeShoppingItem(item.id)));
        setOrdered(false);
      } catch {
        // Tải lại dữ liệu nếu có lỗi
        loadData();
      }
    }
  };

  const handleOrder = () => {
    if (items.length === 0) return;
    setOrdered(true);
  };

  const inputCls =
    "min-w-0 rounded-full border border-[#EEE7DF] bg-white px-3.5 py-2 text-[13px] placeholder:text-[#9E9A93] focus:outline-none focus:ring-2 focus:ring-[#184B3A]";

  const userInitials = useMemo(() => {
    if (!userName) return "NA";
    const parts = userName.trim().split(" ");
    return parts.map((p) => p[0]).slice(-2).join("").toUpperCase();
  }, [userName]);

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
          aria-label="Điều hướng di động"
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
        <main className="flex flex-1 flex-col gap-4 px-4 pb-8 lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* ═════ CỘT TRÁI: DANH SÁCH ═════ */}
            <section className="flex min-w-0 flex-1 flex-col gap-3">
              {/* Tiêu đề & Chọn phạm vi */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2.5 text-2xl font-black text-[#202B24]">
                  <ShoppingCart className="h-7 w-7 text-emerald-700" aria-hidden="true" />
                  Danh sách cần mua
                </h2>

                <div
                  className="flex items-center gap-2"
                  role="tablist"
                  aria-label="Khoảng thời gian mua"
                >
                  {RANGES.map((r) => {
                    const active = range === r.id;
                    const Icon = r.Icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setRange(r.id)}
                        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-colors ${
                          active
                            ? "bg-[#184B3A] text-white"
                            : "border border-[#EEE7DF] bg-[#FFFDF9] text-[#3f3b36] hover:bg-[#FAF4ED]"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {r.label}
                        {r.hasCaret && <ChevronDown className="h-3 w-3" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Thanh thao tác */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-[#EEE7DF] bg-[#FFFDF9] p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#184B3A] text-xs font-bold text-white">
                    {items.filter((i) => i.done).length}
                  </span>
                  <span className="text-xs font-medium text-[#77736D]">
                    Đã chọn {items.filter((i) => i.done).length}/{items.length} món
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setAdding((v) => !v)}
                  aria-expanded={adding}
                  className="ml-auto flex items-center gap-2 rounded-full bg-[#E9EFDF] px-5 py-2 text-[13px] font-semibold text-[#184B3A] shadow-xs transition-colors hover:bg-[#DDE8CF]"
                >
                  {adding ? (
                    <X className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  )}
                  {adding ? "Đóng" : "Thêm món thủ công"}
                </button>
              </div>

              {/* Form thêm món */}
              {adding && (
                <form
                  onSubmit={handleAdd}
                  className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-[#EEE7DF] bg-[#FFFDF9] p-3 shadow-sm"
                >
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tên món (vd: Hành tây, Trứng gà,...)"
                    aria-label="Tên món"
                    className={`${inputCls} flex-1 basis-40`}
                    autoFocus
                  />
                  <input
                    type="text"
                    value={form.qty}
                    onChange={(e) => setForm({ ...form, qty: e.target.value })}
                    placeholder="Số lượng (vd: 500g, 1 bó)"
                    aria-label="Số lượng"
                    className={`${inputCls} w-36`}
                  />
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Giá (đ)"
                    aria-label="Giá"
                    className={`${inputCls} w-28`}
                  />
                  <select
                    value={form.group}
                    onChange={(e) => setForm({ ...form, group: e.target.value })}
                    aria-label="Nhóm"
                    className={inputCls}
                  >
                    {GROUPS.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!form.name.trim()}
                    className="rounded-full bg-[#184B3A] px-5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#12392c] disabled:opacity-50"
                  >
                    Thêm
                  </button>
                </form>
              )}

              {/* Trạng thái Loading */}
              {loading && (
                <div className="flex animate-pulse flex-col gap-3 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6">
                  <div className="h-6 w-48 rounded bg-[#EFE8DF]" />
                  <div className="h-10 w-full rounded-xl bg-[#EFE8DF]" />
                  <div className="h-10 w-full rounded-xl bg-[#EFE8DF]" />
                  <div className="h-10 w-full rounded-xl bg-[#EFE8DF]" />
                </div>
              )}

              {/* Trạng thái Lỗi */}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/60 p-8 text-center">
                  <AlertCircle className="mb-2 h-8 w-8 text-red-600" aria-hidden="true" />
                  <h4 className="text-base font-bold text-red-900">Không thể tải danh sách mua</h4>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <button
                    type="button"
                    onClick={loadData}
                    className="mt-4 flex items-center gap-2 rounded-full bg-[#184B3A] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#205543]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Thử lại
                  </button>
                </div>
              )}

              {/* Danh sách theo nhóm */}
              {!loading && !error && (
                <div className="overflow-hidden rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] shadow-sm">
                  {items.length === 0 ? (
                    <div className="p-10 text-center text-sm text-[#77736D]">
                      Danh sách đang trống. Bấm “Thêm món thủ công” để bắt đầu.
                    </div>
                  ) : (
                    GROUPS.map((g) => {
                      const groupItems = items.filter((i) => i.group === g.id);
                      if (groupItems.length === 0) return null;
                      const sum = groupItems.reduce((s, i) => s + i.price, 0);
                      const open = !collapsed[g.id];
                      return (
                        <div key={g.id}>
                          <button
                            type="button"
                            onClick={() => toggleGroup(g.id)}
                            aria-expanded={open}
                            className="flex w-full items-center gap-3 bg-[#F7F2E6] px-4 py-2.5 text-left"
                          >
                            <span className="text-2xl" aria-hidden="true">
                              {g.emoji}
                            </span>
                            <span className="flex-1 text-[15px] font-black text-[#202B24]">
                              {g.label} ({groupItems.length} món)
                            </span>
                            <span className="text-sm font-black text-[#184B3A]">~ {vnd(sum)}</span>
                            {open ? (
                              <ChevronUp className="h-5 w-5 text-[#3f3b36]" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-[#3f3b36]" aria-hidden="true" />
                            )}
                          </button>

                          {open && (
                            <ul>
                              {groupItems.map((i) => (
                                <li
                                  key={i.id}
                                  className="group flex items-center gap-3 border-b border-[#F0E9DF] px-4 py-2 last:border-b-0 hover:bg-[#FAF6F0]/50"
                                >
                                  <input
                                    type="checkbox"
                                    checked={i.done}
                                    onChange={() => toggleDone(i.id)}
                                    aria-label={`Đã mua ${i.name}`}
                                    className="h-5 w-5 shrink-0 cursor-pointer rounded-md border-[#D8D0C4] accent-[#184B3A]"
                                  />
                                  <span
                                    className="flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-[#F8F4EC] text-2xl select-none"
                                    aria-hidden="true"
                                  >
                                    {i.emoji || g.defaultEmoji}
                                  </span>
                                  <span
                                    className={`min-w-0 flex-1 truncate text-sm font-semibold ${
                                      i.done ? "text-[#9E9A93] line-through" : "text-[#202B24]"
                                    }`}
                                  >
                                    {i.name}
                                  </span>
                                  <span className="hidden w-36 shrink-0 text-sm text-[#5f5b55] sm:block">
                                    {i.qty}
                                  </span>
                                  <span className="w-24 shrink-0 text-right text-sm font-bold text-[#C86218]">
                                    {vnd(i.price)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeItem(i.id)}
                                    aria-label={`Xóa ${i.name}`}
                                    className="rounded-full p-1 text-[#9E9A93] opacity-0 transition-opacity hover:text-red-500 focus:opacity-100 group-hover:opacity-100"
                                  >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Thanh tổng kết */}
              {!loading && !error && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={items.length === 0}
                    className="flex items-center gap-2 rounded-full bg-[#EFE9DF] px-6 py-3 text-[13px] font-semibold text-[#3f3b36] shadow-sm transition-colors hover:bg-[#E7DFD2] disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Xóa danh sách
                  </button>

                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-sm font-medium text-[#202B24]">
                      Tổng chi phí dự kiến:{" "}
                      <span className="ml-1 text-2xl font-black text-[#1F7A4D]">{vnd(total)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={handleOrder}
                      disabled={items.length === 0 || ordered}
                      className={`flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-md transition-all ${
                        ordered
                          ? "cursor-default bg-emerald-600"
                          : "bg-[#184B3A] hover:bg-[#12392c] active:scale-[0.98]"
                      } disabled:opacity-60`}
                    >
                      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                      {ordered ? "✓ Đã đặt mua" : "Đặt mua ngay"}
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* ═════ CỘT PHẢI ═════ */}
            <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[340px] 2xl:w-[385px]">
              {/* Thống kê nhanh */}
              <div className="shrink-0 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-4 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-[15px] font-black text-[#202B24]">
                  <ChartIcon />
                  Thống kê nhanh
                </h3>
                <div className="grid grid-cols-3 gap-2.5">
                  <StatTile
                    icon={<ShoppingBasket className="h-8 w-8 text-emerald-700" aria-hidden="true" />}
                    value={String(items.length)}
                    label="Sản phẩm"
                  />
                  <StatTile
                    icon={<Wallet className="h-8 w-8 text-orange-500" aria-hidden="true" />}
                    value={vnd(total)}
                    label="Tổng chi phí"
                  />
                  <StatTile
                    icon={<Leaf className="h-8 w-8 fill-emerald-500 text-emerald-600" aria-hidden="true" />}
                    value={String(plannedMeals)}
                    label="Bữa ăn dự kiến"
                  />
                </div>
              </div>

              {/* Gợi ý nhỏ */}
              <div className="relative shrink-0 overflow-hidden rounded-3xl border border-[#FDE3B3] bg-gradient-to-br from-[#FFF9ED] via-[#FFF5E3] to-[#FFEECB] p-4 shadow-sm">
                <div className="relative z-10 max-w-[62%]">
                  <h3 className="mb-2 flex items-center gap-2 text-[15px] font-black text-[#202B24]">
                    <Lightbulb className="h-5 w-5 fill-amber-300 text-amber-500" aria-hidden="true" />
                    Gợi ý nhỏ
                  </h3>
                  <p className="text-xs leading-relaxed text-[#3f3b36]">
                    Bạn có thể thêm nguyên liệu từ{" "}
                    <Link href="/fridge" className="font-bold text-[#184B3A] hover:underline">
                      Tủ lạnh thông minh
                    </Link>{" "}
                    để tạo danh sách mua nhanh hơn!
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute -bottom-1 right-3 select-none text-[72px] leading-none"
                  aria-hidden="true"
                >
                  🧺
                </span>
              </div>

              {/* Danh sách gần đây */}
              <div className="shrink-0 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-[15px] font-black text-[#202B24]">
                    <Clock className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                    Danh sách gần đây
                  </h3>
                  <Link
                    href="/shopping"
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#184B3A] hover:underline"
                  >
                    Xem tất cả <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>

                {recentLists.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[#77736D]">Chưa có lịch sử danh sách mua nào.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {recentLists.map((l) => (
                      <li key={l.id}>
                        <div
                          className="flex items-center gap-3 rounded-2xl border border-[#F0E9DF] bg-[#FFFCF7] p-3 shadow-xs transition-colors hover:bg-[#FAF4ED]"
                        >
                          <CalendarDays className="h-8 w-8 shrink-0 text-emerald-700" aria-hidden="true" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-bold text-[#202B24]">{l.title}</span>
                            <span className="block text-[11px] text-[#77736D]">{l.sub}</span>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

// Icon cột biểu đồ nhỏ cho tiêu đề "Thống kê nhanh"
function ChartIcon() {
  return (
    <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="4" width="4" height="17" rx="1" />
      <rect x="17" y="9" width="4" height="12" rx="1" />
    </svg>
  );
}
