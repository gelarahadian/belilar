// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  revenue: {
    total: number;
    thisMonth: number;
    growth: number | null;
  };
  orders: {
    total: number;
    thisMonth: number;
    growth: number | null;
  };
  users: {
    total: number;
    thisMonth: number;
  };
  products: {
    total: number;
    lowStock: number;
  };
  recentOrders: {
    id: string;
    amount_captured: number;
    deliveryStatus: string;
    createdAt: string;
    items: { title: string; quantity: number }[];
    user: { name: string | null; email: string; image: string | null } | null;
  }[];
  topProducts: {
    productId: string;
    title: string;
    image: string;
    _sum: { quantity: number | null };
  }[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** GET /api/admin/stats */
export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await fetch("/api/admin/stats", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch stats.");
  return data;
};
