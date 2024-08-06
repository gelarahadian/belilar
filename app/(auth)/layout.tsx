import { Toaster } from "react-hot-toast";
import Info from "./components/Info";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <Toaster />
      <Info>{children}</Info>
    </body>
  );
}
