import { Toaster } from "react-hot-toast";
import Header from "../components/Header/Header";
import Footer from "../components/Footer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={` overflow-y-scroll overflow-x-hidden `}>
      <Header />
      {children}
      <Footer />
    </body>
  );
}
