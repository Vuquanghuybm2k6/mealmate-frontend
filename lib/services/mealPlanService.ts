const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Dish {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  meals: MealType[];
  recipeId?: string;
}

export interface MealPlanResponse {
  id?: string;
  userId: string;
  weekStart: string;
  budget: number;
  plan: Record<string, string>;
  totalCost: number;
}

export async function fetchMealPlanDishes(): Promise<Dish[]> {
  const res = await fetch(`${API_BASE}/meal-plans/dishes`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi máy chủ khi tải danh sách món ăn (${res.status})`);
  }

  return await res.json();
}

export async function fetchMealPlan(weekStart: string): Promise<MealPlanResponse> {
  const res = await fetch(`${API_BASE}/meal-plans?weekStart=${encodeURIComponent(weekStart)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi khi tải thực đơn tuần ${weekStart} (${res.status})`);
  }

  return await res.json();
}

export async function saveMealPlan(
  weekStart: string,
  budget: number,
  plan: Record<string, string>,
): Promise<MealPlanResponse> {
  const res = await fetch(`${API_BASE}/meal-plans/${encodeURIComponent(weekStart)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weekStart, budget, plan }),
  });

  if (!res.ok) {
    throw new Error(`Không thể lưu thực đơn (${res.status})`);
  }

  return await res.json();
}

export async function autoGenerateMealPlan(
  weekStart: string,
  budget: number,
  existingPlan?: Record<string, string>,
): Promise<MealPlanResponse> {
  const res = await fetch(`${API_BASE}/meal-plans/auto-generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weekStart, budget, existingPlan }),
  });

  if (!res.ok) {
    throw new Error(`Không thể tự động lên thực đơn (${res.status})`);
  }

  return await res.json();
}

export async function copyMealPlan(
  sourceWeekStart: string,
  targetWeekStart: string,
): Promise<MealPlanResponse> {
  const res = await fetch(`${API_BASE}/meal-plans/copy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceWeekStart, targetWeekStart }),
  });

  if (!res.ok) {
    throw new Error(`Không thể sao chép thực đơn (${res.status})`);
  }

  return await res.json();
}
