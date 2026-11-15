"use client";

import React from "react";
import { ArrowRight, Flame, Wallet } from "lucide-react";

interface StatsWidgetProps {
  streakDays?: number;
  weeklySpend?: number;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  streakDays = 5,
  weeklySpend = 98000,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-3.5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-black text-stone-900 text-xs">Thành tích của bạn</h4>
        <button className="text-[10px] font-semibold text-stone-500 hover:text-[#1f3f35] flex items-center gap-0.5">
          <span>Xem chi tiết</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* 2 Stat Boxes */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* Box 1: Streak */}
        <div className="bg-[#fcfaf7] border border-stone-100 rounded-xl p-2 flex flex-col items-center text-center">
          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-1">
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
          </div>
          <span className="text-sm font-black text-stone-900">{streakDays} ngày</span>
          <span className="text-[9px] text-stone-500 font-medium">Ăn đủ bữa liên tiếp</span>
        </div>

        {/* Box 2: Weekly spend */}
        <div className="bg-[#fcfaf7] border border-stone-100 rounded-xl p-2 flex flex-col items-center text-center">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-1">
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-black text-stone-900">
            {new Intl.NumberFormat("vi-VN").format(weeklySpend)}đ
          </span>
          <span className="text-[9px] text-stone-500 font-medium">Chi tiêu tuần này</span>
        </div>
      </div>

      {/* Progress & Cat Mascot */}
      <div className="relative pt-1">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="font-semibold text-stone-600 text-[10px]">Cùng cố gắng hơn nhé!</span>
          <span className="font-bold text-stone-500 text-[10px]">{streakDays} / 7 ngày</span>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-[#1f3f35] rounded-full transition-all duration-500"
            style={{ width: `${(streakDays / 7) * 100}%` }}
          />
        </div>

        {/* Floating Cat Sticker */}
        <div className="flex justify-end -mt-1 pr-0.5">
          <span className="text-lg select-none" title="Meow!">🐱</span>
        </div>
      </div>
    </div>
  );
};
