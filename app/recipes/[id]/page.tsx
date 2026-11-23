"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Beef,
  CalendarCheck,
  ChefHat,
  Clock,
  Flame,
  Heart,
  Home,
  Refrigerator,
  ShoppingCart,
  Sparkles,
  Tag,
  User,
  Utensils,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

interface RecipeDetail {
  id: string;
  title: string;
  imageUrl?: string;
  cookMinutes: number;
  difficulty: string;
  tools: string[];
  servings: number;
  costEstimate: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  steps: string[];
  ingredients: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category?: string;
  }[];
}

const ID_MAP: Record<string, string> = {
  r1: "recipe-com-trung-ca-chua",
  r2: "recipe-com-dau-hu-sot-ca",
  r3: "recipe-mi-xao-trung",
  r4: "recipe-canh-rau-muong-dau-hu",
};

const DEFAULT_STEPS = [
  "Sơ chế các nguyên liệu sạch sẽ, để ráo nước.",
  "Bắc chảo hoặc nồi lên bếp, làm nóng một chút dầu ăn.",
  "Cho nguyên liệu chính vào xào hoặc nấu lửa vừa trong khoảng 10-15 phút.",
  "Nêm nếm gia vị nước mắm, muối, hạt tiêu vừa ăn rồi tắt bếp và thưởng thức khi còn nóng.",
];

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || "recipe-com-trung-ca-chua";
  const mappedId = ID_MAP[rawId] || rawId;

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [cooked, setCooked] = useState(false);
  const [addedShopping, setAddedShopping] = useState(false);

  useEffect(() => {
    async function fetchRecipe() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/v1/recipes/${mappedId}`);
        if (res.ok) {
          const data = await res.json();
          setRecipe(data);
        } else {
          // Fallback to first recipe from list
          const listRes = await fetch("http://localhost:3000/api/v1/recipes");
          if (listRes.ok) {
            const list = await listRes.json();
            const found = list.find((r: any) => r.id === mappedId) || list[0];
            setRecipe({
              ...found,
              steps: DEFAULT_STEPS,
              ingredients: [
                { id: "i1", name: "Trứng gà", quantity: 2, unit: "quả" },
                { id: "i2", name: "Cà chua", quantity: 2, unit: "quả" },
                { id: "i3", name: "Hành lá", quantity: 1, unit: "nhánh" },
                { id: "i4", name: "Gia vị (mắm, muối, dầu ăn)", quantity: 1, unit: "phần" },
              ],
            });
          }
        }
      } catch (err) {
        console.error("Lỗi tải chi tiết món:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [mappedId]);

  const handleMarkCooked = async () => {
    if (cooked || !recipe) return;
    try {
      await fetch("http://localhost:3000/api/v1/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: recipe.id,
          mealType: "lunch",
          cost: Math.round(recipe.costEstimate || 15000),
          kcal: Math.round(recipe.kcal || 350),
        }),
      });
      setCooked(true);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch {}
    } catch (e) {
      setCooked(true);
    }
  };

  const handleAddToShopping = async () => {
    if (addedShopping || !recipe) return;
    try {
      for (const ing of (recipe.ingredients || []).slice(0, 3)) {
        await fetch("http://localhost:3000/api/v1/shopping/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: ing.name,
            quantity: `${ing.quantity} ${ing.unit}`,
            category: "Rau củ",
          }),
        });
      }
      setAddedShopping(true);
    } catch {
      setAddedShopping(true);
    }
  };

  const vnd = (n?: number) => new Intl.NumberFormat("vi-VN").format(n || 0) + "đ";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F1EC] text-[#202B24]">
        <div className="flex flex-col items-center gap-3">
          <ChefHat className="h-10 w-10 animate-bounce text-[#184B3A]" />
          <p className="text-sm font-bold text-[#77736D]">Đang tải công thức chuẩn sinh viên...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F1EC] p-4 text-center">
        <h2 className="text-xl font-bold">Không tìm thấy món ăn này!</h2>
        <Link href="/recipes" className="mt-4 rounded-full bg-[#184B3A] px-5 py-2 text-sm text-white">
          Quay lại kho công thức
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F1EC] font-sans text-[#202B24]">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[200px] shrink-0 flex-col justify-between border-r border-[#143d2f] bg-[#184B3A] px-3 py-5 lg:flex 2xl:w-[212px]">
        <div>
          <div className="flex flex-col items-center border-b border-[#235846] pb-4 text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#f4a340] bg-[#f4a340]/15 shadow-inner">
              <ChefHat className="h-7 w-7 text-[#f4a340]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Bếp<span className="text-[#F4A340]">SV</span>
            </h1>
            <p className="mt-0.5 text-[11px] font-medium leading-tight text-[#A3C4B6]">
              Ăn ngon - Sống khỏe
            </p>
          </div>

          <nav className="mt-4 space-y-1">
            <Link href="/" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#A3C4B6] hover:bg-[#205543] hover:text-white">
              <Home className="h-4 w-4" />
              <span>Trang chủ</span>
            </Link>
            <Link href="/recipes" className="flex items-center gap-2.5 rounded-xl bg-[#DDEBDD] px-3 py-2.5 text-[13px] font-bold text-[#184B3A]">
              <Utensils className="h-4 w-4" />
              <span>Công thức</span>
            </Link>
            <Link href="/fridge" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#A3C4B6] hover:bg-[#205543] hover:text-white">
              <Refrigerator className="h-4 w-4" />
              <span>Tủ lạnh thông minh</span>
            </Link>
            <Link href="/shopping" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#A3C4B6] hover:bg-[#205543] hover:text-white">
              <ShoppingCart className="h-4 w-4" />
              <span>Danh sách mua</span>
            </Link>
            <Link href="/history" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#A3C4B6] hover:bg-[#205543] hover:text-white">
              <Clock className="h-4 w-4" />
              <span>Lịch sử ăn uống</span>
            </Link>
            <Link href="/meal-plan" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#A3C4B6] hover:bg-[#205543] hover:text-white">
              <CalendarCheck className="h-4 w-4" />
              <span>Lên thực đơn</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#A3C4B6] hover:bg-[#205543] hover:text-white">
              <User className="h-4 w-4" />
              <span>Hồ sơ cá nhân</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header Breadcrumb */}
        <header className="flex items-center justify-between border-b border-[#EEE7DF] bg-[#FFFDF9] px-6 py-3.5">
          <div className="flex items-center gap-2 text-sm text-[#77736D]">
            <Link href="/" className="flex items-center gap-1 font-semibold hover:text-[#184B3A]">
              <ArrowLeft className="h-4 w-4" /> Trang chủ
            </Link>
            <span>/</span>
            <Link href="/recipes" className="font-semibold hover:text-[#184B3A]">
              Công thức
            </Link>
            <span>/</span>
            <span className="font-bold text-[#202B24]">{recipe.title}</span>
          </div>

          <button
            type="button"
            onClick={() => setFav(!fav)}
            className={`flex items-center gap-1.5 rounded-full border border-[#EEE7DF] px-3.5 py-1.5 text-xs font-bold transition-all ${
              fav ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-[#77736D] hover:bg-stone-50"
            }`}
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-red-500 text-red-500" : ""}`} />
            {fav ? "Đã lưu vào yêu thích" : "Lưu món"}
          </button>
        </header>

        {/* Recipe Body */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Hero Card */}
            <div className="overflow-hidden rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800">
                      ⚡ Dưới {recipe.cookMinutes} phút
                    </span>
                    <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-black text-amber-800">
                      🍳 Dễ làm
                    </span>
                    {recipe.tools?.map((tool, idx) => (
                      <span key={idx} className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                        {tool}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-2xl font-black text-[#184B3A] sm:text-3xl">
                    {recipe.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold">
                    <span className="flex items-center gap-1.5 font-bold text-[#E86B1F]">
                      <Tag className="h-4 w-4" />
                      {vnd(recipe.costEstimate)}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#77736D]">
                      <Clock className="h-4 w-4" />
                      {recipe.cookMinutes} phút chuẩn bị & nấu
                    </span>
                  </div>

                  {/* Call to Actions */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleMarkCooked}
                      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black text-white shadow-md transition-all ${
                        cooked
                          ? "bg-emerald-600 cursor-default"
                          : "bg-[#184B3A] hover:bg-[#12392c] hover:scale-105 active:scale-95"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {cooked ? "✓ Đã ghi vào lịch sử hôm nay!" : "Đã nấu món này (Ghi nhận)"}
                    </button>

                    <button
                      type="button"
                      onClick={handleAddToShopping}
                      className={`flex items-center gap-2 rounded-full border border-[#EEE7DF] px-4 py-2.5 text-xs font-bold transition-all ${
                        addedShopping
                          ? "bg-stone-100 text-stone-500"
                          : "bg-white text-[#202B24] hover:bg-stone-50"
                      }`}
                    >
                      <PlusCircle className="h-4 w-4 text-[#E86B1F]" />
                      {addedShopping ? "Đã thêm vào danh sách đi chợ" : "+ Thêm nguyên liệu cần mua"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Nutrition breakdown */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#EEE7DF] pt-6 sm:grid-cols-4">
                <div className="rounded-2xl border border-[#F0E9DF] bg-[#FAF5EE] p-3 text-center">
                  <p className="text-xs text-[#77736D]">Năng lượng</p>
                  <p className="mt-1 text-lg font-black text-[#E86B1F]">{Math.round(recipe.kcal || 0)} kcal</p>
                </div>
                <div className="rounded-2xl border border-[#F0E9DF] bg-[#FAF5EE] p-3 text-center">
                  <p className="text-xs text-[#77736D]">Chất đạm (Protein)</p>
                  <p className="mt-1 text-lg font-black text-emerald-700">{Math.round(recipe.protein || 0)}g</p>
                </div>
                <div className="rounded-2xl border border-[#F0E9DF] bg-[#FAF5EE] p-3 text-center">
                  <p className="text-xs text-[#77736D]">Tinh bột (Carbs)</p>
                  <p className="mt-1 text-lg font-black text-amber-700">{Math.round(recipe.carbs || 0)}g</p>
                </div>
                <div className="rounded-2xl border border-[#F0E9DF] bg-[#FAF5EE] p-3 text-center">
                  <p className="text-xs text-[#77736D]">Chất béo (Fat)</p>
                  <p className="mt-1 text-lg font-black text-stone-700">{Math.round(recipe.fat || 0)}g</p>
                </div>
              </div>
            </div>

            {/* Ingredients & Steps Columns */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Nguyên liệu */}
              <div className="rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 shadow-sm md:col-span-1">
                <h2 className="mb-4 flex items-center gap-2 text-base font-black text-[#184B3A]">
                  <ChefHat className="h-5 w-5 text-[#E86B1F]" />
                  Nguyên liệu cần có
                </h2>
                <ul className="space-y-3">
                  {(recipe.ingredients || []).map((ing, idx) => (
                    <li key={idx} className="flex items-center justify-between border-b border-stone-100 pb-2 text-xs">
                      <span className="font-bold text-[#202B24]">{ing.name}</span>
                      <span className="font-semibold text-[#77736D]">
                        {ing.quantity} {ing.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Các bước nấu */}
              <div className="rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 shadow-sm md:col-span-2">
                <h2 className="mb-4 flex items-center gap-2 text-base font-black text-[#184B3A]">
                  <Sparkles className="h-5 w-5 text-[#E86B1F]" />
                  Các bước thực hiện
                </h2>
                <div className="space-y-4">
                  {(recipe.steps || DEFAULT_STEPS).map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DDEBDD] text-xs font-black text-[#184B3A]">
                        {idx + 1}
                      </span>
                      <p className="pt-0.5 text-xs font-medium leading-relaxed text-[#403e3a]">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
