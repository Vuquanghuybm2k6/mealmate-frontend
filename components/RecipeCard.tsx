"use client";

import React, { useState } from "react";
import { Recipe } from "../lib/mockData";
import { formatVND } from "../lib/utils";
import { Clock, ChefHat, Heart, Sparkles, Check, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface RecipeCardProps {
  recipe: Recipe;
  matchScore?: number;
  missingIngredients?: string[];
  onSelectRecipe?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  matchScore,
  missingIngredients,
  onSelectRecipe,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCooked, setIsCooked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const imageUrl = recipe.imageUrl || recipe.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
  const cost = recipe.costEstimate ?? recipe.cost_estimate ?? 20000;
  const cookMinutes = recipe.cookMinutes ?? recipe.cook_minutes ?? 15;
  const isHealthy = recipe.isHealthy ?? recipe.is_healthy ?? false;
  const tools = recipe.tools || ["Nồi / Chảo"];
  const tags = recipe.tags || ["Nấu nhanh", "Sinh viên"];

  const handleCook = () => {
    setIsCooked(true);
    onSelectRecipe?.(recipe);
    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1">
      {/* Recipe Image & Top Overlays */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm z-10"
          aria-label="Yêu thích"
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Cost Badge */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md border border-orange-100 flex items-baseline gap-1">
          <span className="text-xs text-stone-500 font-medium">Khoảng</span>
          <span className="text-base font-black text-orange-600 tracking-tight">
            {formatVND(cost)}
          </span>
        </div>

        {/* Cook Time Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{cookMinutes} phút</span>
        </div>

        {/* Healthy Badge */}
        {isHealthy && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Healthy</span>
          </div>
        )}

        {/* Fridge Match Score if available */}
        {typeof matchScore === "number" && (
          <div className="absolute top-12 left-3 px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-xs">
            Khớp {matchScore}% tủ lạnh
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-medium"
              >
                #{tag}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 text-[11px] font-medium">
              🍳 {tools.join(", ")}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-900 text-lg leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>

          {/* Nutrition Info Bar (Calo, Đạm, Tinh bột, Béo) */}
          <div className="mt-3.5 grid grid-cols-4 gap-1.5 p-2.5 rounded-2xl bg-stone-50 border border-stone-200/60 text-center">
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Calo</div>
              <div className="text-xs font-bold text-stone-800">{recipe.kcal} kcal</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Đạm</div>
              <div className="text-xs font-bold text-emerald-600">{recipe.protein}g</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Carbs</div>
              <div className="text-xs font-bold text-amber-700">{recipe.carbs}g</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Béo</div>
              <div className="text-xs font-bold text-stone-600">{recipe.fat}g</div>
            </div>
          </div>

          {/* Missing Ingredients warning if match score is present */}
          {missingIngredients && missingIngredients.length > 0 && (
            <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
              <span className="font-semibold">Thiếu:</span> {missingIngredients.join(", ")}
            </div>
          )}

          {/* Expandable recipe quick steps */}
          {showDetails && recipe.ingredients && recipe.steps && (
            <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-600 space-y-2 animate-in fade-in">
              <div className="font-bold text-stone-800 flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-orange-500" />
                <span>Nguyên liệu chính:</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-stone-600">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>
                    {ing.name} ({ing.quantity})
                  </li>
                ))}
              </ul>

              <div className="font-bold text-stone-800 mt-2">Các bước nấu nhanh:</div>
              <ol className="list-decimal pl-4 space-y-1 text-stone-600">
                {recipe.steps.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          {recipe.steps ? (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-0.5 py-1.5"
            >
              <span>{showDetails ? "Thu gọn" : "Xem bước nấu"}</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="text-xs text-stone-400">Công thức siêu tốc</span>
          )}

          <button
            onClick={handleCook}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isCooked
                ? "bg-emerald-600 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white hover:scale-102 active:scale-98"
            }`}
          >
            {isCooked ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã ghi nhận bữa!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nấu món này</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
