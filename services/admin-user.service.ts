// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "user" | "admin";
  banned: boolean;
  emailVerified: string | null;
  createdAt: string;
  updatedAt?: string;
  _count: {
    orders: number;
    reviews: number;
    likes: number;
    addresses?: number;
  };
  orders?: {
    id: string;
    amount_captured: number;
    status: string;
    deliveryStatus: string;
    createdAt: string;
  }[];
}

export interface UsersResponse {
  users: AdminUser[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export interface UserFilters {
  page?: number;
  search?: string;
  role?: string;
  banned?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** GET /api/admin/user */
export const getAdminUsers = async (
  filters: UserFilters = {},
): Promise<UsersResponse> => {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.search) params.set("search", filters.search);
  if (filters.role) params.set("role", filters.role);
  if (filters.banned) params.set("banned", filters.banned);

  const res = await fetch(`/api/admin/user?${params}`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch users.");
  return data;
};

/** GET /api/admin/user/[id] */
export const getAdminUser = async (
  id: string,
): Promise<{ user: AdminUser }> => {
  const res = await fetch(`/api/admin/user/${id}`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch user.");
  return data;
};

/** PATCH /api/admin/user/[id] */
export const updateAdminUser = async (
  id: string,
  payload: { role?: string; banned?: boolean },
): Promise<{ user: AdminUser }> => {
  const res = await fetch(`/api/admin/user/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to update user.");
  return data;
};

/** DELETE /api/admin/user/[id] */
export const deleteAdminUser = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await fetch(`/api/admin/user/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to delete user.");
  return data;
};
