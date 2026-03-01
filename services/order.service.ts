// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderShipping {
  address: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
  };
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";
export type DeliveryStatus =
  | "NotProcessed"
  | "Processing"
  | "Dispatched"
  | "Refunded"
  | "Cancelled"
  | "Delivered";

export interface Order {
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
  shipping: OrderShipping;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ListOrdersResponse {
  orders: Order[];
}

export interface RefundOrderResponse {
  message: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** GET /api/user/order */
export const listOrders = async (): Promise<ListOrdersResponse> => {
  const res = await fetch("/api/user/order", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch orders.");
  return data;
}

/** POST /api/user/order/refund?orderId=xxx */
export const refundOrder = async (orderId: string): Promise<RefundOrderResponse> => {
  const res = await fetch(`/api/user/order/refund?orderId=${orderId}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to refund order.");
  return data;
}
