"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Heart, Lightbulb, Sparkles, Utensils } from "lucide-react";

const TIPS = [
  {
    id: "tip-1",
    title: "Cách giữ rau củ tươi xanh suốt cả tuần",
    category: "Bảo quản",
    emoji: "🥬",
    readTime: "3 phút đọc",
    highlight: "Không rửa rau trước khi cho vào tủ lạnh!",
    content:
      "Rau củ sau khi mua về, hãy nhặt bỏ lá úa, dùng khăn giấy bọc quanh gốc và cho vào hộp kín hoặc túi zip có đục lỗ thông khí nhỏ. Độ ẩm đọng lại sau khi rửa là nguyên nhân hàng đầu khiến vi khuẩn làm thối nhũn rau chỉ sau 2-3 ngày.",
  },
  {
    id: "tip-2",
    title: "Đi chợ sinh viên 1 lần, nấu gọn cả tuần",
    category: "Tiết kiệm",
    emoji: "🛒",
    readTime: "4 phút đọc",
    highlight: "Nguyên tắc 3 nhóm: 1 Đạm chính + 2 Rau + 1 Gia vị đa năng",
    content:
      "Chọn mua các loại thịt có thể chia nhỏ cấp đông (ức gà, thịt heo xay). Rau nên chọn 1 loại ăn nhanh (cải ngọt, xà lách) và 1 loại để được lâu (bí đỏ, bắp cải, cà rốt). Sơ chế, ướp sẵn theo từng bữa vào tối Chủ nhật sẽ giúp bạn nấu bữa tối trong vòng chưa đầy 15 phút.",
  },
  {
    id: "tip-3",
    title: "Đủ đạm và năng lượng dưới 20.000đ/bữa",
    category: "Dinh dưỡng",
    emoji: "🍳",
    readTime: "2 phút đọc",
    highlight: "Đậu hũ, trứng gà và lạc (đậu phộng) là đạm vàng",
    content:
      "Một quả trứng gà (3.500đ) cung cấp khoảng 6g protein hoàn chỉnh, một miếng đậu hũ (4.000đ) cung cấp 8g protein thực vật. Kết hợp trứng chiên hành + canh đậu hũ cà chua vừa ngon miệng vừa đảm bảo chỉ số kcal và protein cho một buổi học căng thẳng.",
  },
  {
    id: "tip-4",
    title: "Uống đủ nước và giữ tỉnh táo mùa thi cử",
    category: "Sức khỏe",
    emoji: "🥛",
    readTime: "2 phút đọc",
    highlight: "Uống từng ngụm nhỏ, tránh lạm dụng nước tăng lực",
    content:
      "Uống 1.5 - 2 lít nước mỗi ngày giúp não bộ hoạt động tối ưu. Hãy để sẵn bình nước 1 lít ngay bàn học và đặt mục tiêu uống hết trước giờ trưa. Hạn chế uống cà phê sau 15:00 để không làm đảo lộn chu kỳ giấc ngủ sinh học.",
  },
];

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-[#F7F1EC] text-[#202B24] p-4 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-[#EEE7DF] hover:bg-[#FAF4ED] transition"
            aria-label="Quay lại lịch sử"
          >
            <ArrowLeft className="h-5 w-5 text-[#184B3A]" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#184B3A] sm:text-3xl">
              Mẹo hay nấu ăn & Sống khỏe
            </h1>
            <p className="text-xs text-[#77736D]">
              Bí kíp thực tế từ BếpSV giúp bạn ăn ngon, tiết kiệm và đủ chất mỗi ngày
            </p>
          </div>
        </div>

        {/* Tips list */}
        <div className="space-y-4">
          {TIPS.map((tip) => (
            <article
              key={tip.id}
              className="rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FAF5EE] text-3xl select-none" aria-hidden="true">
                    {tip.emoji}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#184B3A]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#184B3A]">
                        {tip.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#77736D]">
                        <Clock className="h-3 w-3" />
                        {tip.readTime}
                      </span>
                    </div>
                    <h2 className="mt-1 text-lg font-black text-[#202B24] sm:text-xl">
                      {tip.title}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[#FAF6F0] p-3.5 border border-[#F0E9DF]">
                <p className="text-xs font-bold text-[#E86B1F]">
                  💡 Điểm mấu chốt: <span className="font-semibold text-[#202B24]">{tip.highlight}</span>
                </p>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[#5f5b55]">
                {tip.content}
              </p>
            </article>
          ))}
        </div>

        {/* Footer callout */}
        <div className="rounded-3xl border border-[#DDEBDD] bg-gradient-to-r from-[#EEF4E2] to-[#E4EEDA] p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-[#184B3A] mb-2" />
          <h3 className="text-base font-black text-[#184B3A]">
            Bạn có mẹo nấu ăn hay muốn chia sẻ cùng cộng đồng BếpSV?
          </h3>
          <p className="mt-1 text-xs text-[#5f5b55] max-w-md mx-auto">
            Gợi ý món ăn và mẹo sinh viên của bạn sẽ giúp hàng ngàn bạn bè cùng phòng trọ bớt lo nghĩ &ldquo;Hôm nay ăn gì?&rdquo;.
          </p>
          <Link
            href="/recipes"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#184B3A] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#12392c] transition"
          >
            <Utensils className="h-4 w-4" />
            Khám phá kho công thức
          </Link>
        </div>
      </div>
    </div>
  );
}
