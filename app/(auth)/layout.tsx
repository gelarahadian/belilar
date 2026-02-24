import Info from "./components/Info";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <Info>{children}</Info>
    </body>
  );
}
