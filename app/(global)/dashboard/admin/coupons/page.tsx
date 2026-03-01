import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminCouponsPage from "./AdminCouponsPage";

export const metadata = { title: "Coupons — Admin" };

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") redirect("/");
  return <AdminCouponsPage />;
}
