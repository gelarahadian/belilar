"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getReviews,
  submitReview,
  ReviewsResponse,
  SubmitReviewPayload,
} from "@/services/review.service";
import { reviewKeys } from "./review.keys";

// ─── useReviews ───────────────────────────────────────────────────────────────

export function useReviews() {
  return useQuery({
    queryKey: reviewKeys.list(),
    queryFn: getReviews,
    staleTime: 1000 * 60,
  });
}

// ─── useSubmitReview ──────────────────────────────────────────────────────────

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitReviewPayload) => submitReview(payload),

    onSuccess: (data) => {
      toast.success("Review submitted!");

      // Update cache — move product from reviewable to reviews
      queryClient.setQueryData<ReviewsResponse>(reviewKeys.list(), (old) => {
        if (!old) return old;
        return {
          reviews: [data.review, ...old.reviews],
          reviewable: old.reviewable.filter(
            (item) => item.productId !== data.review.productId,
          ),
        };
      });
    },

    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to submit review.");
    },
  });
}
