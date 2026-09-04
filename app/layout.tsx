import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parent Update Message",
  description: "A quick and organized parent update message generator for mentors.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
