const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface FridgeItem {
  id: string;
  ingredientId: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  addedAt: string;
}

export interface FridgeSuggestion {
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
  matchScore: number;
  matchedIngredients: Array<{
    ingredientId: string;
    name: string;
    unit: string;
    requiredQuantity: number;
    availableQuantity: number;
    status: string;
  }>;
  missingIngredients: Array<{
    ingredientId: string;
    name: string;
    unit: string;
    requiredQuantity: number;
    availableQuantity: number;
    status: string;
  }>;
}

export async function fetchFridgeItems(): Promise<FridgeItem[]> {
  const res = await fetch(`${API_BASE}/fridge`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi máy chủ khi tải nguyên liệu trong tủ lạnh (${res.status})`);
  }

  return await res.json();
}

export async function fetchFridgeSuggestions(params?: {
  budget?: number;
  meal?: string;
}): Promise<FridgeSuggestion[]> {
  const query = new URLSearchParams();
  if (params?.budget && params.budget > 0) query.append('budget', params.budget.toString());
  if (params?.meal) query.append('meal', params.meal);

  const q = query.toString();
  const res = await fetch(`${API_BASE}/fridge/suggestions${q ? `?${q}` : ''}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi khi tải gợi ý món ăn từ tủ lạnh (${res.status})`);
  }

  return await res.json();
}

export async function addFridgeItem(item: {
  ingredientId?: string;
  name?: string;
  quantity: number;
  unit?: string;
}): Promise<FridgeItem> {
  const res = await fetch(`${API_BASE}/fridge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  if (!res.ok) {
    throw new Error(`Không thể thêm nguyên liệu vào tủ lạnh (${res.status})`);
  }

  return await res.json();
}

export async function removeFridgeItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/fridge/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Không thể xóa nguyên liệu (${res.status})`);
  }
}

export async function parseFridgeText(text: string): Promise<{
  items: Array<{ name: string; quantity: number; unit: string }>;
  unmatched: string[];
}> {
  const res = await fetch(`${API_BASE}/fridge/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Không thể nhận diện nguyên liệu (${res.status})`);
  }

  return await res.json();
}
