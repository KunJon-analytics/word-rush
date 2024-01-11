import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Earn Pi Tokens by Finding Words - Word Rush",
  description:
    "Join Word Rush and earn Pi tokens by being the first person to find a word. A new word is revealed every hour, or until someone finds it. Hurry up and play now!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
