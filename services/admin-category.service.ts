// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminTag {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category: { id: string; name: string };
  _count: { products: number };
  createdAt?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  tags: { id: string; name: string; slug: string }[];
  _count: { products: number };
  createdAt?: string;
}

// ─── Category service ─────────────────────────────────────────────────────────

/** GET /api/admin/category */
export const getAdminCategories = async (): Promise<{
  categories: AdminCategory[];
}> => {
  const res = await fetch("/api/admin/category", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch categories.");
  return data;
};

/** POST /api/admin/category */
export const createCategory = async (
  name: string,
): Promise<{ category: AdminCategory }> => {
  const res = await fetch("/api/admin/category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to create category.");
  return data;
};

/** PATCH /api/admin/category/[id] */
export const updateCategory = async (
  id: string,
  name: string,
): Promise<{ category: AdminCategory }> => {
  const res = await fetch(`/api/admin/category/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to update category.");
  return data;
};

/** DELETE /api/admin/category/[id] */
export const deleteCategory = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await fetch(`/api/admin/category/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to delete category.");
  return data;
};

// ─── Tag service ──────────────────────────────────────────────────────────────

/** GET /api/admin/tag */
export const getAdminTags = async (): Promise<{ tags: AdminTag[] }> => {
  const res = await fetch("/api/admin/tag", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch tags.");
  return data;
};

/** POST /api/admin/tag */
export const createTag = async (
  name: string,
  categoryId: string,
): Promise<{ tag: AdminTag }> => {
  const res = await fetch("/api/admin/tag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, categoryId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to create tag.");
  return data;
};

/** PATCH /api/admin/tag/[id] */
export const updateTag = async (
  id: string,
  payload: { name: string; categoryId?: string },
): Promise<{ tag: AdminTag }> => {
  const res = await fetch(`/api/admin/tag/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to update tag.");
  return data;
};

/** DELETE /api/admin/tag/[id] */
export const deleteTag = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/admin/tag/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to delete tag.");
  return data;
};
