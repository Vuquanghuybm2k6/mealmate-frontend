const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  tier: string;
  stats: {
    saved: number;
    orders: number;
    rating: number;
    likes: number;
  };
}

export interface UserOrder {
  id: string;
  date: string;
  items: string;
  total: number;
  status: string;
}

export interface SavedRecipe {
  id: string;
  title: string;
  meta: string;
  emoji: string;
}

export interface UserReview {
  id: string;
  recipeTitle: string;
  date: string;
  rating: number;
  comment: string;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi máy chủ khi tải hồ sơ (${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

export async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Không thể cập nhật hồ sơ (${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

export async function fetchUserOrders(): Promise<UserOrder[]> {
  const res = await fetch(`${API_BASE}/profile/orders`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi khi tải lịch sử đơn hàng (${res.status})`);
  }

  const json = await res.json();
  return json.data || [];
}

export async function fetchUserSavedRecipes(): Promise<SavedRecipe[]> {
  const res = await fetch(`${API_BASE}/profile/saved`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi khi tải danh sách đã lưu (${res.status})`);
  }

  const json = await res.json();
  return json.data || [];
}

export async function fetchUserReviews(): Promise<UserReview[]> {
  const res = await fetch(`${API_BASE}/profile/reviews`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi khi tải đánh giá của bạn (${res.status})`);
  }

  const json = await res.json();
  return json.data || [];
}
