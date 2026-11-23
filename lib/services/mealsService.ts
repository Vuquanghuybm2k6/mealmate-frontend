const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface MealLogItem {
  id: string;
  recipeId: string | null;
  recipeTitle: string | null;
  imageUrl: string | null;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  eatenAt: string;
  cost: number;
  kcal: number;
}

export interface MealStatistics {
  from: string;
  to: string;
  days: number;
  totalMeals: number;
  totalCost: number;
  totalKcal: number;
  averageCostPerDay: number;
  averageKcalPerDay: number;
  missedMeals: number;
  mostEatenRecipe: {
    recipeId: string | null;
    title: string;
    count: number;
  } | null;
  byMealType: Array<{
    mealType: 'breakfast' | 'lunch' | 'dinner';
    count: number;
    cost: number;
    kcal: number;
  }>;
  daily: Array<{
    date: string;
    meals: number;
    mealTypes: string[];
    cost: number;
    kcal: number;
    complete: boolean;
  }>;
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastDate: string | null;
    activeToday: boolean;
  };
}

export async function fetchMealLogs(params?: {
  from?: string;
  to?: string;
  mealType?: string;
}): Promise<MealLogItem[]> {
  const query = new URLSearchParams();
  if (params?.from) query.append('from', params.from);
  if (params?.to) query.append('to', params.to);
  if (params?.mealType) query.append('mealType', params.mealType);

  const q = query.toString();
  const res = await fetch(`${API_BASE}/meals${q ? `?${q}` : ''}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi máy chủ khi tải lịch sử ăn uống (${res.status})`);
  }

  return await res.json();
}

export async function fetchMealStatistics(params?: {
  from?: string;
  to?: string;
}): Promise<MealStatistics> {
  const query = new URLSearchParams();
  if (params?.from) query.append('from', params.from);
  if (params?.to) query.append('to', params.to);

  const q = query.toString();
  const res = await fetch(`${API_BASE}/meals/statistics${q ? `?${q}` : ''}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi khi tải thống kê dinh dưỡng (${res.status})`);
  }

  return await res.json();
}

export async function logMeal(meal: {
  recipeId?: string;
  recipeTitle?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  cost?: number;
  kcal?: number;
  eatenAt?: string;
}): Promise<MealLogItem> {
  const res = await fetch(`${API_BASE}/meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meal),
  });

  if (!res.ok) {
    throw new Error(`Không thể ghi nhận bữa ăn (${res.status})`);
  }

  return await res.json();
}
