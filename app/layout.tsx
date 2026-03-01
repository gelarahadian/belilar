import { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "./components/Provider";
import "./globals.css";
import TopLoader from "./components/TopLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Belilar Flatform Belanja Online No1 Indonesia",
  description:
    "Sebuah website aplikasi yang bisa digunakan oleh seluruh rakyat indonesia untuk bertransaksi secara online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <Provider>
        <body className={` overflow-y-scroll overflow-x-hidden `}>
          <TopLoader />
          {children}
        </body>
      </Provider>
    </html>
  );
}
