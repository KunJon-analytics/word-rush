"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Provider as BalancerProvider } from "react-wrap-balancer";
import Script from "next/script";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <>
      <Script
        src="https://sdk.minepi.com/pi-sdk.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.Pi.init({
            version: "2.0",
            sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === "true",
          });
        }}
      />
      <NextThemesProvider {...props}>
        <BalancerProvider>{children}</BalancerProvider>
      </NextThemesProvider>
    </>
  );
}
