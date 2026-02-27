// ─── Keys ─────────────────────────────────────────────────────────────────────

export const reviewKeys = {
  all: ["reviews"] as const,
  list: () => [...reviewKeys.all, "list"] as const,
};
