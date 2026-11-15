"use client";

import React from "react";
import { ArrowRight, Wallet, Refrigerator, Zap, CalendarCheck } from "lucide-react";

interface QuickActionGridProps {
  onSelectAction: (actionId: string) => void;
  selectedAction?: string;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({
  onSelectAction,
  selectedAction = "fridge",
}) => {
  const actions = [
    {
      id: "budget",
      title: "Theo ngân sách",
      subtitle: "Bạn có bao nhiêu tiền?",
      icon: (
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
          <Wallet className="w-4 h-4" />
        </div>
      ),
    },
    {
      id: "fridge",
      title: "Tủ lạnh thông minh",
      subtitle: "Bạn đang có gì?",
      icon: (
        <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
          <Refrigerator className="w-4 h-4" />
        </div>
      ),
    },
    {
      id: "quick",
      title: "Món nhanh < 20 phút",
      subtitle: "Nấu nhanh, ăn ngon",
      icon: (
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <Zap className="w-4 h-4 fill-amber-500" />
        </div>
      ),
    },
    {
      id: "shopping",
      title: "Danh sách đi chợ",
      subtitle: "Đủ nguyên liệu, không lo thiếu",
      icon: (
        <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
          <CalendarCheck className="w-4 h-4" />
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {actions.map((act) => {
        const isSelected = selectedAction === act.id;

        return (
          <button
            key={act.id}
            onClick={() => onSelectAction(act.id)}
            className={`p-2.5 rounded-2xl text-left flex items-center justify-between border transition-all ${
              isSelected
                ? "bg-white border-sky-300 shadow-sm ring-1.5 ring-sky-100"
                : "bg-white border-stone-200 shadow-2xs hover:border-orange-200"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {act.icon}
              <div className="min-w-0">
                <h4 className="font-bold text-stone-900 text-xs truncate">{act.title}</h4>
                <p className="text-[10px] text-stone-500 truncate">{act.subtitle}</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-300 shrink-0 ml-1" />
          </button>
        );
      })}
    </div>
  );
};
