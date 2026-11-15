"use client";

import React from "react";
import { 
  Home, 
  Utensils, 
  Refrigerator, 
  ShoppingCart, 
  Clock, 
  User, 
  ChefHat 
} from "lucide-react";

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav }) => {
  const menuItems = [
    { id: "home", label: "Trang chủ", icon: Home },
    { id: "recipes", label: "Công thức", icon: Utensils },
    { id: "fridge", label: "Tủ lạnh thông minh", icon: Refrigerator },
    { id: "shopping", label: "Danh sách mua", icon: ShoppingCart },
    { id: "history", label: "Lịch sử ăn uống", icon: Clock },
    { id: "profile", label: "Hồ sơ cá nhân", icon: User },
  ];

  return (
    <aside className="w-56 xl:w-60 bg-[#1f3f35] text-white flex flex-col justify-between p-3.5 xl:p-4 h-screen shrink-0 select-none overflow-hidden border-r border-[#19332b]">
      <div className="flex flex-col">
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center pb-3.5 border-b border-[#2d5549]">
          <div className="relative mb-1.5">
            <div className="w-11 h-11 rounded-full bg-[#f6ba33]/20 flex items-center justify-center border-2 border-[#f6ba33]">
              <ChefHat className="w-6 h-6 text-[#f6ba33]" />
            </div>
            <span className="absolute -top-1 -right-1 text-[10px] text-[#f6ba33]">✨</span>
          </div>

          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-0.5">
            Bếp<span className="text-[#f6ba33]">SV</span>
          </h1>
          <p className="text-[10px] text-[#9bb8ad] font-medium leading-tight mt-0.5">
            Ăn ngon - Sống khỏe<br />Học tốt hơn!
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-3.5 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-bold text-xs transition-all text-left ${
                  isActive
                    ? "bg-[#d8e6dc] text-[#1f3f35] shadow-xs"
                    : "text-[#c2d7cd] hover:bg-[#284f43] hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#1f3f35]" : "text-[#9bb8ad]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Mascot Section */}
      <div className="pt-2.5 border-t border-[#2d5549] text-center flex flex-col items-center">
        <div className="relative mb-1">
          <div className="w-16 h-16 rounded-full bg-[#2a5144] flex items-center justify-center overflow-hidden border-2 border-[#3c6c5c] shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80"
              alt="BếpSV Mascot"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 text-base">🍳</span>
        </div>
        <p className="text-[10px] text-[#c2d7cd] italic font-medium leading-tight">
          “Ăn ngon mỗi ngày<br />cùng BếpSV nhé! ♡”
        </p>
      </div>
    </aside>
  );
};
