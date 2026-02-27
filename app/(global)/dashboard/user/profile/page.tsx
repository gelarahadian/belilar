import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfilePage from "./ProfilePage";
import { getProfile } from "@/services/profile.service";
import { profileKeys } from "@/hooks/profle.keys";

export const metadata = { title: "My Profile — Belilar" };

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard/user/profile");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: profileKeys.detail(),
    queryFn: () => getProfile(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePage />
    </HydrationBoundary>
  );
}
