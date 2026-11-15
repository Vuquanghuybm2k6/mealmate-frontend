"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Flame, Sparkles, X, Clock } from "lucide-react";
import confetti from "canvas-confetti";

interface StreakReminderBannerProps {
  currentMeal?: string;
  dueTime?: string;
  streakCount: number;
  onLoggedMeal: () => void;
}

export const StreakReminderBanner: React.FC<StreakReminderBannerProps> = ({
  currentMeal = "Bữa trưa",
  dueTime = "12:00",
  streakCount,
  onLoggedMeal,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [eaten, setEaten] = useState(false);

  if (dismissed) return null;

  const handleMarkEaten = () => {
    setEaten(true);
    onLoggedMeal();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.2 },
      });
    } catch {
      // fallback
    }
    setTimeout(() => {
      setDismissed(true);
    }, 4000);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          
          {/* Reminder message */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-xs">
              <Clock className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              {eaten ? (
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>Tuyệt vời! Đã ghi nhận bạn ăn {currentMeal}. Chuỗi streak tăng lên {streakCount + 1} ngày! 🎉</span>
                </div>
              ) : (
                <p className="font-medium text-white/95">
                  <span className="font-extrabold bg-white/20 px-2 py-0.5 rounded-md mr-1.5 inline-block text-xs uppercase tracking-wider">
                    Nhắc nhở {currentMeal} ({dueTime})
                  </span>
                  Đừng để bụng đói cồn cào! Nấu ngay một món dưới 20 phút để giữ chuỗi{" "}
                  <strong className="underline decoration-amber-200 font-bold">{streakCount} ngày ăn đúng giờ</strong> nhé!
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {!eaten && (
              <button
                onClick={handleMarkEaten}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs shadow-xs transition-all hover:scale-105 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tôi đã ăn rồi (+1 Streak)</span>
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
