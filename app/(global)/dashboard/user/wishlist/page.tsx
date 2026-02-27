import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getWishlist } from "@/services/wishlist.service";
import { wishlistKeys } from "@/hooks/wishlist.keys";
import WishlistPage from "./WishlistPage";


export const metadata = { title: "My Wishlist — Belilar" };

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard/user/wishlist");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: wishlistKeys.list(),
    queryFn: getWishlist,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WishlistPage />
    </HydrationBoundary>
  );
}
