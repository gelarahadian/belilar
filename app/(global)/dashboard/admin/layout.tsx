import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminSidebar from "./components/AdminSidebar";
import AdminDashboardHeader from "./components/AdminDashboardHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Not logged in
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard/admin");
  }

  // Not admin → back to home
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <AdminSidebar>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <AdminDashboardHeader />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </AdminSidebar>
  );
}
