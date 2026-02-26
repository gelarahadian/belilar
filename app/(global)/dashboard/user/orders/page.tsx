import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { listOrders } from "@/services/order.service";
import { orderKeys } from "@/hooks/order.keys";
import UserOrders from "./UserOrders";
import { auth } from "@/auth";

export const metadata = { title: "My Orders — Belilar" };

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard/user/orders");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: orderKeys.list(),
    queryFn: () => listOrders(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserOrders />
    </HydrationBoundary>
  );
}
