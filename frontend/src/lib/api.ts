const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

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
  createCategory: (payload: FormData | { name: string; description?: string; imageUrl?: string }) =>
    request("/admin/categories", { method: "POST", body: payload instanceof FormData ? payload : JSON.stringify(payload) }),
  createSubCategory: (categoryId: string, payload: FormData | { name: string; description?: string; imageUrl?: string }) => {
    if (payload instanceof FormData) payload.append('categoryId', categoryId);
    return request("/admin/subcategories", { 
      method: "POST", 
      body: payload instanceof FormData ? payload : JSON.stringify({ ...payload, categoryId }) 
    });
  },
  // getSubCategory removed/deprecated in favor of tree view or derived state
  createItem: (
    categoryId: string,
    subCategoryId: string,
    payload: FormData | { name: string; description?: string; amount: number; imageUrl?: string; isVeg?: boolean; isPopular?: boolean },
  ) => {
    if (payload instanceof FormData) {
      payload.append('categoryId', categoryId);
      payload.append('subCategoryId', subCategoryId);
    }
    return request("/admin/items", { 
      method: "POST", 
      body: payload instanceof FormData ? payload : JSON.stringify({ ...payload, categoryId, subCategoryId }) 
    });
  },
};
