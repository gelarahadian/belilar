// ─── Keys ─────────────────────────────────────────────────────────────────────

import { OrderFilters } from "@/services/admin-order.service";

export const adminOrderKeys = {
  all: ["admin-orders"] as const,
  list: (filters: OrderFilters) =>
    [...adminOrderKeys.all, "list", filters] as const,
  detail: (id: string) => [...adminOrderKeys.all, "detail", id] as const,
};
