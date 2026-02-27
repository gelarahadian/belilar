"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import {
  getProfile,
  updateProfile,
  changeEmail,
  changePassword,
  deleteAccount,
  UserProfile,
  UpdateProfilePayload,
  ChangeEmailPayload,
  ChangePasswordPayload,
  DeleteAccountPayload,
} from "@/services/profile.service";
import { profileKeys } from "./profle.keys";


// ─── useProfile ───────────────────────────────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── useUpdateProfile ─────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.detail() });
      const snapshot = queryClient.getQueryData<{ user: UserProfile }>(
        profileKeys.detail(),
      );
      queryClient.setQueryData<{ user: UserProfile }>(
        profileKeys.detail(),
        (old) => (old ? { user: { ...old.user, ...payload } } : old),
      );
      return { snapshot };
    },

    onError: (err: Error, _vars, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(profileKeys.detail(), context.snapshot);
      }
      toast.error(err.message ?? "Failed to update profile.");
    },

    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },
  });
}

// ─── useChangeEmail ───────────────────────────────────────────────────────────

export function useChangeEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeEmailPayload) => changeEmail(payload),

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },

    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to change email.");
    },
  });
}

// ─── useChangePassword ────────────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),

    onSuccess: (data) => {
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to change password.");
    },
  });
}

// ─── useDeleteAccount ─────────────────────────────────────────────────────────

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (payload: DeleteAccountPayload) => deleteAccount(payload),

    onSuccess: () => {
      toast.success("Account deleted.");
      signOut({ callbackUrl: "/" });
    },

    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to delete account.");
    },
  });
}
