import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/services/admin-stats.service";
import { adminStatsKeys } from "@/hooks/admin-stats.keys";
import AdminDashboardClient from "./components/AdminDashboardClient";

export const metadata = { title: "Admin Dashboard — Belilar" };

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: adminStatsKeys.detail(),
    queryFn: getAdminStats,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardClient />
    </HydrationBoundary>
  );
}
