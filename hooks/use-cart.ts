"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  CartResponse,
  AddToCartPayload,
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from "@/services/cart.service";
import { cartKeys } from "./cart.keys";

// ─── useCart ──────────────────────────────────────────────────────────────────
// Fetch cart on the client side (used when you need live updates)

export function useCart(
  options?: Omit<UseQueryOptions<CartResponse>, "queryKey" | "queryFn">,
) {
  return useQuery<CartResponse>({
    queryKey: cartKeys.detail(),
    queryFn: () => getCart(),
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  });
}

// ─── useAddToCart ─────────────────────────────────────────────────────────────

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => addItem(payload),

    // Optimistic update
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });
      const snapshot = queryClient.getQueryData<CartResponse>(
        cartKeys.detail(),
      );

      queryClient.setQueryData<CartResponse>(cartKeys.detail(), (old) => {
        if (!old) return old;

        const existingIndex = old.items.findIndex(
          (item) => item.product.id === payload.productId,
        );

        let updatedItems = [...old.items];

        if (existingIndex !== -1) {
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + payload.quantity,
          };
        }
        // If new item, we can't fully optimistic without product details —
        // so we just let the invalidation handle it

        const total = updatedItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );

        return { ...old, items: updatedItems, total };
      });

      return { snapshot };
    },

    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(cartKeys.detail(), context.snapshot);
      }
      console.log(_err)
      toast.error("Failed to add item to cart.");
    },

    onSuccess: () => {
      toast.success("Added to cart!");
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

// ─── useUpdateCartItem ────────────────────────────────────────────────────────

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateItem(itemId, { quantity }),

    // Optimistic update
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });
      const snapshot = queryClient.getQueryData<CartResponse>(
        cartKeys.detail(),
      );

      queryClient.setQueryData<CartResponse>(cartKeys.detail(), (old) => {
        if (!old) return old;

        const updatedItems = old.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        );

        const total = updatedItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );

        return { ...old, items: updatedItems, total };
      });

      return { snapshot };
    },

    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(cartKeys.detail(), context.snapshot);
      }
      toast.error("Failed to update quantity.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

// ─── useRemoveCartItem ────────────────────────────────────────────────────────

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeItem(itemId),

    // Optimistic update
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });
      const snapshot = queryClient.getQueryData<CartResponse>(
        cartKeys.detail(),
      );

      queryClient.setQueryData<CartResponse>(cartKeys.detail(), (old) => {
        if (!old) return old;

        const updatedItems = old.items.filter((item) => item.id !== itemId);
        const total = updatedItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );

        return { ...old, items: updatedItems, total };
      });

      return { snapshot };
    },

    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(cartKeys.detail(), context.snapshot);
      }
      toast.error("Failed to remove item.");
    },

    onSuccess: () => {
      toast.success("Item removed from cart.");
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

// ─── useClearCart ─────────────────────────────────────────────────────────────

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCart(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });
      const snapshot = queryClient.getQueryData<CartResponse>(
        cartKeys.detail(),
      );

      queryClient.setQueryData<CartResponse>(cartKeys.detail(), (old) =>
        old ? { ...old, items: [], total: 0 } : old,
      );

      return { snapshot };
    },

    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(cartKeys.detail(), context.snapshot);
      }
      toast.error("Failed to clear cart.");
    },

    onSuccess: () => {
      toast.success("Cart cleared.");
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}
