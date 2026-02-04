const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081";

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).error;
    } catch {
      // ignore
    }
    throw new Error(detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (username: string, password: string) =>
    request("/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  listCategories: () => request("/menu"),
  getCategory: (id: string) => request(`/categories/${id}`),
  createCategory: (payload: { name: string; description?: string; imageUrl?: string }) =>
    request("/admin/categories", { method: "POST", body: JSON.stringify(payload) }),
  createSubCategory: (categoryId: string, payload: { name: string; description?: string; imageUrl?: string }) =>
    request("/admin/subcategories", { method: "POST", body: JSON.stringify({ ...payload, categoryId }) }),
  // getSubCategory removed/deprecated in favor of tree view or derived state
  createItem: (
    categoryId: string,
    subCategoryId: string,
    payload: { name: string; description?: string; amount: number; imageUrl?: string; isVeg?: boolean; isPopular?: boolean },
  ) => request("/admin/items", { method: "POST", body: JSON.stringify({ ...payload, categoryId, subCategoryId }) }),
};
