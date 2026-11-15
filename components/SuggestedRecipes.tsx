"use client";

import React, { useState } from "react";
import { ChefHat, Heart, Clock, ArrowRight, Tag, Flame, Wheat } from "lucide-react";
import { formatVND } from "../lib/utils";

export interface FeaturedRecipe {
  id: string;
  title: string;
  imageUrl: string;
  cost: number;
  cookTime: number;
  kcal: number;
  protein: number;
  steps?: string[];
  ingredients?: string[];
}

interface SuggestedRecipesProps {
  onSelectRecipe?: (recipe: FeaturedRecipe) => void;
}

export const FEATURED_RECIPES: FeaturedRecipe[] = [
  {
    id: "f-1",
    title: "Cơm trứng cà chua",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    cost: 12000,
    cookTime: 15,
    kcal: 420,
    protein: 18,
    ingredients: ["2 quả trứng gà", "2 quả cà chua", "1 bát cơm", "Hành lá, gia vị"],
    steps: [
      "Đánh tan trứng với chút nước mắm, xào vừa chín tới rồi để riêng.",
      "Cà chua thái múi cau xào nhuyễn tạo sốt.",
      "Đổ trứng vào đảo đều trong 1 phút, rắc hành lá và ăn cùng cơm nóng."
    ],
  },
  {
    id: "f-2",
    title: "Đậu phụ sốt cà chua",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    cost: 15000,
    cookTime: 18,
    kcal: 350,
    protein: 16,
    ingredients: ["2 bìa đậu phụ", "2 quả cà chua", "Hành lá", "Dầu ăn, gia vị"],
    steps: [
      "Cắt đậu phụ thành miếng vuông, rán vàng giòn 2 mặt.",
      "Phi thơm hành, xào cà chua thành sốt sền sệt.",
      "Cho đậu vào rim nhỏ lửa 5 phút cho thấm đẫm vị sốt."
    ],
  },
  {
    id: "f-3",
    title: "Mì xào trứng rau củ",
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80",
    cost: 14000,
    cookTime: 15,
    kcal: 360,
    protein: 16,
    ingredients: ["1 gói mì", "1 quả trứng gà", "1 nắm rau cải / bắp cải", "Gia vị"],
    steps: [
      "Chần mì và rau qua nước sôi rồi vớt ra để ráo.",
      "Ốp hoặc xào trứng tơi xốp trên chảo.",
      "Cho mì và rau vào đảo nhanh với trứng, nêm gia vị vừa miệng."
    ],
  },
  {
    id: "f-4",
    title: "Canh trứng rong biển",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80",
    cost: 8000,
    cookTime: 12,
    kcal: 120,
    protein: 10,
    ingredients: ["1 quả trứng gà", "Rong biển khô", "Gừng tươi", "Nước dùng, hạt nêm"],
    steps: [
      "Ngâm rong biển nở mềm trong 5 phút.",
      "Đun sôi 500ml nước với vài lát gừng và hạt nêm.",
      "Khuấy nhẹ trứng vào nồi tạo vân hoa đẹp mắt, thả rong biển sôi 1 phút là tắt bếp."
    ],
  },
];

export const SuggestedRecipes: React.FC<SuggestedRecipesProps> = ({ onSelectRecipe }) => {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedRecipeForModal, setSelectedRecipeForModal] = useState<FeaturedRecipe | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="flex flex-col justify-between">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <ChefHat className="w-4 h-4 text-[#e65c00]" />
          <h3 className="text-sm font-black text-stone-900 tracking-tight">
            Gợi ý món ăn phù hợp
          </h3>
        </div>
        <button className="text-[11px] font-bold text-stone-500 hover:text-[#1f3f35] flex items-center gap-0.5 transition-colors">
          <span>Xem tất cả</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {FEATURED_RECIPES.map((recipe) => {
          const isFav = favorites[recipe.id];

          return (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border border-stone-200 p-2.5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image & Heart icon */}
                <div className="relative h-20 sm:h-22 rounded-xl overflow-hidden bg-stone-100 mb-2">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => toggleFavorite(recipe.id, e)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-red-500 shadow-2xs transition-colors"
                  >
                    <Heart className={`w-3 h-3 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>

                {/* Title */}
                <h4 className="font-bold text-stone-900 text-xs truncate mb-1">
                  {recipe.title}
                </h4>

                {/* Badges: Price & Cook Time */}
                <div className="flex items-center justify-between text-[10px] text-stone-500 font-semibold mb-1">
                  <div className="flex items-center gap-0.5 text-[#e65c00] font-bold">
                    <Tag className="w-3 h-3" />
                    <span>{formatVND(recipe.cost)}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-stone-600">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{recipe.cookTime}p</span>
                  </div>
                </div>

                {/* Nutrition: Calories & Protein */}
                <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-0.5 text-amber-600">
                    <Flame className="w-3 h-3 fill-amber-500" />
                    <span>{recipe.kcal} kcal</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-stone-500">
                    <Wheat className="w-3 h-3" />
                    <span>{recipe.protein}g đạm</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedRecipeForModal(recipe);
                  onSelectRecipe?.(recipe);
                }}
                className="mt-2 w-full py-1.5 rounded-full bg-[#1f3f35] hover:bg-[#162e27] text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-all shadow-2xs"
              >
                <span>Xem công thức</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Recipe Quick Modal */}
      {selectedRecipeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative">
            <h3 className="text-lg font-black text-stone-900 mb-1">
              {selectedRecipeForModal.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-stone-600 mb-3">
              <span className="font-bold text-[#e65c00]">{formatVND(selectedRecipeForModal.cost)}</span>
              <span>•</span>
              <span>⏱️ {selectedRecipeForModal.cookTime} phút</span>
              <span>•</span>
              <span>🔥 {selectedRecipeForModal.kcal} kcal</span>
            </div>

            <h4 className="font-bold text-xs text-stone-800 mb-1">Nguyên liệu:</h4>
            <ul className="list-disc pl-4 text-xs text-stone-600 space-y-0.5 mb-3">
              {selectedRecipeForModal.ingredients?.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>

            <h4 className="font-bold text-xs text-stone-800 mb-1">Các bước nấu:</h4>
            <ol className="list-decimal pl-4 text-xs text-stone-600 space-y-1 mb-4">
              {selectedRecipeForModal.steps?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            <button
              onClick={() => setSelectedRecipeForModal(null)}
              className="w-full py-2 rounded-full bg-[#1f3f35] text-white font-bold text-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
