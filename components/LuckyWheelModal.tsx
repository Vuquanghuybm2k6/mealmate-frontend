"use client";

import React, { useState } from "react";
import { Recipe, FUN_MESSAGES } from "../lib/mockData";
import { formatVND } from "../lib/utils";
import { X, Sparkles, RefreshCw, HeartHandshake } from "lucide-react";
import confetti from "canvas-confetti";

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  onSelectRecipe: (r: Recipe) => void;
}

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  recipes,
  onSelectRecipe,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [funQuote, setFunQuote] = useState<string>("");
  const [wheelRotation, setWheelRotation] = useState<number>(0);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning || recipes.length === 0) return;

    setSpinning(true);
    setSelectedRecipe(null);

    // Random turns: at least 5 turns + random segment
    const extraDegrees = Math.floor(Math.random() * 360) + 1800;
    const newRotation = wheelRotation + extraDegrees;
    setWheelRotation(newRotation);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      const chosen = recipes[randomIndex];
      setSelectedRecipe(chosen);

      // Choose a fun message
      const randomMsg = FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)];
      setFunQuote(randomMsg.text);

      setSpinning(false);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }, 2800);
  };

  const chosenImageUrl = selectedRecipe?.imageUrl || selectedRecipe?.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
  const chosenCost = selectedRecipe?.costEstimate ?? selectedRecipe?.cost_estimate ?? 20000;
  const chosenTime = selectedRecipe?.cookMinutes ?? selectedRecipe?.cook_minutes ?? 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border border-orange-100 overflow-hidden text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-orange-500 animate-spin" style={{ animationDuration: "4s" }} />
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Vòng Quay: Hôm Nay Ăn Gì?
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
          Trao quyền quyết định bữa ăn cho số phận sinh viên! Không cần vắt óc suy nghĩ nữa.
        </p>

        {/* Visual Wheel / Spinner Display */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Wheel Pointer */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-500 drop-shadow-md" />

          {/* Rotating Wheel graphic */}
          <div
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-8 border-orange-400 shadow-inner flex items-center justify-center transition-transform duration-[2800ms] ease-out bg-conic"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              background: `conic-gradient(
                #f97316 0deg 45deg,
                #fb923c 45deg 90deg,
                #f59e0b 90deg 135deg,
                #fbbf24 135deg 180deg,
                #10b981 180deg 225deg,
                #34d399 225deg 270deg,
                #ef4444 270deg 315deg,
                #f87171 315deg 360deg
              )`,
            }}
          >
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center font-black text-stone-800 text-xs text-center p-2 border-4 border-amber-100">
              {spinning ? "Đang quay..." : "BẾP SV 🍲"}
            </div>
          </div>
        </div>

        {/* Action Spin Button */}
        {!selectedRecipe && (
          <button
            onClick={handleSpin}
            disabled={spinning}
            className={`w-full py-3.5 rounded-2xl font-black text-white text-base shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all ${
              spinning
                ? "bg-stone-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:scale-102 active:scale-98"
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${spinning ? "animate-spin" : ""}`} />
            <span>{spinning ? "Đang triệu hồi món ngon..." : "QUAY NGAY BÂY GIỜ!"}</span>
          </button>
        )}

        {/* Result Area */}
        {selectedRecipe && !spinning && (
          <div className="mt-4 p-4 rounded-3xl bg-orange-50/80 border border-orange-200 text-left animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3">
              <img
                src={chosenImageUrl}
                alt={selectedRecipe.title}
                className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
                  Vũ trụ chọn cho bạn
                </span>
                <h4 className="font-bold text-stone-900 text-base truncate mt-0.5">
                  {selectedRecipe.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-stone-600 mt-1 font-medium">
                  <span className="text-orange-600 font-bold">
                    {formatVND(chosenCost)}
                  </span>
                  <span>⏱️ {chosenTime} phút</span>
                </div>
              </div>
            </div>

            {/* Fun Message Bubble */}
            {funQuote && (
              <div className="mt-3 p-2.5 rounded-xl bg-white border border-orange-200/60 text-xs text-orange-950 italic flex items-start gap-2">
                <HeartHandshake className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>&ldquo;{funQuote}&rdquo;</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleSpin}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 font-bold text-xs text-stone-700 transition-colors"
              >
                Quay món khác 🔄
              </button>
              <button
                onClick={() => {
                  onSelectRecipe(selectedRecipe);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Chốt món này luôn!</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
