// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  previousPrice: number | null;
  brand: string;
  stock: number | null;
  shipping: number | null;
  color: string[];
  images: { public_id: string; secure_url: string }[];
  categoryId: string;
  tagIds: string[];
  category: { id: string; name: string };
  _count: { reviews: number };
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: AdminProduct[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

export interface ProductPayload {
  title: string;
  description: string;
  price: number;
  previousPrice?: number | null;
  brand: string;
  stock?: number | null;
  shipping?: number | null;
  color?: string[];
  categoryId: string;
  tagIds?: string[];
  images?: { public_id: string; secure_url: string }[];
}

export interface ProductFilters {
  page?: number;
  search?: string;
  category?: string;
  brand?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** GET /api/admin/product */
export const getAdminProducts = async (
  filters: ProductFilters = {},
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.brand) params.set("brand", filters.brand);

  const res = await fetch(`/api/admin/product?${params}`, {
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch products.");
  return data;
};

/** POST /api/admin/product */
export const createProduct = async (
  payload: ProductPayload,
): Promise<{ product: AdminProduct }> => {
  const res = await fetch("/api/admin/product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to create product.");
  return data;
};

/** PATCH /api/admin/product/[id] */
export const updateProduct = async (
  id: string,
  payload: Partial<ProductPayload>,
): Promise<{ product: AdminProduct }> => {
  const res = await fetch(`/api/admin/product/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to update product.");
  return data;
};

/** DELETE /api/admin/product/[id] */
export const deleteProduct = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await fetch(`/api/admin/product/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to delete product.");
  return data;
};

/** POST /api/admin/upload/image */
export const uploadImage = async (
  base64: string,
): Promise<{ public_id: string; secure_url: string }> => {
  const res = await fetch("/api/admin/upload/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to upload image.");
  return data;
};

/** DELETE /api/admin/upload/image */
export const deleteImage = async (public_id: string): Promise<void> => {
  await fetch("/api/admin/upload/image", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id }),
  });
};
