// ─── Types ────────────────────────────────────────────────────────────────────

import { Prisma } from "@prisma/client";

export interface CartItemDetail {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    previousPrice: number | null;
    images: { secure_url: string }[];
    stock: number | null;
    brand: string;
  };
}

export interface CartResponse {
  id: string | null;
  items: CartItemDetail[];
  total: number;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

  /** GET /api/cart — used server-side via direct fetch */
  export const getCart = async (): Promise<CartResponse> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cart`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
  }

  /** POST /api/cart — add item */
  export const addItem = async (payload: AddToCartPayload): Promise<CartItemDetail> => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Failed to add item to cart");
    return data;
  }

  /** PATCH /api/cart/[itemId] — update quantity */
  export const updateItem = async (
    itemId: string,
    payload: UpdateCartItemPayload,
  ): Promise<CartItemDetail> => {
    const res = await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Failed to update cart item");
    return data;
  }

  /** DELETE /api/cart/[itemId] — remove one item */
  export const removeItem = async (itemId: string): Promise<void> => {
    const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Failed to remove cart item");
  }

  /** DELETE /api/cart/clear — clear entire cart */
  export const clearCart = async (): Promise<void> => {
    const res = await fetch("/api/cart/clear", { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Failed to clear cart");
  }
