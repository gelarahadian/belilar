"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAdminUsers,
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
  AdminUser,
  UsersResponse,
  UserFilters,
} from "@/services/admin-user.service";
import { adminUserKeys } from "./admin-user.keys";

// ─── useAdminUsers ────────────────────────────────────────────────────────────

export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: adminUserKeys.list(filters),
    queryFn: () => getAdminUsers(filters),
    staleTime: 1000 * 60,
  });
}

// ─── useAdminUser ─────────────────────────────────────────────────────────────

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => getAdminUser(id),
    staleTime: 1000 * 60,
  });
}

// ─── useUpdateAdminUser ───────────────────────────────────────────────────────

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { role?: string; banned?: boolean };
    }) => updateAdminUser(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: adminUserKeys.detail(id) });
      const snapshot = queryClient.getQueryData<{ user: AdminUser }>(
        adminUserKeys.detail(id),
      );
      queryClient.setQueryData<{ user: AdminUser }>(
        adminUserKeys.detail(id),
        (old) =>
          old ? { user: { ...old.user, ...payload } as AdminUser } : old,
      );
      return { snapshot };
    },

    onError: (_err, { id }, context) => {
      if (context?.snapshot)
        queryClient.setQueryData(adminUserKeys.detail(id), context.snapshot);
      toast.error("Failed to update user.");
    },

    onSuccess: (_data, { id, payload }) => {
      const msg =
        payload.banned !== undefined
          ? payload.banned
            ? "User banned."
            : "User unbanned."
          : "Role updated.";
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
}

// ─── useDeleteAdminUser ───────────────────────────────────────────────────────

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminUserKeys.all });
      const snapshots = queryClient.getQueriesData<UsersResponse>({
        queryKey: adminUserKeys.all,
      });
      queryClient.setQueriesData<UsersResponse>(
        { queryKey: adminUserKeys.all },
        (old) =>
          old
            ? {
                ...old,
                users: old.users.filter((u) => u.id !== id),
                totalUsers: old.totalUsers - 1,
              }
            : old,
      );
      return { snapshots };
    },

    onError: (_err, _id, context) => {
      context?.snapshots?.forEach(([key, value]) =>
        queryClient.setQueryData(key, value),
      );
      toast.error("Failed to delete user.");
    },

    onSuccess: () => {
      toast.success("User deleted.");
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
}
