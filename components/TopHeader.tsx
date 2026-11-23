"use client";

import React from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

interface TopHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notificationCount?: number;
  userName?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  notificationCount = 3,
  userName = "Vũ Quang Huy",
}) => {
  return (
    <header className="flex items-center justify-between gap-4 mb-3.5 shrink-0">
      {/* Search Input Bar */}
      <div className="relative flex-1 max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm món ăn, nguyên liệu... (ví dụ: trứng, mì, rau muống)"
          className="w-full pl-9 pr-16 py-2 rounded-full bg-white border border-stone-200 shadow-2xs text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1.5 focus:ring-[#1f3f35] transition-all"
        />
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-stone-400 bg-stone-100 rounded border border-stone-200">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right User & Notification Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-full bg-white border border-stone-200 shadow-2xs hover:bg-stone-50 text-stone-600 transition-all"
          aria-label="Thông báo"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-white border border-stone-200 shadow-2xs cursor-pointer hover:bg-stone-50 transition-all select-none">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt={userName}
            className="w-7 h-7 rounded-full object-cover border border-stone-200"
          />
          <span className="text-xs font-bold text-stone-800 hidden md:inline">
            {userName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </div>
      </div>
    </header>
  );
};
