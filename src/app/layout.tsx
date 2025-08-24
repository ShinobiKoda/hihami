import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./components/animations/toast";
import { UserProvider } from "./context/UserContext";
import { Oxanium } from "next/font/google";

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
        <UserProvider>
          {children}
          <ToastProvider />
        </UserProvider>
      </body>
    </html>
  );
}
