"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface LuckyWheelWidgetProps {
  onOpenWheel: () => void;
}

export const LuckyWheelWidget: React.FC<LuckyWheelWidgetProps> = ({ onOpenWheel }) => {
  return (
    <div
      onClick={onOpenWheel}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fff7ec] to-[#ffe9cb] border border-orange-200/80 p-3.5 shadow-2xs cursor-pointer hover:shadow-sm transition-all group hover:-translate-y-0.5 select-none flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        {/* Left Info & Gifts */}
        <div className="z-10">
          <div className="flex items-center gap-1 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#e65c00]" />
            <h4 className="font-black text-stone-900 text-xs">Vòng quay may mắn</h4>
          </div>
          <p className="text-[10px] text-stone-600 font-medium max-w-[120px]">
            Thử vận may, chọn món bất kỳ!
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-xl">
            <span>🎁</span>
            <span>✨</span>
          </div>
        </div>

        {/* Right Mini Wheel Graphic */}
        <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full border-3 border-amber-300 shadow-sm flex items-center justify-center bg-conic group-hover:rotate-45 transition-transform duration-700 shrink-0"
          style={{
            background: `conic-gradient(
              #f97316 0deg 60deg,
              #fbbf24 60deg 120deg,
              #22c55e 120deg 180deg,
              #38bdf8 180deg 240deg,
              #ec4899 240deg 300deg,
              #eab308 300deg 360deg
            )`,
          }}
        >
          {/* Wheel Center Button */}
          <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-orange-200 flex items-center justify-center text-center">
            <span className="text-[8px] font-black text-stone-800 leading-tight">
              Quay<br />ngay
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
