import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminOrdersPage from "./AdminOrdersPage";

export const metadata = { title: "Orders — Admin" };

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") redirect("/");
  return <AdminOrdersPage />;
}
