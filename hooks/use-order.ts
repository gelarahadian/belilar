"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ListOrdersResponse, listOrders, refundOrder } from "@/services/order.service";
import { orderKeys } from "./order.keys";

// ─── useListOrders ────────────────────────────────────────────────────────────

export function useListOrders() {
  return useQuery<ListOrdersResponse>({
    queryKey: orderKeys.list(),
    queryFn: () => listOrders(),
    staleTime: 1000 * 60, // 1 minute
  });
}

// ─── useRefundOrder ───────────────────────────────────────────────────────────

export function useRefundOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => refundOrder(orderId),

    // Optimistic update — mark order as refunded immediately
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.list() });
      const snapshot = queryClient.getQueryData<ListOrdersResponse>(
        orderKeys.list(),
      );

      queryClient.setQueryData<ListOrdersResponse>(orderKeys.list(), (old) => {
        if (!old) return old;
        return {
          orders: old.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: "refunded" as const,
                  refunded: true,
                  deliveryStatus: "Refunded" as const,
                }
              : order,
          ),
        };
      });

      return { snapshot };
    },

    onError: (_err, _orderId, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(orderKeys.list(), context.snapshot);
      }
      toast.error(_err.message ?? "Failed to refund order.");
    },

    onSuccess: () => {
      toast.success("Order refunded successfully.");
      queryClient.invalidateQueries({ queryKey: orderKeys.list() });
    },
  });
}
