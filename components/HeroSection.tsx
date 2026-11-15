"use client";

import React, { useState } from "react";
import { 
  Wallet, 
  Sparkles, 
  Refrigerator, 
  Search, 
  SlidersHorizontal, 
  ArrowRight, 
  Check, 
  Zap,
  Flame,
  ShieldCheck
} from "lucide-react";
import { COMMON_INGREDIENTS } from "../lib/mockData";
import { formatVND } from "../lib/utils";

interface HeroSectionProps {
  budget: number;
  setBudget: (b: number) => void;
  selectedMeal: "breakfast" | "lunch" | "dinner";
  setSelectedMeal: (m: "breakfast" | "lunch" | "dinner") => void;
  isHealthyOnly: boolean;
  setIsHealthyOnly: (h: boolean) => void;
  selectedIngredients: string[];
  setSelectedIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  freeTextQuery: string;
  setFreeTextQuery: (q: string) => void;
  onOpenWheel: () => void;
  onSearch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  budget,
  setBudget,
  selectedMeal,
  setSelectedMeal,
  isHealthyOnly,
  setIsHealthyOnly,
  selectedIngredients,
  setSelectedIngredients,
  freeTextQuery,
  setFreeTextQuery,
  onOpenWheel,
  onSearch,
}) => {
  const [activeTab, setActiveTab] = useState<"budget" | "fridge">("budget");

  const quickBudgets = [15000, 25000, 35000, 50000];

  const toggleIngredient = (name: string) => {
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== name));
    } else {
      setSelectedIngredients([...selectedIngredients, name]);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-orange-50/60 via-amber-50/30 to-transparent">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-20 left-1/4 w-80 h-80 bg-orange-300/30 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs sm:text-sm font-bold mb-4 shadow-2xs animate-pulse-subtle">
            <Zap className="w-4 h-4 text-orange-600 fill-orange-500" />
            <span>Quyết định ăn gì trong 5 giây · Nấu dưới 20 phút</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.15]">
            Ví mỏng, giờ trưa gấp? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500">
              BếpSV
            </span>{" "}
            gợi ý chuẩn túi tiền!
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-600 font-medium max-w-2xl mx-auto">
            Nhập số tiền còn lại trong ví hoặc nguyên liệu sẵn có trong tủ lạnh. Hệ thống tự tính chi phí, calo và cân đo nguyên liệu thiếu giúp bạn.
          </p>
        </div>

        {/* Interactive Search Card */}
        <div className="mt-8 sm:mt-12 max-w-3xl mx-auto bg-white rounded-3xl sm:rounded-4xl shadow-xl shadow-stone-200/50 border border-orange-100 p-4 sm:p-7 relative transition-all">
          
          {/* Top Switcher Tabs */}
          <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-4 mb-5">
            <div className="flex items-center gap-2 p-1 bg-stone-100/90 rounded-2xl">
              <button
                onClick={() => setActiveTab("budget")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "budget"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Theo số tiền trong ví</span>
              </button>
              <button
                onClick={() => setActiveTab("fridge")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "fridge"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Refrigerator className="w-4 h-4" />
                <span>Tủ lạnh thông minh</span>
              </button>
            </div>

            {/* Lucky Wheel quick shortcut */}
            <button
              onClick={onOpenWheel}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-xs hover:shadow hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "5s" }} />
              <span>Quay chọn món</span>
            </button>
          </div>

          {/* TAB 1: Theo số tiền trong ví */}
          {activeTab === "budget" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Input budget & meal type */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                {/* Budget Input */}
                <div className="sm:col-span-7">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Số tiền trong ví hiện có:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step={5000}
                      value={budget || ""}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      placeholder="Ví dụ: 30000"
                      className="w-full pl-4 pr-16 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 font-black text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                      VNĐ
                    </span>
                  </div>
                </div>

                {/* Meal Type Selector */}
                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Bữa ăn dự định:
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-2xl">
                    {(
                      [
                        { id: "breakfast", label: "Sáng" },
                        { id: "lunch", label: "Trưa" },
                        { id: "dinner", label: "Tối" },
                      ] as const
                    ).map((meal) => (
                      <button
                        key={meal.id}
                        onClick={() => setSelectedMeal(meal.id)}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                          selectedMeal === meal.id
                            ? "bg-white text-orange-600 shadow-xs"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        {meal.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Budget Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">Gợi ý nhanh ví:</span>
                {quickBudgets.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBudget(amt)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      budget === amt
                        ? "bg-orange-500 text-white shadow-xs"
                        : "bg-stone-100 hover:bg-orange-50 hover:text-orange-600 text-stone-700"
                    }`}
                  >
                    {formatVND(amt)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Tủ lạnh thông minh */}
          {activeTab === "fridge" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nhập câu tự do (AI Tách nguyên liệu):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={freeTextQuery}
                    onChange={(e) => setFreeTextQuery(e.target.value)}
                    placeholder="Ví dụ: 'Nhà còn 2 quả trứng với ít hành và cà chua'..."
                    className="w-full pl-4 pr-12 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-700">
                      AI Tách
                    </span>
                  </div>
                </div>
              </div>

              {/* Chips select */}
              <div>
                <span className="text-xs text-stone-500 font-medium block mb-2">
                  Hoặc bấm chọn nhanh nguyên liệu bạn đang có:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {COMMON_INGREDIENTS.map((item) => {
                    const isSelected = selectedIngredients.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleIngredient(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                          isSelected
                            ? "bg-orange-500 text-white shadow-xs font-bold"
                            : "bg-stone-100 text-stone-700 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Bar: Healthy toggle + Search button */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Healthy toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer self-start sm:self-auto select-none">
              <input
                type="checkbox"
                checked={isHealthyOnly}
                onChange={(e) => setIsHealthyOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
              />
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Chế độ Lành Mạnh (≤600 kcal & ≥15g đạm)</span>
              </div>
            </label>

            {/* Submit Action */}
            <button
              onClick={onSearch}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Gợi ý món ăn ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
