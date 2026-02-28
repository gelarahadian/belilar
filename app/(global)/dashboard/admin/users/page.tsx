import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminUsersPage from "./AdminUsersPage";

export const metadata = { title: "Users — Admin" };

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") redirect("/");
  return <AdminUsersPage />;
}
