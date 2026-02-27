import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAddresses } from "@/services/address.service";
import AddressesPage from "./AddressesPage";
import { addressKeys } from "@/hooks/address.keys";

export const metadata = { title: "My Addresses — Belilar" };

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard/user/addresses");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: addressKeys.list(),
    queryFn: getAddresses,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AddressesPage />
    </HydrationBoundary>
  );
}
