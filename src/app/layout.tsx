import type { Metadata } from "next";
import "./globals.css";
// Providers moved to a client component to avoid passing functions to server
import Providers from "./providers";
import { Oxanium } from "next/font/google";
// Wagmi is provided in the client wrapper
import AppShell from "./AppShell";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  style: ["normal"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "HIHAMI | Homepage",
  description: "NFT Marketplace",
  icons: {
    icon: "/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oxanium.variable} antialiased`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
