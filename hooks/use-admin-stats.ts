"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/services/admin-stats.service";
import { adminStatsKeys } from "./admin-stats.keys";

// ─── useAdminStats ────────────────────────────────────────────────────────────

export function useAdminStats() {
  return useQuery({
    queryKey: adminStatsKeys.detail(),
    queryFn: getAdminStats,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}
