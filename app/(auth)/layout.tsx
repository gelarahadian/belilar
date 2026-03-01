import Info from "./components/Info";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Info>{children}</Info>;
}
