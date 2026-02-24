// ─── app/cart/page.tsx — Server Component ─────────────────────────────────────
// Prefetches cart on the server so the client gets data immediately (no flicker)

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerCart } from "@/lib/getServerCart";
import { cartKeys } from "@/hooks/cart.keys";
import CartPageClient from "./components/CartPageClient";

export const metadata = { title: "Your Cart — Belilar" };

export default async function CartPage() {
  const queryClient = new QueryClient();

  // Prefetch directly from DB (no HTTP round-trip)
  await queryClient.prefetchQuery({
    queryKey: cartKeys.detail(),
    queryFn: getServerCart,
  });

  return (
    // Passes the prefetched cache to the client
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CartPageClient />
    </HydrationBoundary>
  );
}
