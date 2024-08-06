import Header from "../components/Header";
import UserSidebar from "../components/UserSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <UserSidebar>
        <Header />
        <article className="px-3 pt-3 max-w-6xl">
          {/* <Title /> */}
          {children}
        </article>
      </UserSidebar>
    </main>
  );
}
