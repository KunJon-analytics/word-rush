import type { Metadata } from "next";
import Script from "next/script";

import { Providers } from "@/components/providers";
import { fontHeading, fontSans, fontUrban } from "@/assets/fonts";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Earn Pi Tokens by Finding Words - Word Rush",
  description:
    "Join Word Rush and earn Pi tokens by being the first person to find a word. A new word is revealed every hour, or until someone finds it. Hurry up and play now!",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontUrban.variable,
          fontHeading.variable
        )}
      >
        <Providers attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
