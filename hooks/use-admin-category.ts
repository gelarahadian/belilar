"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminTags,
  createTag,
  updateTag,
  deleteTag,
  AdminCategory,
  AdminTag,
} from "@/services/admin-category.service";
import { adminCategoryKeys, adminTagKeys } from "./admin-category.keys";

// ─── useAdminCategories ───────────────────────────────────────────────────────

export function useAdminCategories() {
  return useQuery({
    queryKey: adminCategoryKeys.list(),
    queryFn: getAdminCategories,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── useCreateCategory ────────────────────────────────────────────────────────

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: (data) => {
      toast.success("Category created!");
      queryClient.setQueryData<{ categories: AdminCategory[] }>(
        adminCategoryKeys.list(),
        (old) =>
          old
            ? {
                categories: [...old.categories, data.category].sort((a, b) =>
                  a.name.localeCompare(b.name),
                ),
              }
            : old,
      );
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── useUpdateCategory ────────────────────────────────────────────────────────

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, name),
    onSuccess: (data) => {
      toast.success("Category updated!");
      queryClient.setQueryData<{ categories: AdminCategory[] }>(
        adminCategoryKeys.list(),
        (old) =>
          old
            ? {
                categories: old.categories.map((c) =>
                  c.id === data.category.id ? data.category : c,
                ),
              }
            : old,
      );
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── useDeleteCategory ────────────────────────────────────────────────────────

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminCategoryKeys.list() });
      const snapshot = queryClient.getQueryData<{
        categories: AdminCategory[];
      }>(adminCategoryKeys.list());
      queryClient.setQueryData<{ categories: AdminCategory[] }>(
        adminCategoryKeys.list(),
        (old) =>
          old ? { categories: old.categories.filter((c) => c.id !== id) } : old,
      );
      return { snapshot };
    },
    onError: (err: Error, _id, context) => {
      if (context?.snapshot)
        queryClient.setQueryData(adminCategoryKeys.list(), context.snapshot);
      toast.error(err.message);
    },
    onSuccess: () => toast.success("Category deleted."),
  });
}

// ─── useAdminTags ─────────────────────────────────────────────────────────────

export function useAdminTags() {
  return useQuery({
    queryKey: adminTagKeys.list(),
    queryFn: getAdminTags,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── useCreateTag ─────────────────────────────────────────────────────────────

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, categoryId }: { name: string; categoryId: string }) =>
      createTag(name, categoryId),
    onSuccess: (data) => {
      toast.success("Tag created!");
      queryClient.setQueryData<{ tags: AdminTag[] }>(
        adminTagKeys.list(),
        (old) => (old ? { tags: [...old.tags, data.tag] } : old),
      );
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── useUpdateTag ─────────────────────────────────────────────────────────────

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      name,
      categoryId,
    }: {
      id: string;
      name: string;
      categoryId?: string;
    }) => updateTag(id, { name, categoryId }),
    onSuccess: (data) => {
      toast.success("Tag updated!");
      queryClient.setQueryData<{ tags: AdminTag[] }>(
        adminTagKeys.list(),
        (old) =>
          old
            ? {
                tags: old.tags.map((t) =>
                  t.id === data.tag.id ? data.tag : t,
                ),
              }
            : old,
      );
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── useDeleteTag ─────────────────────────────────────────────────────────────

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminTagKeys.list() });
      const snapshot = queryClient.getQueryData<{ tags: AdminTag[] }>(
        adminTagKeys.list(),
      );
      queryClient.setQueryData<{ tags: AdminTag[] }>(
        adminTagKeys.list(),
        (old) => (old ? { tags: old.tags.filter((t) => t.id !== id) } : old),
      );
      return { snapshot };
    },
    onError: (err: Error, _id, context) => {
      if (context?.snapshot)
        queryClient.setQueryData(adminTagKeys.list(), context.snapshot);
      toast.error(err.message);
    },
    onSuccess: () => toast.success("Tag deleted."),
  });
}
