// ─── Keys ─────────────────────────────────────────────────────────────────────

export const adminCategoryKeys = {
  all: ["admin-categories"] as const,
  list: () => [...adminCategoryKeys.all, "list"] as const,
};

export const adminTagKeys = {
  all: ["admin-tags"] as const,
  list: () => [...adminTagKeys.all, "list"] as const,
};
