"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  Address,
  AddressPayload,
} from "@/services/address.service";
import { addressKeys } from "./address.keys";


// ─── useAddresses ─────────────────────────────────────────────────────────────

export function useAddresses() {
  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: getAddresses,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── useCreateAddress ─────────────────────────────────────────────────────────

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddressPayload) => createAddress(payload),

    onSuccess: () => {
      toast.success("Address added!");
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },

    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to add address.");
    },
  });
}

// ─── useUpdateAddress ─────────────────────────────────────────────────────────

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddressPayload }) =>
      updateAddress(id, payload),

    onSuccess: () => {
      toast.success("Address updated!");
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },

    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to update address.");
    },
  });
}

// ─── useDeleteAddress ─────────────────────────────────────────────────────────

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),

    // Optimistic — remove immediately
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: addressKeys.list() });
      const snapshot = queryClient.getQueryData<{ addresses: Address[] }>(
        addressKeys.list(),
      );

      queryClient.setQueryData<{ addresses: Address[] }>(
        addressKeys.list(),
        (old) =>
          old ? { addresses: old.addresses.filter((a) => a.id !== id) } : old,
      );

      return { snapshot };
    },

    onError: (_err, _id, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(addressKeys.list(), context.snapshot);
      }
      toast.error("Failed to delete address.");
    },

    onSuccess: () => {
      toast.success("Address deleted.");
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },
  });
}

// ─── useSetDefaultAddress ─────────────────────────────────────────────────────

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),

    // Optimistic — update isDefault flags immediately
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: addressKeys.list() });
      const snapshot = queryClient.getQueryData<{ addresses: Address[] }>(
        addressKeys.list(),
      );

      queryClient.setQueryData<{ addresses: Address[] }>(
        addressKeys.list(),
        (old) =>
          old
            ? {
                addresses: old.addresses.map((a) => ({
                  ...a,
                  isDefault: a.id === id,
                })),
              }
            : old,
      );

      return { snapshot };
    },

    onError: (_err, _id, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(addressKeys.list(), context.snapshot);
      }
      toast.error("Failed to set default address.");
    },

    onSuccess: () => {
      toast.success("Default address updated!");
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },
  });
}
