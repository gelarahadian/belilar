export const adminStatsKeys = {
  all: ["admin-stats"] as const,
  detail: () => [...adminStatsKeys.all, "detail"] as const,
};
