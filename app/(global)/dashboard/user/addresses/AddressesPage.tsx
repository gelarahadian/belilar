"use client";

import { useState } from "react";
import {
  HiLocationMarker,
  HiPlus,
  HiPencil,
  HiTrash,
  HiStar,
  HiCheck,
} from "react-icons/hi";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/use-address";
import { Address } from "@/services/address.service";
import AddressForm from "./AddressForm";

// ─── AddressCard ──────────────────────────────────────────────────────────────

function AddressCard({
  address,
  onEdit,
}: {
  address: Address;
  onEdit: (a: Address) => void;
}) {
  const { mutate: remove, isPending: isDeleting } = useDeleteAddress();
  const { mutate: setDefault, isPending: isSettingDefault } =
    useSetDefaultAddress();

  return (
    <div
      className={`bg-white border rounded-2xl p-5 space-y-3 transition-all duration-150 ${
        address.isDefault
          ? "border-primary-200 shadow-sm shadow-primary-100"
          : "border-gray-100"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg">
            {address.label}
          </span>
          {address.isDefault && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-primary-50 text-primary-700 border border-primary-200 rounded-lg">
              <HiCheck className="text-xs" />
              Default
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!address.isDefault && (
            <button
              type="button"
              onClick={() => setDefault(address.id)}
              disabled={isSettingDefault}
              title="Set as default"
              className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 border border-transparent hover:border-yellow-200 transition-all duration-150 disabled:opacity-40"
            >
              {isSettingDefault ? (
                <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-yellow-400 rounded-full animate-spin" />
              ) : (
                <HiStar className="text-sm" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(address)}
            title="Edit address"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-all duration-150"
          >
            <HiPencil className="text-sm" />
          </button>

          <button
            type="button"
            onClick={() => remove(address.id)}
            disabled={isDeleting}
            title="Delete address"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-150 disabled:opacity-40"
          >
            {isDeleting ? (
              <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-red-400 rounded-full animate-spin" />
            ) : (
              <HiTrash className="text-sm" />
            )}
          </button>
        </div>
      </div>

      {/* Address details */}
      <div className="flex items-start gap-2 text-sm text-gray-700">
        <HiLocationMarker className="text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-0.5">
          <p className="font-semibold">{address.recipient}</p>
          {address.phone && (
            <p className="text-xs text-gray-400">{address.phone}</p>
          )}
          <p className="text-xs text-gray-500">
            {address.line1}
            {address.line2 && `, ${address.line2}`}
          </p>
          <p className="text-xs text-gray-500">
            {address.city}, {address.state} {address.postal_code}
          </p>
          <p className="text-xs text-gray-500">{address.country}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddressesPage() {
  const { data, isLoading } = useAddresses();
  const addresses = data?.addresses ?? [];

  const [mode, setMode] = useState<"idle" | "add" | "edit">("idle");
  const [editing, setEditing] = useState<Address | null>(null);

  const { mutate: create, isPending: isCreating } = useCreateAddress();
  const { mutate: update, isPending: isUpdating } = useUpdateAddress();

  const handleEdit = (address: Address) => {
    setEditing(address);
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setMode("idle");
    setEditing(null);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-2 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-2 space-y-4">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-gray-900">My Addresses</h1>
        {mode === "idle" && (
          <button
            type="button"
            onClick={() => setMode("add")}
            className="flex items-center gap-1.5 h-9 px-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors duration-150"
          >
            <HiPlus className="text-sm" />
            Add Address
          </button>
        )}
      </div>

      {/* ── Form (add / edit) ─────────────────────────────────────────────── */}
      {mode !== "idle" && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">
              {mode === "add" ? "New Address" : "Edit Address"}
            </h2>
          </div>
          <div className="px-5 py-5">
            <AddressForm
              initial={mode === "edit" ? editing : null}
              isPending={isCreating || isUpdating}
              onCancel={handleCancel}
              onSubmit={(payload) => {
                if (mode === "add") {
                  create(payload, { onSuccess: handleCancel });
                } else if (editing) {
                  update(
                    { id: editing.id, payload },
                    { onSuccess: handleCancel },
                  );
                }
              }}
            />
          </div>
        </div>
      )}

      {/* ── Address list ──────────────────────────────────────────────────── */}
      {addresses.length > 0 ? (
        <div className="space-y-3">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : mode === "idle" ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <HiLocationMarker className="text-3xl text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            No addresses yet
          </p>
          <p className="text-xs text-gray-400 mt-1 mb-5">
            Add a delivery address to speed up checkout
          </p>
          <button
            type="button"
            onClick={() => setMode("add")}
            className="h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors duration-150"
          >
            Add Address
          </button>
        </div>
      ) : null}
    </div>
  );
}
