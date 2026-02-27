// ─── Types ────────────────────────────────────────────────────────────────────

export interface WishlistProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  previousPrice: number | null;
  brand: string;
  stock: number | null;
  images: { public_id: string; secure_url: string }[];
  category: { id: string; name: string };
  reviews: { rating: number }[];
}

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
  product: WishlistProduct;
}

export interface WishlistResponse {
  likes: WishlistItem[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** GET /api/user/wishlist */
export const getWishlist = async (): Promise<WishlistResponse> => {
  const res = await fetch("/api/user/wishlist", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch wishlist.");
  return data;
};

/** DELETE /api/user/product/like — toggle off (reuse existing like endpoint) */
export const removeFromWishlist = async (productId: string): Promise<void> => {
  const res = await fetch("/api/user/product/like", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message ?? "Failed to remove from wishlist.");
};
