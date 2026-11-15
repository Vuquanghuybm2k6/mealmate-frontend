"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlarmClock,
  ArrowRight,
  Beef,
  Bell,
  ChefHat,
  ChevronDown,
  Clock,
  Flame,
  Heart,
  Home,
  RefreshCw,
  Refrigerator,
  Search,
  ShoppingCart,
  Sparkles,
  Tag,
  User,
  Utensils,
  Wallet,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

/* ─── Helpers ─────────────────────────────────────────── */
const vnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

const fireConfetti = (particleCount: number) => {
  try {
    confetti({ particleCount, spread: 70, origin: { y: 0.6 } });
  } catch (err) {
    console.warn("confetti failed", err);
  }
};

/* ─── Mock data (TODO: thay bằng API qua Axios) ───────── */
// Ảnh: thay bằng URL Cloudinary của bạn. Nếu ảnh lỗi/trống, thẻ tự hiện emoji.
const RECIPES = [
  {
    id: "r1",
    title: "Cơm trứng cà chua",
    emoji: "🍚",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
    cost: 12000,
    time: 15,
    kcal: 420,
    protein: 18,
  },
  {
    id: "r2",
    title: "Đậu phụ sốt cà chua",
    emoji: "🥘",
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80",
    cost: 15000,
    time: 18,
    kcal: 350,
    protein: 16,
  },
  {
    id: "r3",
    title: "Mì xào trứng rau củ",
    emoji: "🍜",
    img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80",
    cost: 14000,
    time: 15,
    kcal: 360,
    protein: 16,
  },
  {
    id: "r4",
    title: "Canh trứng rong biển",
    emoji: "🍲",
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80",
    cost: 8000,
    time: 12,
    kcal: 120,
    protein: 10,
  },
];

type Recipe = (typeof RECIPES)[number];

const HERO_IMG =
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80";

// Các route này cần được tạo trong app/ (hiện chưa có thì bấm sẽ ra 404).
const NAV_ITEMS = [
  { href: "/", label: "Trang chủ", Icon: Home },
  { href: "/recipes", label: "Công thức", Icon: Utensils },
  { href: "/fridge", label: "Tủ lạnh thông minh", Icon: Refrigerator },
  { href: "/shopping", label: "Danh sách mua", Icon: ShoppingCart },
  { href: "/history", label: "Lịch sử ăn uống", Icon: Clock },
  { href: "/profile", label: "Hồ sơ cá nhân", Icon: User },
];

const SHORTCUTS = [
  {
    href: "/recipes?filter=budget",
    title: "Theo ngân sách",
    sub: "Bạn có bao nhiêu tiền?",
    Icon3D: () => <Wallet3DIcon />,
  },
  {
    href: "/fridge",
    title: "Tủ lạnh thông minh",
    sub: "Bạn đang có gì?",
    Icon3D: () => <Fridge3DIcon />,
  },
  {
    href: "/recipes?maxTime=20",
    title: "Món nhanh < 20 phút",
    sub: "Nấu nhanh, ăn ngon",
    Icon3D: () => <Lightning3DIcon />,
  },
];

/* ─── Ảnh có fallback ─────────────────────────────────── */
function FoodImage({
  src,
  alt,
  emoji,
  className = "",
}: {
  src?: string;
  alt: string;
  emoji: string;
  className?: string;
}) {
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
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

/* ─── SVG minh hoạ ────────────────────────────────────── */
function ChibiChefMascot() {
  return (
    <div className="flex select-none flex-col items-center">
      <svg
        className="h-24 w-24 drop-shadow-sm"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 75 C10 65 18 62 20 68 C22 74 15 78 12 75Z" fill="#3bb878" opacity="0.85" />
        <path d="M88 72 C92 64 84 60 82 66 C80 72 86 76 88 72Z" fill="#3bb878" opacity="0.85" />
        <path d="M16 48 C14 42 20 40 22 44 C23 48 18 51 16 48Z" fill="#48c78e" opacity="0.75" />
        <path d="M84 45 C86 39 80 37 78 41 C77 45 82 48 84 45Z" fill="#48c78e" opacity="0.75" />
        <circle cx="50" cy="52" r="23" fill="#422518" />
        <circle cx="28" cy="56" r="10" fill="#422518" />
        <circle cx="72" cy="56" r="10" fill="#422518" />
        <circle cx="50" cy="54" r="19" fill="#ffdfcb" />
        <path d="M33 46 Q42 54 50 48 Q58 54 67 46 Q50 36 33 46Z" fill="#422518" />
        <path d="M40 53 Q44 48 48 53" stroke="#2c160c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M52 53 Q56 48 60 53" stroke="#2c160c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="37" cy="58" rx="4.5" ry="2.5" fill="#ff6b6b" opacity="0.8" />
        <ellipse cx="63" cy="58" rx="4.5" ry="2.5" fill="#ff6b6b" opacity="0.8" />
        <path d="M47 58 Q50 62 53 58" stroke="#d64545" strokeWidth="1.8" strokeLinecap="round" fill="#ff9999" />
        <ellipse cx="50" cy="36" rx="20" ry="11" fill="#ffffff" />
        <circle cx="38" cy="27" r="12" fill="#ffffff" />
        <circle cx="62" cy="27" r="12" fill="#ffffff" />
        <circle cx="50" cy="23" r="14" fill="#ffffff" />
        <rect x="32" y="34" width="36" height="6" rx="3" fill="#f4efe6" stroke="#dedad0" strokeWidth="0.8" />
        <path d="M36 71 L32 94 L68 94 L64 71 Z" fill="#0f3a2c" />
        <path d="M42 71 L40 94 L60 94 L58 71 Z" fill="#ffffff" />
        <circle cx="50" cy="80" r="4.5" fill="#f4a340" />
        <path d="M48 81 L50 78 L52 81 Z" fill="#184b3a" />
        <rect x="18" y="44" width="3.5" height="28" rx="1.5" fill="#c49a6c" transform="rotate(-15 18 44)" />
        <rect x="15" y="36" width="9" height="12" rx="2" fill="#9e7346" transform="rotate(-15 15 36)" />
        <circle cx="26" cy="65" r="5" fill="#ffdfcb" />
        <circle cx="74" cy="65" r="5" fill="#ffdfcb" />
      </svg>
      <p className="mt-1 text-center text-[11px] font-medium italic leading-snug text-[#A3C4B6]">
        &ldquo;Ăn ngon mỗi ngày
        <br />
        cùng BếpSV nhé! ♡&rdquo;
      </p>
    </div>
  );
}

function IconTile({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-sm"
      style={{ backgroundColor: bg, borderColor: "rgba(0,0,0,0.06)" }}
    >
      {children}
    </div>
  );
}

function Wallet3DIcon() {
  return (
    <IconTile bg="#EAF5EC">
      <svg className="h-6 w-6" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="8" y="6" width="20" height="10" rx="2" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
        <circle cx="18" cy="11" r="2" fill="#16a34a" />
        <rect x="5" y="11" width="26" height="19" rx="4" fill="#3b7a57" />
        <path d="M5 14 C5 12.5 6.5 11 8 11 L28 11 C29.5 11 31 12.5 31 14 L31 20 C31 22 29 23 27 23 L20 23 C18 23 16 25 15 26 L5 26 Z" fill="#2d6346" />
        <circle cx="26" cy="20.5" r="3" fill="#fcd34d" stroke="#d97706" strokeWidth="1" />
      </svg>
    </IconTile>
  );
}

function Fridge3DIcon() {
  return (
    <IconTile bg="#EAF3FA">
      <svg className="h-6 w-6" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="8" y="4" width="20" height="28" rx="4" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1.2" />
        <line x1="8" y1="14" x2="28" y2="14" stroke="#0284c7" strokeWidth="1.5" />
        <rect x="10" y="8" width="2" height="4" rx="1" fill="#ffffff" />
        <rect x="10" y="17" width="2" height="7" rx="1" fill="#ffffff" />
        <rect x="16" y="7" width="5" height="4" rx="1" fill="#fef08a" />
      </svg>
    </IconTile>
  );
}

function Lightning3DIcon() {
  return (
    <IconTile bg="#FEF6E8">
      <svg className="h-6 w-6" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path d="M20 4 L10 18 L18 18 L16 32 L26 18 L18 18 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M19 7 L12 17 L17 17 L16 27 L23 17 L18 17 Z" fill="#fde047" />
      </svg>
    </IconTile>
  );
}

function Checklist3DIcon() {
  return (
    <IconTile bg="#E8F5F3">
      <svg className="h-6 w-6" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="7" y="6" width="22" height="26" rx="3" fill="#ffffff" stroke="#0d9488" strokeWidth="1.2" />
        <rect x="7" y="6" width="22" height="7" rx="2" fill="#0d9488" />
        <circle cx="18" cy="9.5" r="2" fill="#ef4444" />
        <path d="M11 18 L13 20 L17 16" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="19" y1="18" x2="25" y2="18" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 24 L13 26 L17 22" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="19" y1="24" x2="25" y2="24" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </IconTile>
  );
}

function PeekingCat() {
  return (
    <svg className="inline-block h-9 w-14 drop-shadow-sm" viewBox="0 0 60 40" fill="none" aria-hidden="true">
      <polygon points="12,18 20,4 26,16" fill="#FFFDF9" stroke="#333" strokeWidth="1.2" strokeLinejoin="round" />
      <polygon points="15,16 20,8 24,15" fill="#ffb4b4" />
      <polygon points="48,18 40,4 34,16" fill="#FFFDF9" stroke="#333" strokeWidth="1.2" strokeLinejoin="round" />
      <polygon points="45,16 40,8 36,15" fill="#ffb4b4" />
      <ellipse cx="30" cy="22" rx="20" ry="14" fill="#FFFDF9" stroke="#333" strokeWidth="1.2" />
      <circle cx="23" cy="22" r="2" fill="#222" />
      <circle cx="37" cy="22" r="2" fill="#222" />
      <polygon points="30,24 28.5,26.5 31.5,26.5" fill="#ff8a8a" />
      <path d="M28.5 26.5 Q27 28.5 25 27.5" stroke="#333" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M31.5 26.5 Q33 28.5 35 27.5" stroke="#333" strokeWidth="1" strokeLinecap="round" fill="none" />
      <line x1="14" y1="22" x2="6" y2="21" stroke="#444" strokeWidth="0.9" />
      <line x1="14" y1="25" x2="7" y2="27" stroke="#444" strokeWidth="0.9" />
      <line x1="46" y1="22" x2="54" y2="21" stroke="#444" strokeWidth="0.9" />
      <line x1="46" y1="25" x2="53" y2="27" stroke="#444" strokeWidth="0.9" />
      <ellipse cx="20" cy="34" rx="5" ry="3" fill="#FFFDF9" stroke="#333" strokeWidth="1.1" />
      <ellipse cx="40" cy="34" rx="5" ry="3" fill="#FFFDF9" stroke="#333" strokeWidth="1.1" />
    </svg>
  );
}

function GoldenBell() {
  // useId để gradient không bị trùng id khi render nhiều chuông
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      className="h-16 w-16 animate-pulse drop-shadow-md"
      style={{ animationDuration: "3s" }}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-bell`} cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff3a8" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <linearGradient id={`${uid}-base`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="20" r="7" stroke="#b45309" strokeWidth="4" fill="none" />
      <path d="M50 24 C34 24 30 52 22 66 C20 70 24 74 30 74 L70 74 C76 74 80 70 78 66 C70 52 66 24 50 24 Z" fill={`url(#${uid}-bell)`} stroke="#b45309" strokeWidth="1.5" />
      <rect x="20" y="72" width="60" height="7" rx="3.5" fill={`url(#${uid}-base)`} stroke="#92400e" strokeWidth="1" />
      <circle cx="50" cy="83" r="6" fill="#b45309" />
      <path d="M38 32 C34 38 32 50 30 62" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function GiftBoxes() {
  return (
    <svg className="h-[67px] w-[76px] drop-shadow-sm" viewBox="0 0 85 75" fill="none" aria-hidden="true">
      <rect x="8" y="28" width="38" height="36" rx="4" fill="#fb923c" stroke="#ea580c" strokeWidth="1.2" />
      <rect x="5" y="22" width="44" height="9" rx="3" fill="#f97316" stroke="#ea580c" strokeWidth="1.2" />
      <rect x="24" y="28" width="6" height="36" fill="#fde047" />
      <rect x="24" y="22" width="6" height="9" fill="#fde047" />
      <ellipse cx="22" cy="18" rx="5" ry="3.5" fill="#fde047" stroke="#eab308" strokeWidth="1" transform="rotate(-20 22 18)" />
      <ellipse cx="32" cy="18" rx="5" ry="3.5" fill="#fde047" stroke="#eab308" strokeWidth="1" transform="rotate(20 32 18)" />
      <circle cx="27" cy="19" r="2" fill="#ca8a04" />
      <rect x="40" y="38" width="36" height="28" rx="4" fill="#22c55e" stroke="#15803d" strokeWidth="1.2" />
      <rect x="37" y="33" width="42" height="8" rx="2.5" fill="#16a34a" stroke="#15803d" strokeWidth="1.2" />
      <rect x="55" y="38" width="6" height="28" fill="#ef4444" />
      <rect x="55" y="33" width="6" height="8" fill="#ef4444" />
      <ellipse cx="53" cy="29" rx="4.5" ry="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" transform="rotate(-15 53 29)" />
      <ellipse cx="63" cy="29" rx="4.5" ry="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" transform="rotate(15 63 29)" />
      <circle cx="58" cy="30" r="1.8" fill="#991b1b" />
    </svg>
  );
}

/* ─── Vòng quay ───────────────────────────────────────── */
const SEG = 360 / RECIPES.length;
const SPIN_MS = 3200;
const WHEEL_COLORS = ["#f97316", "#fbbf24", "#22c55e", "#38bdf8"];
const WHEEL_BG = `conic-gradient(${RECIPES.map(
  (_, i) => `${WHEEL_COLORS[i % WHEEL_COLORS.length]} ${i * SEG}deg ${(i + 1) * SEG}deg`
).join(", ")})`;

// Bản nhỏ trang trí trên trang chủ
function WheelGraphic() {
  return (
    <span
      className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[5px] border-[#FCD34D] shadow-md"
      style={{ background: WHEEL_BG }}
      aria-hidden="true"
    >
      {RECIPES.map((r, i) => (
        <span
          key={r.id}
          className="absolute inset-0 flex justify-center"
          style={{ transform: `rotate(${i * SEG + SEG / 2}deg)` }}
        >
          <span className="mt-2 text-sm">{r.emoji}</span>
        </span>
      ))}
      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#f97316] text-center text-[10px] font-black leading-tight text-white shadow-md">
        Quay
        <br />
        ngay
      </span>
    </span>
  );
}

function LuckyWheelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [deg, setDeg] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [chosen, setChosen] = useState<Recipe | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Esc để đóng
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Dọn timer khi đóng modal hoặc unmount
  useEffect(() => {
    if (!open) {
      if (timer.current) clearTimeout(timer.current);
      setSpinning(false);
      setChosen(null);
    }
  }, [open]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  if (!open) return null;

  const spin = () => {
    if (spinning) return;
    // Chọn món trước, rồi tính góc để kim chỉ dừng đúng ô của món đó
    const index = Math.floor(Math.random() * RECIPES.length);
    const target = (360 - (index * SEG + SEG / 2)) % 360;
    setSpinning(true);
    setChosen(null);
    setDeg((d) => d - (d % 360) + 360 * 5 + target);
    timer.current = setTimeout(() => {
      setChosen(RECIPES[index]);
      setSpinning(false);
      fireConfetti(100);
    }, SPIN_MS);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wheel-title"
        className="relative w-full max-w-sm rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng vòng quay"
          className="absolute right-3 top-3 rounded-full p-1.5 transition-colors hover:bg-stone-100"
        >
          <X className="h-4 w-4 text-stone-500" />
        </button>

        <h3 id="wheel-title" className="mb-1 text-lg font-black text-[#202B24]">
          🎡 Vòng quay may mắn
        </h3>
        <p className="mb-5 text-xs text-[#77736D]">Thử vận may, hôm nay ăn gì nhỉ!</p>

        <div className="relative mx-auto mb-5 h-56 w-56">
          {/* Kim chỉ */}
          <div
            className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "11px solid transparent",
              borderRight: "11px solid transparent",
              borderTop: "20px solid #184B3A",
            }}
            aria-hidden="true"
          />
          {/* Bánh xe */}
          <div
            className="relative h-full w-full overflow-hidden rounded-full border-4 border-amber-300 shadow-md"
            style={{
              background: WHEEL_BG,
              transform: `rotate(${deg}deg)`,
              transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.15, 0.7, 0.1, 1)` : "none",
            }}
            aria-hidden="true"
          >
            {RECIPES.map((r, i) => (
              <div
                key={r.id}
                className="absolute inset-0 flex justify-center"
                style={{ transform: `rotate(${i * SEG + SEG / 2}deg)` }}
              >
                <span className="mt-5 text-3xl">{r.emoji}</span>
              </div>
            ))}
          </div>
          {/* Nút giữa (không xoay) */}
          <div className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-orange-200 bg-white text-center text-[11px] font-black leading-tight text-stone-800">
            Quay
            <br />
            ngay
          </div>
        </div>

        <div aria-live="polite" className="min-h-[76px]">
          {chosen && (
            <div className="mb-4 rounded-2xl border border-[#FDE3B3] bg-[#FFF8ED] p-3 text-left">
              <p className="mb-0.5 text-[11px] font-bold uppercase text-[#E86B1F]">🎉 Hôm nay ăn:</p>
              <p className="text-sm font-bold text-[#202B24]">{chosen.title}</p>
              <p className="mt-0.5 text-xs text-[#77736D]">
                {vnd(chosen.cost)} · {chosen.time} phút · {chosen.kcal} kcal
              </p>
              <Link
                href={`/recipes/${chosen.id}`}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#184B3A] hover:underline"
              >
                Xem công thức <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          autoFocus
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F4A340] py-2.5 text-sm font-black text-white shadow-md transition-all hover:bg-[#ea932e] disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`} />
          {spinning ? "Đang quay..." : "QUAY NGAY!"}
        </button>
      </div>
    </div>
  );
}

/* ─── Trang chủ ───────────────────────────────────────── */
export default function HomePage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [streak, setStreak] = useState(5); // TODO: đọc từ API (bảng streaks)
  const [eaten, setEaten] = useState(false);
  const [wheelOpen, setWheelOpen] = useState(false);
  const [favs, setFavs] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Đồng bộ chiều cao banner "Hôm nay ăn gì?" để bằng chính xác card "Thành tích của bạn"
  const achievementCardRef = useRef<HTMLDivElement>(null);
  const [achievementHeight, setAchievementHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = achievementCardRef.current;
    if (!el) return;

    const updateHeight = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) setAchievementHeight(h);
    };

    updateHeight();

    const ro = new ResizeObserver(() => {
      updateHeight();
    });
    ro.observe(el);

    return () => ro.disconnect();
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

  const toggleFav = (id: string) => setFavs((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleMarkEaten = () => {
    if (eaten) return;
    // TODO: gọi POST /meals rồi lấy streak mới từ server
    setEaten(true);
    setStreak((s) => s + 1);
    fireConfetti(70);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
          <ChibiChefMascot />
        </div>
      </aside>

      {/* ─── CỘT NỘI DUNG ─── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <form onSubmit={handleSearch} className="relative max-w-xl flex-1" role="search">
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77736D]"
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
              aria-label="Thông báo, 3 chưa đọc"
              className="relative rounded-full border border-[#EEE7DF] bg-[#FFFDF9] p-2.5 shadow-sm transition-colors hover:bg-[#FAF4ED]"
            >
              <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#EEE7DF] bg-[#FFFDF9] py-1 pl-1 pr-3 shadow-sm transition-colors hover:bg-[#FAF4ED]"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#184B3A] text-xs font-bold text-white"
                aria-hidden="true"
              >
                NA
              </span>
              <span className="hidden text-[13px] font-semibold sm:inline">Nguyễn Minh Anh</span>
              <ChevronDown className="h-4 w-4 text-[#77736D]" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Menu cho màn hình nhỏ (thay sidebar) */}
        <nav
          className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden"
          aria-label="Điều hướng chính"
        >
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
        <main className="flex flex-1 flex-col gap-4 px-4 pb-6 lg:flex-row lg:px-6">
          {/* ═════ CỘT CHÍNH ═════ */}
          <section className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Hero */}
            <div
              style={achievementHeight ? { height: `${achievementHeight}px` } : undefined}
              className="relative h-[252px] shrink-0 overflow-hidden rounded-3xl border border-[#EEE7DF] bg-gradient-to-r from-[#FFFBF5] via-[#FAF3E8] to-[#F2E7D3] shadow-sm"
            >
              <div className="relative z-10 flex h-full max-w-[340px] flex-col justify-center p-6 sm:p-8">
                <h2 className="text-3xl font-black leading-tight text-[#184B3A] 2xl:text-[44px]">
                  Hôm nay
                </h2>
                <div className="relative inline-block">
                  <span
                    className="absolute -top-3 left-2 select-none text-xs font-black tracking-widest text-[#E86B1F]"
                    aria-hidden="true"
                  >
                    ///
                  </span>
                  <span className="text-4xl font-black leading-tight tracking-tight text-[#E86B1F] 2xl:text-[50px]">
                    ăn gì nhỉ?
                  </span>
                </div>
                <p className="mt-3 text-[13px] font-medium leading-snug text-[#5f5b55]">
                  BếpSV giúp bạn tìm món ngon,
                  <br />
                  tiết kiệm và đủ chất chỉ trong vài giây!
                </p>
                <Link
                  href="/recipes"
                  className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#184B3A] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-[#12392c] active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Tìm món ngay
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="absolute right-0 top-0 hidden h-full w-[55%] sm:block">
                <FoodImage
                  src={HERO_IMG}
                  alt="Đĩa cơm trứng và rau"
                  emoji="🍳"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#FAF3E8] via-[#FAF3E8]/80 to-transparent" />
                <span className="absolute right-5 top-4 -rotate-3 rounded-full border border-orange-200 bg-white/95 px-3.5 py-1 text-[13px] font-bold italic text-[#202B24] shadow-sm backdrop-blur-sm">
                  Ngon - Bổ - Rẻ ♡
                </span>
              </div>
            </div>

            {/* 3 lối tắt */}
            <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3">
              {SHORTCUTS.map(({ href, title, sub, Icon3D }) => (
                <Link
                  key={title}
                  href={href}
                  className="group flex items-center gap-3 rounded-2xl border border-[#EEE7DF] bg-[#FFFDF9] p-3.5 shadow-sm transition-all hover:border-[#ded5cb] hover:shadow-md"
                >
                  <Icon3D />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold">{title}</span>
                    <span className="block truncate text-[11px] text-[#77736D]">{sub}</span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-[#E86B1F] transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>

            {/* Gợi ý món */}
            <div className="shrink-0">
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[15px] font-black">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100"
                    aria-hidden="true"
                  >
                    <ChefHat className="h-3.5 w-3.5 text-[#E86B1F]" />
                  </span>
                  Gợi ý món ăn phù hợp
                </h3>
                <Link
                  href="/recipes"
                  className="flex items-center gap-1 text-xs font-semibold text-[#77736D] transition-colors hover:text-[#202B24]"
                >
                  Xem tất cả <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {RECIPES.map((recipe) => (
                  <article
                    key={recipe.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#EEE7DF] bg-[#FFFDF9] shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-[120px] w-full shrink-0 overflow-hidden">
                      <FoodImage
                        src={recipe.img}
                        alt={recipe.title}
                        emoji={recipe.emoji}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => toggleFav(recipe.id)}
                        aria-pressed={!!favs[recipe.id]}
                        aria-label={
                          favs[recipe.id]
                            ? `Bỏ yêu thích ${recipe.title}`
                            : `Yêu thích ${recipe.title}`
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favs[recipe.id] ? "fill-red-500 text-red-500" : "text-stone-400"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col p-3">
                      <h4 className="mb-1.5 truncate text-[13px] font-bold">{recipe.title}</h4>

                      <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
                        <span className="flex items-center gap-1 font-bold text-[#C86218]">
                          <Tag className="h-3 w-3" aria-hidden="true" />
                          {vnd(recipe.cost)}
                        </span>
                        <span className="flex items-center gap-1 text-[#77736D]">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {recipe.time} phút
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#77736D]">
                        <span className="flex items-center gap-1 font-medium text-[#E86B1F]">
                          <Flame className="h-3 w-3" aria-hidden="true" />
                          {recipe.kcal} kcal
                        </span>
                        <span className="flex items-center gap-1">
                          <Beef className="h-3 w-3" aria-hidden="true" />
                          {recipe.protein}g đạm
                        </span>
                      </div>

                      <div className="mt-auto pt-3">
                        <Link
                          href={`/recipes/${recipe.id}`}
                          className="flex w-full items-center justify-center gap-1 rounded-full bg-[#184B3A] py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#12392c]"
                        >
                          Xem công thức <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ═════ CỘT PHẢI ═════ */}
          <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[320px] 2xl:w-[385px]">
            {/* Thành tích */}
            <div
              ref={achievementCardRef}
              className="shrink-0 rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-black">Thành tích của bạn</h3>
                <Link
                  href="/history"
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#77736D] transition-colors hover:text-[#202B24]"
                >
                  Xem chi tiết <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-[#F0E9DF] bg-[#FAF5EE] p-3 text-center">
                  <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                    <Flame className="h-5 w-5 fill-amber-500 text-amber-500" aria-hidden="true" />
                  </div>
                  <p className="text-lg font-black leading-tight">{streak} ngày</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-[#77736D]">
                    Ăn đủ bữa liên tiếp
                  </p>
                </div>
                <div className="rounded-2xl border border-[#F0E9DF] bg-[#FAF5EE] p-3 text-center">
                  <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <Wallet className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  </div>
                  <p className="text-lg font-black leading-tight">98.000đ</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-[#77736D]">
                    Chi tiêu tuần này
                  </p>
                </div>
              </div>

              <p className="mb-1.5 text-xs font-semibold">Cùng cố gắng hơn nhé!</p>
              <div className="flex items-end gap-1">
                <div
                  className="mb-1 h-2.5 flex-1 overflow-hidden rounded-full bg-[#EDE6DC]"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={7}
                  aria-valuenow={Math.min(streak, 7)}
                  aria-label="Tiến độ chuỗi ngày ăn đủ bữa"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#184B3A] transition-all duration-500"
                    style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }}
                  />
                </div>
                <PeekingCat />
              </div>
              <p className="text-[11px] text-[#77736D]">{Math.min(streak, 7)} / 7 ngày</p>
            </div>

            {/* Danh sách đi chợ (thẻ thứ 4, nằm ở cột phải như mockup) */}
            <Link
              href="/shopping"
              className="group flex shrink-0 items-center gap-3 rounded-2xl border border-[#EEE7DF] bg-[#FFFDF9] p-3.5 shadow-sm transition-all hover:border-[#ded5cb] hover:shadow-md"
            >
              <Checklist3DIcon />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-bold">Danh sách đi chợ</span>
                <span className="block truncate text-[11px] text-[#77736D]">
                  Đủ nguyên liệu, không lo thiếu
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-[#E86B1F] transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>

            {/* Nhắc nhở */}
            <div className="shrink-0 rounded-3xl border border-[#FDE3B3] bg-gradient-to-br from-[#FFF9ED] via-[#FFF5E3] to-[#FFEECB] p-4 shadow-sm">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-black">
                <AlarmClock className="h-4 w-4 text-[#E86B1F]" aria-hidden="true" />
                Hôm nay có nhắc nhở!
              </h3>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-bold">12:00 • Bữa trưa</p>
                  <p className="mt-0.5 text-xs font-medium text-[#77736D]">Đừng bỏ bữa nhé! 🍅</p>
                  <button
                    type="button"
                    onClick={handleMarkEaten}
                    disabled={eaten}
                    className={`mt-3 flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all ${
                      eaten
                        ? "cursor-default bg-emerald-600"
                        : "bg-[#F97316] hover:scale-105 hover:bg-[#EA580C] active:scale-95"
                    }`}
                  >
                    {eaten ? "✓ Đã ghi nhận!" : "✓ Đã ăn rồi"}
                  </button>
                </div>
                <GoldenBell />
              </div>
            </div>

            {/* Vòng quay (chiếm phần cao còn lại để cân với cột chính) */}
            <button
              type="button"
              onClick={() => setWheelOpen(true)}
              aria-label="Mở vòng quay may mắn"
              className="group flex min-h-[170px] flex-1 flex-col rounded-3xl border border-[#FEDCB0] bg-gradient-to-br from-[#FFF6ED] via-[#FFEED5] to-[#FEDCB0] p-4 text-left shadow-sm transition-all hover:shadow-md"
            >
              <span className="block text-sm font-black">Vòng quay may mắn</span>
              <span className="block text-xs text-[#77736D]">Thử vận may, chọn món bất kỳ!</span>
              <span className="mt-auto flex items-end justify-between pt-2">
                <GiftBoxes />
                <span className="transition-transform duration-500 group-hover:rotate-12">
                  <WheelGraphic />
                </span>
              </span>
            </button>
          </aside>
        </main>
      </div>

      <LuckyWheelModal open={wheelOpen} onClose={() => setWheelOpen(false)} />
    </div>
  );
}
