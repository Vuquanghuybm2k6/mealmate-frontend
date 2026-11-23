const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface ShoppingItem {
  id: string;
  group: 'veg' | 'meat' | 'other' | string;
  name: string;
  emoji: string;
  qty: string;
  price: number;
  done: boolean;
}

export interface ShoppingList {
  id: string;
  totalCost: number;
  budget: number;
  plannedMeals: number;
  items: ShoppingItem[];
}

export interface RecentList {
  id: string;
  title: string;
  sub: string;
}

export async function fetchShoppingList(): Promise<ShoppingList> {
  const res = await fetch(`${API_BASE}/shopping`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi máy chủ khi tải danh sách mua (${res.status})`);
  }

  return await res.json();
}

export async function addShoppingItem(item: {
  name: string;
  group?: string;
  qty?: string;
  price?: number;
  emoji?: string;
}): Promise<ShoppingItem> {
  const res = await fetch(`${API_BASE}/shopping/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  if (!res.ok) {
    throw new Error(`Không thể thêm món vào danh sách (${res.status})`);
  }

  return await res.json();
}

export async function toggleShoppingItem(itemId: string): Promise<ShoppingItem> {
  const res = await fetch(`${API_BASE}/shopping/items/${itemId}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Không thể cập nhật trạng thái món (${res.status})`);
  }

  return await res.json();
}

export async function removeShoppingItem(itemId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/shopping/items/${itemId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Không thể xóa món khỏi danh sách (${res.status})`);
  }

  const json = await res.json();
  return json.success;
}

export async function fetchRecentShoppingLists(): Promise<RecentList[]> {
  const res = await fetch(`${API_BASE}/shopping/recent`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi khi tải lịch sử danh sách (${res.status})`);
  }

  return await res.json();
}
