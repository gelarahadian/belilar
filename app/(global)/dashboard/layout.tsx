import Header from "@/app/components/Header/Header";
import UserSidebar from "./components/UserSidebar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserSidebar>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </UserSidebar>
  );
}
