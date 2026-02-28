import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminCategoriesPage from "./AdminCategoriesPage";

export const metadata = { title: "Categories & Tags — Admin" };

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") redirect("/");
  return <AdminCategoriesPage />;
}
