const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export interface BackendRecipeSummary {
  id: string;
  title: string;
  imageUrl: string | null;
  cookMinutes: number;
  difficulty: string;
  tools: string[];
  servings: number;
  costEstimate: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  mealTypes: string[];
  dietTypes?: string[];
  spiceLevel?: number;
  isHealthy: boolean;
}

export interface BackendRecipeDetail extends BackendRecipeSummary {
  steps: string[];
  estimatedTotalCost: number;
  ingredients: {
    id: string;
    ingredientId: string;
    name: string;
    category: string;
    unit: string;
    quantity: number;
    isMain: boolean;
    grams: number;
    estimatedCost: number;
    nutrition: {
      kcal: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }[];
}

export interface BackendSuggestionView {
  recipe: BackendRecipeSummary;
  matchScore: number;
  matchedIngredients: {
    ingredientId: string;
    name: string;
    unit: string;
    requiredQuantity: number;
    availableQuantity: number;
    missingQuantity: number;
    isMain: boolean;
    status: "enough" | "not_enough" | "missing";
  }[];
  missingIngredients: {
    ingredientId: string;
    name: string;
    unit: string;
    requiredQuantity: number;
    availableQuantity: number;
    missingQuantity: number;
    isMain: boolean;
    status: "enough" | "not_enough" | "missing";
  }[];
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchRecipesFromBackend(params: {
  budget?: number;
  meal?: string;
  healthy?: boolean;
  maxTime?: number;
}): Promise<BackendRecipeSummary[] | null> {
  try {
    const query = new URLSearchParams();
    if (params.budget && params.budget > 0) query.append("budget", params.budget.toString());
    if (params.meal) query.append("meal", params.meal);
    if (typeof params.healthy === "boolean") query.append("healthy", params.healthy.toString());
    if (params.maxTime) query.append("maxTime", params.maxTime.toString());

    const res = await fetch(`${API_BASE}/recipes?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("Backend not available, using local data fallback:", err);
    return null;
  }
}

export async function fetchFridgeSuggestions(params: {
  budget?: number;
  meal?: string;
}): Promise<BackendSuggestionView[] | null> {
  try {
    const query = new URLSearchParams();
    if (params.budget && params.budget > 0) query.append("budget", params.budget.toString());
    if (params.meal) query.append("meal", params.meal);

    const res = await fetch(`${API_BASE}/fridge/suggestions?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function parseFreeTextFridge(text: string): Promise<string[] | null> {
  try {
    const res = await fetch(`${API_BASE}/fridge/parse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.items?.map((item: any) => item.name) || null;
  } catch {
    return null;
  }
}
