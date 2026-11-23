const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface BackendRecipeSummary {
  id: string;
  title: string;
  imageUrl: string | null;
  cookMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tools: string[];
  servings: number;
  costEstimate: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  mealTypes: ('breakfast' | 'lunch' | 'dinner')[];
  dietTypes: ('omnivore' | 'vegetarian' | 'vegan')[];
  spiceLevel: number;
  isHealthy: boolean;
}

export interface UserProfileResponse {
  data: {
    name: string;
    email: string;
    phone?: string;
    birthday?: string;
    address?: string;
    tier?: string;
    stats?: {
      saved: number;
      orders: number;
      rating: number;
      likes: number;
    };
  };
}

export interface FavoriteIdsResponse {
  ids: string[];
  count: number;
}

export interface ToggleFavoriteResponse {
  isFavorited: boolean;
  count: number;
}

export interface RecipeQueryParams {
  budget?: number;
  meal?: 'breakfast' | 'lunch' | 'dinner';
  healthy?: boolean;
  maxTime?: number;
}

/**
 * Tải danh sách công thức nấu ăn từ Backend API
 */
export async function fetchRecipes(params?: RecipeQueryParams): Promise<BackendRecipeSummary[]> {
  const query = new URLSearchParams();
  if (params?.budget && params.budget > 0) query.append('budget', params.budget.toString());
  if (params?.meal) query.append('meal', params.meal);
  if (typeof params?.healthy === 'boolean') query.append('healthy', params.healthy.toString());
  if (params?.maxTime && params.maxTime > 0) query.append('maxTime', params.maxTime.toString());

  const queryString = query.toString();
  const url = `${API_BASE}/recipes${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi máy chủ khi tải danh sách công thức (${res.status})`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('Dữ liệu công thức trả về không hợp lệ');
  }

  return data;
}

/**
 * Tải thông tin người dùng từ Backend API
 */
export async function fetchUserProfile(): Promise<UserProfileResponse['data']> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi máy chủ khi tải thông tin người dùng (${res.status})`);
  }

  const json: UserProfileResponse = await res.json();
  return json.data;
}

/**
 * Tải danh sách ID các món ăn yêu thích của người dùng
 */
export async function fetchFavoriteIds(): Promise<FavoriteIdsResponse> {
  const res = await fetch(`${API_BASE}/recipes/favorites/ids`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    // Fallback thử /profile/saved nếu endpoint chưa sẵn sàng
    const savedRes = await fetch(`${API_BASE}/profile/saved`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (savedRes.ok) {
      const savedJson = await savedRes.json();
      const list = Array.isArray(savedJson.data) ? savedJson.data : [];
      return {
        ids: list.map((item: any) => item.id),
        count: list.length,
      };
    }
    throw new Error(`Lỗi máy chủ khi tải danh sách yêu thích (${res.status})`);
  }

  return await res.json();
}

/**
 * Đổi trạng thái yêu thích một công thức (toggle favorite)
 */
export async function toggleFavoriteRecipe(recipeId: string): Promise<ToggleFavoriteResponse> {
  const res = await fetch(`${API_BASE}/recipes/${recipeId}/favorite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Không thể cập nhật trạng thái yêu thích (${res.status})`);
  }

  return await res.json();
}
