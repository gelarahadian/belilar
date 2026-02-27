"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getWishlist,
  removeFromWishlist,
  WishlistResponse,
} from "@/services/wishlist.service";
import { wishlistKeys } from "./wishlist.keys";

// ─── useWishlist ──────────────────────────────────────────────────────────────

export function useWishlist() {
  return useQuery({
    queryKey: wishlistKeys.list(),
    queryFn: getWishlist,
    staleTime: 1000 * 60,
  });
}

// ─── useRemoveFromWishlist ────────────────────────────────────────────────────

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),

    // Optimistic — remove item from list immediately
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.list() });
      const snapshot = queryClient.getQueryData<WishlistResponse>(
        wishlistKeys.list(),
      );

      queryClient.setQueryData<WishlistResponse>(wishlistKeys.list(), (old) =>
        old
          ? { likes: old.likes.filter((item) => item.productId !== productId) }
          : old,
      );

      return { snapshot };
    },

    onError: (_err, _productId, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(wishlistKeys.list(), context.snapshot);
      }
      toast.error("Failed to remove from wishlist.");
    },

    onSuccess: () => {
      toast.success("Removed from wishlist.");
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list() });
    },
  });
}
