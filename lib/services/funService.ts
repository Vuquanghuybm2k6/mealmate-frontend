const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface FunStreak {
  currentStreak: number;
  longestStreak: number;
  lastDate: string | null;
  activeToday: boolean;
}

export interface FunMessage {
  id: string;
  context: string;
  text: string;
  author: string;
}

export interface RandomRecipeResult {
  recipe: {
    id: string;
    title: string;
    imageUrl: string | null;
    cookMinutes: number;
    difficulty: string;
    costEstimate: number;
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    isHealthy: boolean;
  };
  funMessage: string;
  spinCount: number;
}

export async function fetchStreak(): Promise<FunStreak> {
  const res = await fetch(`${API_BASE}/fun/streak`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi máy chủ khi tải chuỗi ngày (${res.status})`);
  }

  return await res.json();
}

export async function fetchFunMessage(context?: string): Promise<FunMessage> {
  const query = context ? `?context=${encodeURIComponent(context)}` : '';
  const res = await fetch(`${API_BASE}/fun/message${query}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi khi tải thông điệp vui (${res.status})`);
  }

  return await res.json();
}

export async function fetchRandomRecipe(params?: {
  budget?: number;
  meal?: string;
}): Promise<RandomRecipeResult> {
  const query = new URLSearchParams();
  if (params?.budget) query.append('budget', params.budget.toString());
  if (params?.meal) query.append('meal', params.meal);

  const q = query.toString();
  const res = await fetch(`${API_BASE}/fun/random-recipe${q ? `?${q}` : ''}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi khi quay món ngẫu nhiên (${res.status})`);
  }

  return await res.json();
}
