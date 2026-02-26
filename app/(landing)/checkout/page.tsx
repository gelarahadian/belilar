import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getServerCart } from "@/lib/getServerCart";
import { cartKeys } from "@/hooks/cart.keys";
import CheckoutPageClient from "./CheckoutPageClient";
import { auth } from "@/auth";

export const metadata = { title: "Checkout — Belilar" };

export default async function CheckoutPage() {
  const session = await auth();

  // Redirect unauthenticated users
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/checkout");
  }

  // Prefetch cart directly from DB
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: cartKeys.detail(),
    queryFn: getServerCart,
  });

  const cart = queryClient.getQueryData(cartKeys.detail()) as Awaited<
    ReturnType<typeof getServerCart>
  >;

  // Redirect if cart is empty
  if (!cart?.items?.length) {
    redirect("/cart");
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckoutPageClient />
    </HydrationBoundary>
  );
}
