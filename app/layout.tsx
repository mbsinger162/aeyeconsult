import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { inject } from '@vercel/analytics';
 
inject();

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eye consult",
  description: "Chat With Eye Care Reference Texts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
