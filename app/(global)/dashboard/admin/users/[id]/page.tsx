import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/services/admin-user.service";
import AdminUserDetailClient from "./AdminUserDetailClient";
import { adminUserKeys } from "@/hooks/admin-user.keys";

export const metadata = { title: "User Detail — Admin" };

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") redirect("/");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: adminUserKeys.detail(params.id),
    queryFn: () => getAdminUser(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminUserDetailClient id={params.id} />
    </HydrationBoundary>
  );
}
