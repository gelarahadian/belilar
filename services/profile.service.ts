// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  image?: string;
}

export interface ChangeEmailPayload {
  email: string;
  password?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountPayload {
  password?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────


  export const getProfile = async (): Promise<{ user: UserProfile }> => {
    const res = await fetch("/api/user/profile", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Failed to fetch profile.");
    return data;
  }

  export const updateProfile = async (
    payload: UpdateProfilePayload,
  ): Promise<{ user: UserProfile }> =>  {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Failed to update profile.");
    return data;
  }

  export const changeEmail = async (payload: ChangeEmailPayload): Promise<{ message: string }> => {
    const res = await fetch("/api/user/profile/email", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Failed to change email.");
    return data;
  }

  export const changePassword = async (
    payload: ChangePasswordPayload,
  ): Promise<{ message: string }> => {
    const res = await fetch("/api/user/profile/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Failed to change password.");
    return data;
  }

  export const deleteAccount = async (
    payload: DeleteAccountPayload,
  ): Promise<{ message: string }> => {
    const res = await fetch("/api/user/profile/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Failed to delete account.");
    return data;
  }
