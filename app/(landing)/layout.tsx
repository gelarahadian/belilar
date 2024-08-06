import { Toaster } from "react-hot-toast";
import Header from "./components/Header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={` overflow-y-scroll overflow-x-hidden `}>
      <Toaster />
      <Header />
      {children}
    </body>
  );
}
