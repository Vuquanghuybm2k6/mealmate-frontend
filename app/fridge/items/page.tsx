"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import {
  FridgeItem,
  fetchFridgeItems,
  removeFridgeItem,
} from "@/lib/services/fridgeService";

const getCategoryEmoji = (name: string, category: string): string => {
  const lower = (name + " " + category).toLowerCase();
  if (lower.includes("trứng")) return "🥚";
  if (lower.includes("rau") || lower.includes("cải") || lower.includes("muống")) return "🥬";
  if (lower.includes("cà chua")) return "🍅";
  if (lower.includes("đậu") || lower.includes("hũ")) return "🧈";
  if (lower.includes("mì")) return "🍜";
  if (lower.includes("gạo") || lower.includes("cơm")) return "🍚";
  if (lower.includes("thịt") || lower.includes("heo") || lower.includes("bò")) return "🥩";
  if (lower.includes("gà")) return "🍗";
  if (lower.includes("cá") || lower.includes("tôm") || lower.includes("hải sản")) return "🐟";
  if (lower.includes("quả") || lower.includes("táo") || lower.includes("chuối")) return "🍎";
  if (category.toLowerCase().includes("đạm")) return "🥩";
  if (category.toLowerCase().includes("tinh bột")) return "🍚";
  return "🥗";
};

const calculateDaysLeft = (addedAt: string, category: string): number => {
  const addedDate = new Date(addedAt);
  const diffDays = Math.floor((Date.now() - addedDate.getTime()) / (1000 * 3600 * 24));
  let shelfLife = 7;
  const cat = category.toLowerCase();
  if (cat.includes("đạm") || cat.includes("thịt") || cat.includes("hải sản")) {
    shelfLife = 3;
  } else if (cat.includes("rau")) {
    shelfLife = 4;
  } else if (cat.includes("tinh bột") || cat.includes("gia vị")) {
    shelfLife = 14;
  }
  return Math.max(0, shelfLife - diffDays);
};

export default function FridgeItemsPage() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFridgeItems();
      setItems(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách nguyên liệu trong tủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Xóa "${name}" khỏi tủ lạnh?`)) return;
    try {
      setDeletingId(id);
      await removeFridgeItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`Đã xóa ${name} khỏi tủ lạnh!`);
    } catch (err: any) {
      alert(err.message || "Không thể xóa nguyên liệu");
    } finally {
      setDeletingId(null);
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return ["all", ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase().trim());
      const matchCat = selectedCat === "all" || item.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [items, search, selectedCat]);

  return (
    <div className="min-h-screen bg-[#F7F1EC] text-[#202B24] p-4 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/fridge"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-[#EEE7DF] hover:bg-[#FAF4ED] transition"
              aria-label="Quay lại tủ lạnh"
            >
              <ArrowLeft className="h-5 w-5 text-[#184B3A]" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-[#184B3A] sm:text-3xl">
                Chi tiết nguyên liệu trong tủ
              </h1>
              <p className="text-xs text-[#77736D]">
                Tổng cộng có {items.length} nguyên liệu đang được lưu trữ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/fridge"
              className="flex items-center gap-1.5 rounded-full bg-[#184B3A] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#12392c] transition"
            >
              <Plus className="h-4 w-4" />
              Thêm nguyên liệu mới
            </Link>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-4 shadow-sm border border-[#EEE7DF]">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#77736D]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm nguyên liệu..."
              className="w-full rounded-full border border-[#EEE7DF] bg-[#FAF6F0] py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  selectedCat === cat
                    ? "bg-[#184B3A] text-white"
                    : "bg-[#F7F1EC] text-[#5f5b55] hover:bg-[#EAE2D8]"
                }`}
              >
                {cat === "all" ? "Tất cả" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-white/70 animate-pulse border border-[#EEE7DF]" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-dashed border-red-300 bg-red-50/50 p-8 text-center">
            <p className="text-sm font-bold text-red-700 mb-3">{error}</p>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#184B3A] px-4 py-2 text-xs font-bold text-white shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Thử lại
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#DDD6CC] bg-white p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-[#9E9B97] mb-3 opacity-60" />
            <h3 className="text-base font-bold text-[#202B24]">Không tìm thấy nguyên liệu nào</h3>
            <p className="mt-1 text-xs text-[#77736D]">
              {search ? "Thử tìm kiếm với từ khóa khác" : "Tủ lạnh hiện chưa có nguyên liệu nào."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {filteredItems.map((item) => {
              const daysLeft = calculateDaysLeft(item.addedAt, item.category);
              const emoji = getCategoryEmoji(item.name, item.category);
              const isExpiringSoon = daysLeft <= 2;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#EEE7DF] bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FAF5EE] text-3xl select-none" aria-hidden="true">
                      {emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#202B24]">{item.name}</p>
                      <p className="text-xs font-semibold text-[#184B3A]">
                        {item.quantity} {item.unit}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#77736D]">
                        <Calendar className="h-3 w-3" />
                        <span
                          className={`font-semibold ${
                            isExpiringSoon ? "text-amber-600 font-bold" : "text-[#77736D]"
                          }`}
                        >
                          Hạn dùng: ~{daysLeft} ngày
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.name)}
                    disabled={deletingId === item.id}
                    title="Xóa nguyên liệu"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#184B3A] px-5 py-2.5 text-xs font-bold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
