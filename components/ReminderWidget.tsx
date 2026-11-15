"use client";

import React, { useState } from "react";
import { Clock, Check } from "lucide-react";
import confetti from "canvas-confetti";

interface ReminderWidgetProps {
  onMarkEaten?: () => void;
}

export const ReminderWidget: React.FC<ReminderWidgetProps> = ({ onMarkEaten }) => {
  const [eaten, setEaten] = useState(false);

  const handleEaten = () => {
    setEaten(true);
    onMarkEaten?.();
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fff9eb] to-[#fff3d6] border border-amber-200/80 p-3.5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-amber-700">
          <Clock className="w-3 h-3" />
        </div>
        <h4 className="font-black text-stone-900 text-xs">Hôm nay có nhắc nhở!</h4>
      </div>

      <div className="flex items-center justify-between">
        {/* Left message & CTA */}
        <div>
          <p className="text-[11px] font-bold text-stone-800">
            12:00 • Bữa trưa
          </p>
          <p className="text-[10px] text-stone-600 mt-0.5">
            Đừng bỏ bữa nhé! 🍲
          </p>

          <button
            onClick={handleEaten}
            disabled={eaten}
            className={`mt-2 px-3.5 py-1.5 rounded-full font-bold text-[10px] flex items-center gap-1 transition-all shadow-2xs ${
              eaten
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-[#f97316] hover:bg-[#ea580c] text-white hover:scale-105 active:scale-95"
            }`}
          >
            {eaten ? (
              <>
                <Check className="w-3 h-3" />
                <span>Đã ghi nhận!</span>
              </>
            ) : (
              <>
                <span>Đã ăn rồi</span>
                <Check className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

        {/* Right Bell Graphic */}
        <div className="text-3xl sm:text-4xl select-none animate-bounce" style={{ animationDuration: "2.5s" }}>
          🔔
        </div>
      </div>
    </div>
  );
};
