import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getReviews } from "@/services/review.service";
import ReviewsPage from "./ReviewsPage";
import { reviewKeys } from "@/hooks/review.keys";

export const metadata = { title: "My Reviews — Belilar" };

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard/user/reviews");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: reviewKeys.list(),
    queryFn: getReviews,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewsPage />
    </HydrationBoundary>
  );
}
