"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  ChefHat,
  ChevronDown,
  ChevronUp,
  Clock,
  Home,
  Leaf,
  Lightbulb,
  Plus,
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

/* ─── Helpers ─────────────────────────────────────────── */
const vnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

/* ─── Mock data (TODO: thay bằng API qua Axios) ───────── */
type Item = {
  id: string;
  group: string;
  name: string;
  emoji: string;
  qty: string;
  price: number;
  done: boolean;
};

const GROUPS = [
  { id: "veg", label: "Rau củ quả", emoji: "🍅", defaultEmoji: "🥬" },
  { id: "meat", label: "Thịt - Cá", emoji: "🥩", defaultEmoji: "🍖" },
  { id: "other", label: "Gia vị - Khác", emoji: "🍯", defaultEmoji: "🛒" },
];

const INITIAL_ITEMS: Item[] = [
  { id: "s1", group: "veg", name: "Rau muống", emoji: "🥬", qty: "~ 1 bó", price: 12000, done: false },
  { id: "s2", group: "veg", name: "Cà chua", emoji: "🍅", qty: "~ 1kg", price: 18000, done: false },
  { id: "s3", group: "veg", name: "Dưa leo", emoji: "🥒", qty: "~ 500g", price: 10000, done: false },
  { id: "s4", group: "veg", name: "Cải thảo", emoji: "🥬", qty: "~ 1kg", price: 15000, done: false },
  { id: "s5", group: "veg", name: "Ớt chuông", emoji: "🫑", qty: "~ 3 quả", price: 7000, done: false },
  { id: "s6", group: "meat", name: "Thịt gà", emoji: "🍗", qty: "~ 1kg", price: 85000, done: false },
  { id: "s7", group: "meat", name: "Cá hồi", emoji: "🐟", qty: "~ 500g", price: 95000, done: false },
  { id: "s8", group: "other", name: "Trứng gà", emoji: "🥚", qty: "~ 1 vỉ (10 quả)", price: 40000, done: false },
  { id: "s9", group: "other", name: "Hành lá", emoji: "🧅", qty: "~ 1 bó", price: 2000, done: false },
  { id: "s10", group: "other", name: "Tỏi", emoji: "🧄", qty: "~ 1 củ", price: 2000, done: false },
  { id: "s11", group: "other", name: "Muối i-ốt", emoji: "🧂", qty: "~ 1 gói", price: 1000, done: false },
];

const PLANNED_MEALS = 3; // TODO: lấy từ kế hoạch bữa ăn

const RANGES = [
  { id: "7d", label: "7 ngày tới", Icon: CalendarDays, hasCaret: true },
  { id: "1m", label: "1 tháng", Icon: CalendarDays, hasCaret: false },
  { id: "custom", label: "Tùy chỉnh", Icon: SlidersHorizontal, hasCaret: false },
];

const RECENT_LISTS = [
  { id: "today", title: "Danh sách hôm nay", sub: "12 món • 245.000đ" },
  { id: "lastweek", title: "Danh sách tuần trước", sub: "14 món • 320.000đ" },
];

const NAV_ITEMS = [
  { href: "/", label: "Trang chủ", Icon: Home },
  { href: "/recipes", label: "Công thức", Icon: Utensils },
  { href: "/fridge", label: "Tủ lạnh thông minh", Icon: Refrigerator },
  { href: "/shopping", label: "Danh sách mua", Icon: ShoppingCart },
  { href: "/history", label: "Lịch sử ăn uống", Icon: Clock },
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
    <div className="flex min-w-0 flex-col items-center rounded-2xl bg-[#FAF5EE] px-1.5 py-3 text-center">
      <div className="mb-1.5 flex h-9 w-9 items-center justify-center">{icon}</div>
      <p className="max-w-full truncate text-lg font-black leading-tight">{value}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-[#77736D]">{label}</p>
    </div>
  );
}

/* ─── Trang Danh sách mua ─────────────────────────────── */
export default function ShoppingPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(100);

  const [searchQuery, setSearchQuery] = useState("");
  const [range, setRange] = useState("7d");
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", qty: "", price: "", group: "veg" });
  const [ordered, setOrdered] = useState(false);

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

  const toggleDone = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const toggleGroup = (id: string) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    const group = GROUPS.find((g) => g.id === form.group) ?? GROUPS[0];
    // TODO: gọi POST /shopping-items
    setItems((prev) => [
      ...prev,
      {
        id: `s${nextId.current++}`,
        group: group.id,
        name,
        emoji: group.defaultEmoji,
        qty: form.qty.trim() ? `~ ${form.qty.trim()}` : "~ 1",
        price: Math.max(0, Number(form.price) || 0),
        done: false,
      },
    ]);
    setForm((f) => ({ ...f, name: "", qty: "", price: "" }));
  };

  const handleClear = () => {
    if (items.length === 0) return;
    // TODO: gọi DELETE /shopping-items
    if (window.confirm("Xóa toàn bộ danh sách mua?")) {
      setItems([]);
      setOrdered(false);
    }
  };

  const handleOrder = () => {
    if (items.length === 0) return;
    // TODO: gọi API đặt hàng
    setOrdered(true);
  };

  const inputCls =
    "min-w-0 rounded-full border border-[#EEE7DF] bg-white px-3.5 py-2 text-[13px] placeholder:text-[#9E9A93] focus:outline-none focus:ring-2 focus:ring-[#184B3A]";

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
                NA
              </span>
              <span className="hidden text-[13px] font-semibold sm:inline">Nguyễn Minh Anh</span>
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
        <main className="flex flex-1 flex-col gap-4 px-4 pb-8 lg:px-6">
          {/* Banner tiêu đề */}
          <div className="relative h-[130px] shrink-0 overflow-hidden rounded-3xl border border-[#EEE7DF] bg-gradient-to-r from-[#FFF8EC] via-[#F6F3DF] to-[#E3EDC8] shadow-sm">
            <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-7">
              <h2 className="flex items-center gap-3 text-4xl font-black leading-tight text-[#184B3A]">
                <ShoppingCart className="h-10 w-10 shrink-0" aria-hidden="true" />
                <span>
                  Danh sách <span className="text-[#F4A340]">mua</span>
                </span>
              </h2>
              <p className="mt-1 text-sm font-medium text-[#3f3b36]">
                Lên danh sách mua sắm thông minh, tiết kiệm thời gian và chi phí!
              </p>
            </div>
            <div
              className="pointer-events-none absolute bottom-0 right-6 hidden select-none items-end gap-1 text-[80px] leading-none sm:flex"
              aria-hidden="true"
            >
              <span className="-mb-3">🥬</span>
              <span className="-mb-3">🧺</span>
              <span className="-mb-3">🥛</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            {/* ═════ CỘT CHÍNH ═════ */}
            <section className="flex min-w-0 flex-1 flex-col gap-4">
              {/* Thanh công cụ */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex flex-wrap items-center gap-2.5" role="tablist" aria-label="Khoảng thời gian">
                  {RANGES.map(({ id, label, Icon, hasCaret }) => {
                    const active = range === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setRange(id)} // TODO: tải lại danh sách theo khoảng thời gian
                        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold shadow-sm transition-all ${
                          active
                            ? "bg-[#184B3A] text-white"
                            : "border border-[#EEE7DF] bg-[#FFFDF9] text-[#3f3b36] hover:bg-[#FAF4ED]"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                        {hasCaret && <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setAdding((v) => !v)}
                  aria-expanded={adding}
                  className="ml-auto flex items-center gap-2 rounded-full bg-[#E9EFDF] px-5 py-2.5 text-[13px] font-semibold text-[#184B3A] shadow-sm transition-colors hover:bg-[#DDE8CF]"
                >
                  {adding ? <X className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
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
                    placeholder="Tên món (vd: Hành tây)"
                    aria-label="Tên món"
                    className={`${inputCls} flex-1 basis-40`}
                    autoFocus
                  />
                  <input
                    type="text"
                    value={form.qty}
                    onChange={(e) => setForm({ ...form, qty: e.target.value })}
                    placeholder="Số lượng (vd: 500g)"
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

              {/* Danh sách theo nhóm */}
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
                          <span className="flex-1 text-[15px] font-black">
                            {g.label} ({groupItems.length} món)
                          </span>
                          <span className="text-sm font-black">~ {vnd(sum)}</span>
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
                                className="group flex items-center gap-3 border-b border-[#F0E9DF] px-4 py-1.5 last:border-b-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={i.done}
                                  onChange={() => toggleDone(i.id)}
                                  aria-label={`Đã mua ${i.name}`}
                                  className="h-5 w-5 shrink-0 cursor-pointer rounded-md border-[#D8D0C4] accent-[#184B3A]"
                                />
                                <span
                                  className="flex h-10 w-20 shrink-0 items-center justify-center rounded-lg bg-[#F8F4EC] text-3xl"
                                  aria-hidden="true"
                                >
                                  {i.emoji}
                                </span>
                                <span
                                  className={`min-w-0 flex-1 truncate text-sm font-medium ${
                                    i.done ? "text-[#9E9A93] line-through" : ""
                                  }`}
                                >
                                  {i.name}
                                </span>
                                <span className="hidden w-40 shrink-0 text-sm text-[#3f3b36] sm:block">{i.qty}</span>
                                <span className="w-24 shrink-0 text-right text-sm font-semibold">{vnd(i.price)}</span>
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

              {/* Thanh tổng kết */}
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
                  <p className="text-sm font-medium">
                    Tổng chi phí dự kiến:{" "}
                    <span className="ml-1 text-2xl font-black text-[#1F7A4D]">{vnd(total)}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleOrder}
                    disabled={items.length === 0 || ordered}
                    className={`flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-md transition-all ${
                      ordered ? "cursor-default bg-emerald-600" : "bg-[#184B3A] hover:bg-[#12392c] active:scale-[0.98]"
                    } disabled:opacity-60`}
                  >
                    <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                    {ordered ? "✓ Đã đặt mua" : "Đặt mua ngay"}
                  </button>
                </div>
              </div>
            </section>

            {/* ═════ CỘT PHẢI ═════ */}
            <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[340px] 2xl:w-[385px]">
              {/* Thống kê nhanh */}
              <div className="shrink-0 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-4 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-[15px] font-black">
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
                    value={String(PLANNED_MEALS)}
                    label="Bữa ăn dự kiến"
                  />
                </div>
              </div>

              {/* Gợi ý nhỏ */}
              <div className="relative shrink-0 overflow-hidden rounded-3xl border border-[#FDE3B3] bg-gradient-to-br from-[#FFF9ED] via-[#FFF5E3] to-[#FFEECB] p-4 shadow-sm">
                <div className="relative z-10 max-w-[62%]">
                  <h3 className="mb-2 flex items-center gap-2 text-[15px] font-black">
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
                  <h3 className="flex items-center gap-2 text-[15px] font-black">
                    <Clock className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                    Danh sách gần đây
                  </h3>
                  <Link
                    href="/shopping/history"
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#184B3A] hover:underline"
                  >
                    Xem tất cả <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
                <ul className="space-y-2.5">
                  {RECENT_LISTS.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={`/shopping/${l.id}`}
                        className="flex items-center gap-3 rounded-2xl border border-[#F0E9DF] bg-[#FFFCF7] p-3 shadow-sm transition-colors hover:bg-[#FAF4ED]"
                      >
                        <CalendarDays className="h-8 w-8 shrink-0 text-emerald-700" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-bold">{l.title}</span>
                          <span className="block text-[11px] text-[#77736D]">{l.sub}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
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
