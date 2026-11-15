"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface HeroBannerProps {
  onFindDish: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onFindDish }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fff9f3] via-[#fff4ea] to-[#ffedd9] border border-orange-100 p-4 sm:p-5 flex items-center justify-between shadow-2xs h-full">
      {/* Decorative sticker callout */}
      <div className="absolute top-2.5 right-1/3 hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-orange-200/60 shadow-2xs rotate-[-3deg]">
        <span className="text-[11px] font-bold text-stone-800">Ngon - Bổ - Rẻ ♡</span>
      </div>

      {/* Left Text & Call to Action */}
      <div className="max-w-sm z-10 text-left">
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-stone-900 leading-[1.15] tracking-tight">
          Hôm nay <br />
          <span className="relative inline-block text-[#e65c00]">
            ăn gì nhỉ?
            <svg
              className="absolute -top-2.5 right-0 w-6 h-6 text-[#f59e0b]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </span>
        </h2>

        <p className="mt-1.5 text-xs text-stone-600 font-medium leading-normal">
          BếpSV giúp bạn tìm món ngon, tiết kiệm và đủ chất chỉ trong vài giây!
        </p>

        <button
          onClick={onFindDish}
          className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1f3f35] hover:bg-[#162e27] text-white font-bold text-xs shadow-xs hover:scale-102 active:scale-98 transition-all"
        >
          <span>🪄 Tìm món ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Dish Food Photo */}
      <div className="relative shrink-0 ml-3">
        <div className="w-48 h-32 sm:w-60 sm:h-36 lg:w-72 lg:h-40 rounded-2xl overflow-hidden shadow-md border-3 border-white">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
            alt="Cơm ngon sinh viên"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
