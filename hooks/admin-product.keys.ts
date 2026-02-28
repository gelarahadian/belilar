// ─── Keys ─────────────────────────────────────────────────────────────────────

import { ProductFilters } from "@/services/admin-product.service";

export const adminProductKeys = {
  all: ["admin-products"] as const,
  list: (filters: ProductFilters) =>
    [...adminProductKeys.all, "list", filters] as const,
};
