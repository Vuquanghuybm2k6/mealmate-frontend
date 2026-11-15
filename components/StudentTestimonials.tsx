"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

export const StudentTestimonials: React.FC = () => {
  const reviews = [
    {
      name: "Nguyễn Minh Đức",
      school: "Đại học Bách Khoa Hà Nội",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
      content:
        "Trước đây toàn 12h trưa mới ngồi lướt app giao hàng nửa tiếng rồi hết tiền. Giờ có BếpSV, nhập 25k là ra ngay món cơm thịt băm hoặc đậu sốt cà chua, nấu 15p là chén xong!",
      tag: "Tiết kiệm 800k/tháng",
    },
    {
      name: "Trần Thu Trang",
      school: "Đại học Kinh Tế Quốc Dân (NEU)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      content:
        "Tính năng Tủ Lạnh Thông Minh đỉnh chóp thật sự! Cuối tuần dọn phòng trọ còn 2 quả trứng với ít cà chua, hệ thống gợi ý đúng món ăn ngon lành không phải bỏ phí nguyên liệu.",
      tag: "Ăn sạch tủ lạnh",
    },
    {
      name: "Lê Hoàng Nam",
      school: "Đại học Quốc Gia TP.HCM",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      content:
        "Thích nhất quả Streak chống bỏ bữa với Vòng Quay May Mắn. Những hôm lười suy nghĩ cứ bấm quay một phát là ra món, ăn đủ bữa 14 ngày liền không bị đau bao tử nữa.",
      tag: "Streak 14 ngày",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            Cộng đồng sinh viên
          </span>
          <h2 className="mt-3 text-3xl font-black text-stone-900 tracking-tight">
            Tiếng lòng cư dân phòng trọ
          </h2>
          <p className="mt-2 text-stone-600 text-sm">
            Hơn 5.000 sinh viên đã tạm biệt câu hỏi kinh điển: &ldquo;Trưa nay ăn gì?&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 bg-orange-50/40 border border-orange-100 flex flex-col justify-between hover:bg-orange-50/70 transition-colors"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 leading-relaxed italic">
                  &ldquo;{r.content}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-orange-200/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{r.name}</h4>
                    <p className="text-[11px] text-stone-500">{r.school}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-orange-700 bg-white px-2 py-1 rounded-md shadow-2xs border border-orange-100">
                  {r.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
