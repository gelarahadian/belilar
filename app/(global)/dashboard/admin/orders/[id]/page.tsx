import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminOrder } from "@/services/admin-order.service";
import AdminOrderDetailClient from "./AdminOrderDetailClient";
import { adminOrderKeys } from "@/hooks/admin-order.keys";

export const metadata = { title: "Order Detail — Admin" };

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") redirect("/");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: adminOrderKeys.detail(params.id),
    queryFn: () => getAdminOrder(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminOrderDetailClient id={params.id} />
    </HydrationBoundary>
  );
}
