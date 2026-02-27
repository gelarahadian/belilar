// ─── Types ────────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipient: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressPayload {
  label: string;
  recipient: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  isDefault?: boolean;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** GET /api/user/address */
export const getAddresses = async (): Promise<{ addresses: Address[] }> => {
  const res = await fetch("/api/user/address", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch addresses.");
  return data;
};

/** POST /api/user/address */
export const createAddress = async (
  payload: AddressPayload,
): Promise<{ address: Address }> => {
  const res = await fetch("/api/user/address", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to create address.");
  return data;
};

/** PATCH /api/user/address/[id] */
export const updateAddress = async (
  id: string,
  payload: AddressPayload,
): Promise<{ address: Address }> => {
  const res = await fetch(`/api/user/address/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to update address.");
  return data;
};

/** DELETE /api/user/address/[id] */
export const deleteAddress = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await fetch(`/api/user/address/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to delete address.");
  return data;
};

/** PUT /api/user/address/[id] — set as default */
export const setDefaultAddress = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await fetch(`/api/user/address/${id}`, { method: "PUT" });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message ?? "Failed to set default address.");
  return data;
};
