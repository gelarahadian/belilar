// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewProduct {
  id: string;
  title: string;
  slug: string;
  images: { public_id: string; secure_url: string }[];
  brand: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  product: ReviewProduct;
}

export interface ReviewableItem {
  productId: string;
  title: string;
  image: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  reviewable: ReviewableItem[];
}

export interface SubmitReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** GET /api/user/review */
export const getReviews = async (): Promise<ReviewsResponse> => {
  const res = await fetch("/api/user/review", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch reviews.");
  return data;
};

/** POST /api/user/review/submit */
export const submitReview = async (
  payload: SubmitReviewPayload,
): Promise<{ review: Review }> => {
  const res = await fetch("/api/user/review/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to submit review.");
  return data;
};
