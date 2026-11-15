"use client";

import React, { useState } from "react";
import { UtensilsCrossed, Flame, Bell, Sparkles, User, Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenWheel?: () => void;
  streakCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWheel, streakCount = 5 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors">
                    Bếp<span className="text-orange-600">SV</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                    Ký Túc Xá
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 hidden sm:inline -mt-1 font-medium">
                  Ăn ngon · Dưới 20p · Chuẩn ví SV
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <a
              href="#budget-filter"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:text-orange-600 hover:bg-orange-50/80 transition-colors"
            >
              Ăn theo ví
            </a>
            <a
              href="#smart-fridge"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:text-orange-600 hover:bg-orange-50/80 transition-colors"
            >
              Tủ lạnh thông minh
            </a>
            <button
              onClick={onOpenWheel}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-orange-600 hover:bg-orange-50 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: "6s" }} />
              Vòng quay món
            </button>
            <a
              href="#healthy-recipes"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:text-emerald-600 hover:bg-emerald-50/80 transition-colors"
            >
              Thực đơn lành mạnh
            </a>
          </nav>

          {/* User Status / Streaks / Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter Pill */}
            <div 
              title="Chuỗi ngày ăn đủ bữa không bỏ bữa!"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-bold shadow-xs cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{streakCount} ngày ăn ngoan</span>
            </div>

            {/* Meal Reminder alert badge */}
            <div 
              title="Nhắc nhở giờ ăn sắp tới"
              className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-orange-600 transition-colors cursor-pointer hidden sm:flex items-center justify-center"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-white"></span>
            </div>

            {/* Google Login / Avatar button */}
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0">
              <User className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">Hồ sơ & Google</span>
              <span className="sm:hidden">Đăng nhập</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200/60 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
            <a
              href="#budget-filter"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl font-medium text-stone-700 hover:bg-orange-50 hover:text-orange-600"
            >
              💰 Ăn theo ví tiền
            </a>
            <a
              href="#smart-fridge"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl font-medium text-stone-700 hover:bg-orange-50 hover:text-orange-600"
            >
              🧊 Tủ lạnh thông minh
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWheel?.();
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl font-medium text-orange-600 hover:bg-orange-50 flex items-center justify-between"
            >
              <span>🎡 Vòng quay hôm nay ăn gì</span>
              <Sparkles className="w-4 h-4" />
            </button>
            <a
              href="#healthy-recipes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl font-medium text-emerald-700 hover:bg-emerald-50"
            >
              🥗 Thực đơn lành mạnh
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
