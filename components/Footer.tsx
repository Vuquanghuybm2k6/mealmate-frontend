"use client";

import React from "react";
import { UtensilsCrossed, Heart, Github, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 sm:py-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                Bếp<span className="text-orange-500">SV</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
              Dự án website hỗ trợ sinh viên quyết định bữa ăn trong vài giây, nấu nhanh dưới 20 phút, vừa túi tiền và hạn chế bỏ bữa.
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sản phẩm của sinh viên vì sinh viên Việt Nam</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Tính năng chính</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              <li><a href="#budget-filter" className="hover:text-orange-400 transition-colors">Bộ lọc ngân sách ví</a></li>
              <li><a href="#smart-fridge" className="hover:text-orange-400 transition-colors">Tủ lạnh thông minh (AI)</a></li>
              <li><a href="#healthy-recipes" className="hover:text-orange-400 transition-colors">Chế độ dinh dưỡng lành mạnh</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Chuỗi ngày ăn đủ bữa (Streak)</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Danh sách nguyên liệu cần mua</a></li>
            </ul>
          </div>

          {/* Tech & Info */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Công nghệ</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              <li>Next.js & TypeScript</li>
              <li>Tailwind CSS & shadcn/ui</li>
              <li>NestJS & PostgreSQL</li>
              <li>AI LLM Parsers</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 BếpSV (Student Meal Planner). Thiết kế theo đặc tả design.docx.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for hungry students.
          </p>
        </div>

      </div>
    </footer>
  );
};
