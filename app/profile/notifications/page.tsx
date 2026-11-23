"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Check, Clock, Mail, ShieldAlert, Smartphone } from "lucide-react";

export default function NotificationsSettingPage() {
  const [settings, setSettings] = useState({
    breakfast: true,
    breakfastTime: "07:00",
    lunch: true,
    lunchTime: "11:30",
    dinner: true,
    dinnerTime: "18:30",
    fridgeExpiry: true,
    pushNotification: true,
    emailNotification: false,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F1EC] text-[#202B24] p-4 lg:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-[#EEE7DF] hover:bg-[#FAF4ED] transition"
            aria-label="Quay lại hồ sơ"
          >
            <ArrowLeft className="h-5 w-5 text-[#184B3A]" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#184B3A]">
              Thông báo & Lời nhắc
            </h1>
            <p className="text-xs text-[#77736D]">
              Cài đặt giờ nhắc ăn đúng bữa và cảnh báo hạn dùng thực phẩm
            </p>
          </div>
        </div>

        {/* Meal Reminders */}
        <div className="rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 shadow-sm space-y-5">
          <h2 className="text-base font-black text-[#184B3A] flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Nhắc nhở giờ ăn uống (Chống bỏ bữa)
          </h2>

          <div className="space-y-4 divide-y divide-[#F0E9DF]">
            {/* Breakfast */}
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <p className="text-sm font-bold text-[#202B24]">Bữa sáng</p>
                <p className="text-xs text-[#77736D]">Nhắc nấu hoặc ăn sáng trước khi lên giảng đường</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={settings.breakfastTime}
                  onChange={(e) => setSettings({ ...settings, breakfastTime: e.target.value })}
                  disabled={!settings.breakfast}
                  className="rounded-lg border border-[#EEE7DF] bg-white px-2 py-1 text-xs font-bold disabled:opacity-40"
                />
                <button
                  type="button"
                  onClick={() => toggle("breakfast")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.breakfast ? "bg-[#184B3A]" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.breakfast ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Lunch */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-sm font-bold text-[#202B24]">Bữa trưa</p>
                <p className="text-xs text-[#77736D]">Nhắc chuẩn bị hoặc nấu bữa trưa nạp năng lượng</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={settings.lunchTime}
                  onChange={(e) => setSettings({ ...settings, lunchTime: e.target.value })}
                  disabled={!settings.lunch}
                  className="rounded-lg border border-[#EEE7DF] bg-white px-2 py-1 text-xs font-bold disabled:opacity-40"
                />
                <button
                  type="button"
                  onClick={() => toggle("lunch")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.lunch ? "bg-[#184B3A]" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.lunch ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Dinner */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-sm font-bold text-[#202B24]">Bữa tối</p>
                <p className="text-xs text-[#77736D]">Gợi ý món nấu tối nhanh gọn sau một ngày học</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={settings.dinnerTime}
                  onChange={(e) => setSettings({ ...settings, dinnerTime: e.target.value })}
                  disabled={!settings.dinner}
                  className="rounded-lg border border-[#EEE7DF] bg-white px-2 py-1 text-xs font-bold disabled:opacity-40"
                />
                <button
                  type="button"
                  onClick={() => toggle("dinner")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.dinner ? "bg-[#184B3A]" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.dinner ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fridge & Expiry */}
        <div className="rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-[#184B3A] flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            Cảnh báo thực phẩm trong tủ
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#202B24]">Báo động thực phẩm sắp hết hạn</p>
              <p className="text-xs text-[#77736D]">
                Gửi thông báo khi nguyên liệu trong tủ chỉ còn dưới 2 ngày để kịp thời nấu
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggle("fridgeExpiry")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.fridgeExpiry ? "bg-[#184B3A]" : "bg-stone-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.fridgeExpiry ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Channels */}
        <div className="rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-[#184B3A] flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Kênh nhận thông báo
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 text-[#77736D]" />
                <span className="text-xs font-bold text-[#202B24]">Thông báo trình duyệt & Điện thoại (Push)</span>
              </div>
              <button
                type="button"
                onClick={() => toggle("pushNotification")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushNotification ? "bg-[#184B3A]" : "bg-stone-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushNotification ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#77736D]" />
                <span className="text-xs font-bold text-[#202B24]">Email tổng kết tuần</span>
              </div>
              <button
                type="button"
                onClick={() => toggle("emailNotification")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotification ? "bg-[#184B3A]" : "bg-stone-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotification ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <Link
            href="/profile"
            className="rounded-full border border-[#EEE7DF] bg-white px-5 py-2.5 text-xs font-bold text-[#5f5b55] hover:bg-[#FAF4ED]"
          >
            Hủy thay đổi
          </Link>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-full bg-[#184B3A] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#12392c]"
          >
            {saved ? <Check className="h-4 w-4" /> : null}
            {saved ? "Đã lưu cài đặt!" : "Lưu cài đặt thông báo"}
          </button>
        </div>
      </div>
    </div>
  );
}
