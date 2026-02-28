"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAdminOrders,
  getAdminOrder,
  updateDeliveryStatus,
  adminRefundOrder,
  AdminOrdersResponse,
  AdminOrder,
  OrderFilters,
} from "@/services/admin-order.service";
import { adminOrderKeys } from "./admin-order.keys";

// ─── useAdminOrders ───────────────────────────────────────────────────────────

export function useAdminOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: adminOrderKeys.list(filters),
    queryFn: () => getAdminOrders(filters),
    staleTime: 1000 * 60,
  });
}

// ─── useAdminOrder ────────────────────────────────────────────────────────────

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: adminOrderKeys.detail(id),
    queryFn: () => getAdminOrder(id),
    staleTime: 1000 * 60,
  });
}

// ─── useUpdateDeliveryStatus ──────────────────────────────────────────────────

export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      deliveryStatus,
    }: {
      id: string;
      deliveryStatus: string;
    }) => updateDeliveryStatus(id, deliveryStatus),

    onMutate: async ({ id, deliveryStatus }) => {
      await queryClient.cancelQueries({ queryKey: adminOrderKeys.detail(id) });
      const snapshot = queryClient.getQueryData<{ order: AdminOrder }>(
        adminOrderKeys.detail(id),
      );

      queryClient.setQueryData<{ order: AdminOrder }>(
        adminOrderKeys.detail(id),
        (old) =>
          old
            ? { order: { ...old.order, deliveryStatus: deliveryStatus as any } }
            : old,
      );

      return { snapshot };
    },

    onError: (_err, { id }, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(adminOrderKeys.detail(id), context.snapshot);
      }
      toast.error("Failed to update delivery status.");
    },

    onSuccess: (_data, { id }) => {
      toast.success("Delivery status updated!");
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.all });
    },
  });
}

// ─── useAdminRefundOrder ──────────────────────────────────────────────────────

export function useAdminRefundOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminRefundOrder(id),

    onSuccess: (_data, id) => {
      toast.success("Order refunded successfully.");
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.all });
    },

    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to refund order.");
    },
  });
}
