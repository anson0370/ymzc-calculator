import type { Metadata, Viewport } from "next";
import "./globals.css";
import clsx from "clsx";
import { fontInter, fontRobotoMono } from "./font";

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "元梦种菜计算器",
  description: "元梦种菜计算器",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cn">
      <body className={clsx(fontInter.variable, fontRobotoMono.variable)}>{children}</body>
    </html>
  );
}
