"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Bookmark,
  Calendar,
  CalendarCheck,
  Camera,
  ChefHat,
  ChevronDown,
  ChevronRight,
  Clock,
  Crown,
  Heart,
  Home,
  LogOut,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Refrigerator,
  Search,
  Settings,
  ShoppingCart,
  Star,
  User,
  UserRound,
  Utensils,
} from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────── */
const vnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
};
const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

/* ─── Mock data (TODO: thay bằng API qua Axios) ───────── */
type Profile = {
  name: string;
  email: string;
  phone: string;
  birthday: string; // yyyy-mm-dd
  address: string;
};

const INITIAL_PROFILE: Profile = {
  name: "Vũ Quang Huy",
  email: "vuquanghuybm2k6@gmail.com",
  phone: "0987 654 321",
  birthday: "2006-01-01",
  address: "Hà Nội, Việt Nam",
};

const STATS = { saved: 24, orders: 12, rating: 4.8, likes: 56 };
const MEMBER_TIER = "Thành viên Bạc";

const ORDERS = [
  { id: "#BSV1024", date: "14/11/2026", items: "Rau củ quả, Thịt gà, Cá hồi", total: 287000, status: "Đang giao" },
  { id: "#BSV0987", date: "07/11/2026", items: "Trứng gà, Cà chua, Cải thảo", total: 98000, status: "Hoàn thành" },
  { id: "#BSV0911", date: "29/10/2026", items: "Thịt bò, Ớt chuông, Hành tây", total: 165000, status: "Hoàn thành" },
];

const SAVED_RECIPES = [
  { id: "r1", title: "Phở bò truyền thống", meta: "45 phút • 420 kcal", emoji: "🍜" },
  { id: "r2", title: "Tôm xào bông cải xanh", meta: "20 phút • 180 kcal", emoji: "🍤" },
  { id: "r4", title: "Cơm chiên trứng", meta: "15 phút • 350 kcal", emoji: "🍚" },
];

const REVIEWS = [
  { id: "v1", title: "Canh sườn ngô ngọt", stars: 5, note: "Nước ngọt thanh, rất dễ nấu!" },
  { id: "v2", title: "Gà kho gừng", stars: 4, note: "Đưa cơm, lần sau mình bớt mặn." },
];

const TABS = [
  { id: "info", label: "Thông tin cá nhân", Icon: UserRound },
  { id: "orders", label: "Đơn hàng của tôi", Icon: ShoppingCart },
  { id: "saved", label: "Công thức đã lưu", Icon: Bookmark },
  { id: "reviews", label: "Đánh giá của tôi", Icon: Star },
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

/* ─── Ô số liệu có icon ───────────────────────────────── */
function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-1 text-center">
      <div className="mb-1 flex h-9 w-9 items-center justify-center">{icon}</div>
      <p className="text-xl font-black leading-tight">{value}</p>
      <p className="mt-0.5 text-xs leading-tight text-[#5f5b55]">{label}</p>
    </div>
  );
}

const Divider = () => <span className="my-2 w-px shrink-0 self-stretch bg-[#EEE7DF]" aria-hidden="true" />;

/* ─── Một dòng thông tin ──────────────────────────────── */
function InfoRow({
  Icon,
  label,
  children,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#F0E9DF] py-3 last:border-b-0 sm:flex-row sm:items-center sm:gap-0">
      <div className="flex shrink-0 items-center gap-3 text-[#5f5b55] sm:w-52">
        <Icon className="h-5 w-5 text-[#8a8780]" />
        <span className="text-[15px]">{label}</span>
      </div>
      <div className="min-w-0 flex-1 text-base font-medium">{children}</div>
    </div>
  );
}

/* ─── Trang Hồ sơ cá nhân ─────────────────────────────── */
export default function ProfilePage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("info");
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [draft, setDraft] = useState<Profile>(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

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

  // Dọn URL ảnh tạm khi đổi ảnh hoặc rời trang
  useEffect(
    () => () => {
      if (avatar) URL.revokeObjectURL(avatar);
    },
    [avatar]
  );

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:3000/api/v1/profile");
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            setProfile(json.data);
            setDraft(json.data);
          }
        }
      } catch (err) {
        console.warn("Chưa tải được profile:", err);
      }
    }
    fetchProfile();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/recipes?q=${encodeURIComponent(q)}` : "/recipes");
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const startEdit = () => {
    setDraft(profile);
    setError("");
    setSaved(false);
    setTab("info");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError("");
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) return setError("Vui lòng nhập họ và tên.");
    if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) return setError("Email chưa đúng định dạng.");
    
    const updated = { ...draft, name: draft.name.trim(), email: draft.email.trim() };
    setProfile(updated);
    setEditing(false);
    setError("");
    setSaved(true);

    try {
      await fetch("http://localhost:3000/api/v1/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn("Lỗi lưu profile:", err);
    }
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    // TODO: upload ảnh lên Cloudinary rồi lưu URL
    setAvatar(URL.createObjectURL(file));
  };

  const handleLogout = () => {
    // TODO: gọi API đăng xuất, xóa token
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) router.push("/login");
  };

  const inputCls =
    "w-full rounded-xl border border-[#EEE7DF] bg-white px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#184B3A]";

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
              aria-label="Thông báo, 8 chưa đọc"
              className="relative rounded-full p-2.5 transition-colors hover:bg-[#FAF4ED]"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                8
              </span>
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-[#FAF4ED]"
            >
              <span
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#184B3A] text-xs font-bold text-white"
                aria-hidden="true"
              >
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials(profile.name)
                )}
              </span>
              <span className="hidden text-[13px] font-semibold sm:inline">{profile.name}</span>
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
          {/* Tiêu đề */}
          <div className="relative shrink-0 overflow-hidden rounded-3xl">
            <div className="relative z-10 py-1">
              <h2 className="flex items-center gap-3 text-4xl font-black leading-tight text-[#184B3A]">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E7EEDB]"
                  aria-hidden="true"
                >
                  <User className="h-8 w-8 fill-[#184B3A]" />
                </span>
                Hồ sơ cá nhân
              </h2>
              <p className="mt-1 text-[15px] font-medium text-[#3f3b36]">
                Quản lý thông tin tài khoản và theo dõi hoạt động của bạn
              </p>
            </div>
            <div
              className="pointer-events-none absolute right-6 top-0 hidden select-none gap-3 text-6xl opacity-80 md:flex"
              aria-hidden="true"
            >
              <span>🍃</span>
              <span>🥔</span>
              <span>👨‍🍳</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            {/* ═════ CỘT TRÁI: thẻ hồ sơ ═════ */}
            <section className="w-full shrink-0 self-start rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-5 shadow-sm lg:w-[330px] 2xl:w-[360px]">
              <div className="relative flex flex-col items-center rounded-3xl bg-gradient-to-b from-[#EEF3E2] to-transparent pb-1 pt-4">
                <div className="relative">
                  <div className="flex h-[132px] w-[132px] items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-gradient-to-br from-[#184B3A] to-[#2F7A57] text-4xl font-black text-white shadow-md">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt={`Ảnh đại diện của ${profile.name}`} className="h-full w-full object-cover" />
                    ) : (
                      initials(profile.name)
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    aria-label="Đổi ảnh đại diện"
                    className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#1F7A4D] text-white shadow-md transition-transform hover:scale-110"
                  >
                    <Camera className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                </div>
                <span className="pointer-events-none absolute right-2 top-3 rotate-12 select-none text-4xl" aria-hidden="true">
                  🍳
                </span>
              </div>

              <div className="mt-2 text-center">
                <h3 className="text-2xl font-black">{profile.name}</h3>
                <p className="mt-1 text-[15px] text-[#3f3b36]">{profile.email}</p>
                <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#E9EFDF] px-5 py-1.5 text-sm font-bold text-[#184B3A]">
                  <Crown className="h-5 w-5 fill-amber-400 text-amber-500" aria-hidden="true" />
                  {MEMBER_TIER}
                </span>
              </div>

              <div className="my-4 flex border-t border-[#EEE7DF] pt-4">
                <MiniStat
                  icon={<ChefHat className="h-7 w-7 text-amber-500" aria-hidden="true" />}
                  value={STATS.saved}
                  label="Công thức đã lưu"
                />
                <Divider />
                <MiniStat
                  icon={<ShoppingCart className="h-7 w-7 text-emerald-600" aria-hidden="true" />}
                  value={STATS.orders}
                  label="Đơn hàng"
                />
                <Divider />
                <MiniStat
                  icon={<Star className="h-7 w-7 fill-amber-400 text-amber-400" aria-hidden="true" />}
                  value={STATS.rating}
                  label="Đánh giá trung bình"
                />
              </div>

              <button
                type="button"
                onClick={startEdit}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2F5D46] py-3 text-base font-bold text-white shadow-md transition-colors hover:bg-[#184B3A]"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Chỉnh sửa hồ sơ
              </button>
            </section>

            {/* ═════ CỘT PHẢI ═════ */}
            <section className="flex min-w-0 flex-1 flex-col gap-4">
              {/* Tabs */}
              <div
                className="flex gap-2 overflow-x-auto rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-2 shadow-sm"
                role="tablist"
                aria-label="Mục hồ sơ"
              >
                {TABS.map(({ id, label, Icon }) => {
                  const active = tab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(id)}
                      className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-[#E7EEDB] font-bold text-[#184B3A] shadow-[inset_0_-3px_0_#2F5D46]"
                          : "text-[#3f3b36] hover:bg-[#FAF4ED]"
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Nội dung tab */}
              <div role="tabpanel" className="rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-5 shadow-sm">
                {tab === "info" && (
                  <form onSubmit={saveEdit}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="flex items-center gap-2.5 text-lg font-black">
                        <UserRound className="h-7 w-7 text-emerald-700" aria-hidden="true" />
                        Thông tin cá nhân
                      </h3>
                      {editing ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-full border border-[#EEE7DF] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#FAF4ED]"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="rounded-full bg-[#184B3A] px-5 py-2 text-sm font-bold text-white hover:bg-[#12392c]"
                          >
                            Lưu
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startEdit}
                          className="flex items-center gap-2 rounded-full bg-[#FDE7C2] px-5 py-2 text-sm font-bold text-[#C86218] shadow-sm transition-colors hover:bg-[#FBDCA9]"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          Chỉnh sửa
                        </button>
                      )}
                    </div>

                    {error && (
                      <p role="alert" className="mb-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                        {error}
                      </p>
                    )}
                    {saved && !editing && (
                      <p aria-live="polite" className="mb-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                        ✓ Đã lưu thông tin của bạn.
                      </p>
                    )}

                    <div className="border-t border-[#F0E9DF]">
                      <InfoRow Icon={UserRound} label="Họ và tên">
                        {editing ? (
                          <input
                            className={inputCls}
                            value={draft.name}
                            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                            aria-label="Họ và tên"
                          />
                        ) : (
                          profile.name
                        )}
                      </InfoRow>
                      <InfoRow Icon={Mail} label="Email">
                        {editing ? (
                          <input
                            type="email"
                            className={inputCls}
                            value={draft.email}
                            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                            aria-label="Email"
                          />
                        ) : (
                          profile.email
                        )}
                      </InfoRow>
                      <InfoRow Icon={Phone} label="Số điện thoại">
                        {editing ? (
                          <input
                            type="tel"
                            className={inputCls}
                            value={draft.phone}
                            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                            aria-label="Số điện thoại"
                          />
                        ) : (
                          profile.phone
                        )}
                      </InfoRow>
                      <InfoRow Icon={Calendar} label="Ngày sinh">
                        {editing ? (
                          <input
                            type="date"
                            className={inputCls}
                            value={draft.birthday}
                            onChange={(e) => setDraft({ ...draft, birthday: e.target.value })}
                            aria-label="Ngày sinh"
                          />
                        ) : (
                          fmtDate(profile.birthday)
                        )}
                      </InfoRow>
                      <InfoRow Icon={MapPin} label="Địa chỉ">
                        {editing ? (
                          <input
                            className={inputCls}
                            value={draft.address}
                            onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                            aria-label="Địa chỉ"
                          />
                        ) : (
                          profile.address
                        )}
                      </InfoRow>
                    </div>
                  </form>
                )}

                {tab === "orders" && (
                  <>
                    <h3 className="mb-3 flex items-center gap-2.5 text-lg font-black">
                      <ShoppingCart className="h-7 w-7 text-emerald-700" aria-hidden="true" />
                      Đơn hàng của tôi
                    </h3>
                    <ul className="space-y-2.5">
                      {ORDERS.map((o) => (
                        <li
                          key={o.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F0E9DF] bg-[#FFFCF7] p-3.5"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-bold">
                              {o.id} <span className="font-normal text-[#77736D]">• {o.date}</span>
                            </p>
                            <p className="truncate text-xs text-[#5f5b55]">{o.items}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                                o.status === "Hoàn thành" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-600"
                              }`}
                            >
                              {o.status}
                            </span>
                            <span className="text-sm font-black">{vnd(o.total)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {tab === "saved" && (
                  <>
                    <h3 className="mb-3 flex items-center gap-2.5 text-lg font-black">
                      <Bookmark className="h-7 w-7 text-emerald-700" aria-hidden="true" />
                      Công thức đã lưu
                    </h3>
                    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {SAVED_RECIPES.map((r) => (
                        <li key={r.id}>
                          <Link
                            href={`/recipes/${r.id}`}
                            className="flex items-center gap-3 rounded-2xl border border-[#F0E9DF] bg-[#FFFCF7] p-3 transition-colors hover:bg-[#FAF4ED]"
                          >
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F4EC] text-3xl" aria-hidden="true">
                              {r.emoji}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-bold">{r.title}</span>
                              <span className="block text-xs text-[#77736D]">{r.meta}</span>
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {tab === "reviews" && (
                  <>
                    <h3 className="mb-3 flex items-center gap-2.5 text-lg font-black">
                      <Star className="h-7 w-7 fill-amber-400 text-amber-400" aria-hidden="true" />
                      Đánh giá của tôi
                    </h3>
                    <ul className="space-y-2.5">
                      {REVIEWS.map((v) => (
                        <li key={v.id} className="rounded-2xl border border-[#F0E9DF] bg-[#FFFCF7] p-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold">{v.title}</p>
                            <span className="flex" aria-label={`${v.stars} trên 5 sao`}>
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < v.stars ? "fill-amber-400 text-amber-400" : "text-stone-300"}`}
                                  aria-hidden="true"
                                />
                              ))}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#5f5b55]">{v.note}</p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Thống kê + cài đặt */}
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_1fr]">
                <div className="rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-5 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2.5 text-lg font-black">
                    <svg className="h-6 w-6 text-emerald-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="3" y="12" width="4" height="9" rx="1" />
                      <rect x="10" y="4" width="4" height="17" rx="1" />
                      <rect x="17" y="9" width="4" height="12" rx="1" />
                    </svg>
                    Thống kê hoạt động
                  </h3>
                  <div className="flex">
                    <MiniStat
                      icon={<ChefHat className="h-8 w-8 text-amber-500" aria-hidden="true" />}
                      value={STATS.saved}
                      label="Công thức đã lưu"
                    />
                    <Divider />
                    <MiniStat
                      icon={<ShoppingCart className="h-8 w-8 text-emerald-600" aria-hidden="true" />}
                      value={STATS.orders}
                      label="Đơn hàng"
                    />
                    <Divider />
                    <MiniStat
                      icon={<Heart className="h-8 w-8 fill-red-500 text-red-500" aria-hidden="true" />}
                      value={STATS.likes}
                      label="Lượt yêu thích"
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-5 shadow-sm">
                  <h3 className="mb-2 flex items-center gap-2.5 text-lg font-black">
                    <Settings className="h-6 w-6" aria-hidden="true" />
                    Cài đặt tài khoản
                  </h3>
                  <ul className="divide-y divide-[#F0E9DF]">
                    <li>
                      <Link
                        href="/profile/password"
                        className="flex items-center gap-3 py-2.5 text-[15px] transition-colors hover:text-[#184B3A]"
                      >
                        <Lock className="h-5 w-5 text-[#8a8780]" aria-hidden="true" />
                        <span className="flex-1">Đổi mật khẩu</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile/notifications"
                        className="flex items-center gap-3 py-2.5 text-[15px] transition-colors hover:text-[#184B3A]"
                      >
                        <Bell className="h-5 w-5 text-[#8a8780]" aria-hidden="true" />
                        <span className="flex-1">Thông báo</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 py-2.5 text-left text-[15px] transition-colors hover:text-red-600"
                      >
                        <LogOut className="h-5 w-5 text-[#8a8780]" aria-hidden="true" />
                        <span className="flex-1">Đăng xuất</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
