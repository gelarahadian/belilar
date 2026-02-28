// ─── Keys ─────────────────────────────────────────────────────────────────────

import { UserFilters } from "@/services/admin-user.service";

export const adminUserKeys = {
  all: ["admin-users"] as const,
  list: (filters: UserFilters) =>
    [...adminUserKeys.all, "list", filters] as const,
  detail: (id: string) => [...adminUserKeys.all, "detail", id] as const,
};
