"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  ProductFilters,
  ProductPayload,
  ProductsResponse,
  AdminProduct,
} from "@/services/admin-product.service";
import { adminProductKeys } from "./admin-product.keys";

// ─── useAdminProducts ─────────────────────────────────────────────────────────

export function useAdminProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: adminProductKeys.list(filters),
    queryFn: () => getAdminProducts(filters),
    staleTime: 1000 * 60,
  });
}

// ─── useCreateProduct ─────────────────────────────────────────────────────────

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ProductPayload) => createProduct(payload),

    onSuccess: () => {
      toast.success("Product created!");
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
      router.push("/dashboard/admin/products");
    },

    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to create product.");
    },
  });
}

// ─── useUpdateProduct ─────────────────────────────────────────────────────────

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ProductPayload>;
    }) => updateProduct(id, payload),

    onSuccess: () => {
      toast.success("Product updated!");
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
      router.push("/dashboard/admin/products");
    },

    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to update product.");
    },
  });
}

// ─── useDeleteProduct ─────────────────────────────────────────────────────────

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminProductKeys.all });
      // Optimistic remove from all cached pages
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: adminProductKeys.all },
        (old) =>
          old
            ? {
                ...old,
                products: old.products.filter((p) => p.id !== id),
                totalProducts: old.totalProducts - 1,
              }
            : old,
      );
    },

    onError: () => {
      toast.error("Failed to delete product.");
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
    },

    onSuccess: () => {
      toast.success("Product deleted.");
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
    },
  });
}
