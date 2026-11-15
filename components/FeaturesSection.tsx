"use client";

import React from "react";
import { 
  Wallet, 
  Refrigerator, 
  Clock, 
  HeartPulse, 
  Flame, 
  ShoppingCart,
  Smile,
  ShieldCheck 
} from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Wallet className="w-6 h-6 text-orange-500" />,
      title: "Ăn Theo Số Tiền Trong Ví",
      description: "Nhập 15k, 25k hay 50k, hệ thống tự động lọc các món vừa vặn túi tiền, không lo cháy ví cuối tháng.",
      badge: "Tiết kiệm tối đa",
    },
    {
      icon: <Refrigerator className="w-6 h-6 text-sky-500" />,
      title: "Tủ Lạnh Thông Minh",
      description: "Tận dụng nguyên liệu còn sót lại trong phòng trọ. AI tách nguyên liệu từ câu nói tự do và tính % độ khớp.",
      badge: "Không lãng phí",
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      title: "Siêu Tốc Dưới 20 Phút",
      description: "Mọi công thức đều tinh giản tối đa, chỉ cần chảo, nồi hoặc nồi cơm điện nhỏ, không tốn thời gian dọn dẹp.",
      badge: "Nhanh gọn",
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-emerald-500" />,
      title: "Cân Đo Dinh Dưỡng",
      description: "Hiển thị rõ calo, đạm, tinh bột, chất béo. Chế độ Healthy đảm bảo dưới 600 kcal và từ 15g đạm trở lên.",
      badge: "Đủ chất",
    },
    {
      icon: <Flame className="w-6 h-6 text-red-500" />,
      title: "Chống Bỏ Bữa & Streak",
      description: "Nhắc giờ ăn trưa/tối đúng giờ. Ghi nhận chuỗi ngày ăn đúng bữa để bảo vệ dạ dày sinh viên.",
      badge: "Bảo vệ sức khoẻ",
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-purple-500" />,
      title: "Tự Tạo Danh Sách Mua",
      description: "Tự động so sánh món chọn với tủ lạnh để lập danh sách nguyên liệu cần mua thêm kèm đơn giá tham khảo.",
      badge: "Đi chợ nhàn tênh",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-stone-50/60 border-y border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-extrabold tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            Giải pháp trọn gói cho SV ở trọ
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Vì sao sinh viên mê mẩn BếpSV?
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Không còn cảnh 12 giờ trưa nhìn trần nhà tự hỏi &ldquo;Trưa nay ăn gì?&rdquo; hay cuối tháng ăn mì tôm úp nước lã.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/70 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-bold text-stone-900 text-lg group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-stone-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
