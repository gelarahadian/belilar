import { DeliveryStatus, OrderStatus } from "./order.service";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminOrderUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface AdminOrder {
  id: string;
  chargeId: string;
  payment_intent: string;
  receipt_url: string;
  refunded: boolean;
  refundId: string | null;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  amount_captured: number;
  currency: string;
  shipping: {
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      postal_code: string;
      state: string;
    };
  };
  user: AdminOrderUser;
  items: AdminOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
}

export interface OrderFilters {
  page?: number;
  search?: string;
  status?: string;
  deliveryStatus?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** GET /api/admin/order */
export const getAdminOrders = async (
  filters: OrderFilters = {},
): Promise<AdminOrdersResponse> => {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.deliveryStatus)
    params.set("deliveryStatus", filters.deliveryStatus);

  const res = await fetch(`/api/admin/order?${params}`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch orders.");
  return data;
};

/** GET /api/admin/order/[id] */
export const getAdminOrder = async (
  id: string,
): Promise<{ order: AdminOrder }> => {
  const res = await fetch(`/api/admin/order/${id}`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch order.");
  return data;
};

/** PATCH /api/admin/order/[id] */
export const updateDeliveryStatus = async (
  id: string,
  deliveryStatus: string,
): Promise<{ order: AdminOrder }> => {
  const res = await fetch(`/api/admin/order/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deliveryStatus }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to update status.");
  return data;
};

/** POST /api/admin/order/[id] — manual refund */
export const adminRefundOrder = async (
  id: string,
): Promise<{ message: string; refundId: string }> => {
  const res = await fetch(`/api/admin/order/${id}`, { method: "POST" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to refund order.");
  return data;
};
