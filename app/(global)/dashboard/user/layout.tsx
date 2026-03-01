import { redirect } from "next/navigation";
import { auth } from "@/auth";
import UserSidebar from "./components/UserSidebar";
import UserDashboardHeader from "./components/UserDashboardHeader";

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Not logged in
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard/user");
  }

  // Admin → tidak perlu akses user dashboard
  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  }

  return (
    <UserSidebar>
      <div className="flex flex-col min-h-screen">
        <UserDashboardHeader />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </UserSidebar>
  );
}
