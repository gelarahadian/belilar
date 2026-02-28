import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminProductsPage from "./AdminProductPage";

export const metadata = { title: "Products — Admin" };

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") redirect("/");

  return <AdminProductsPage />;
}
