import AdminSidebar from "../components/AdminSidebar";
import Header from "../components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <AdminSidebar>
        <Header />
        <article className="px-3 pt-3 max-w-6xl">
          {/* <Title /> */}
          {children}
        </article>
      </AdminSidebar>
    </main>
  );
}
