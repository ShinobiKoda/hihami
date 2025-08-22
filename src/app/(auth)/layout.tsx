import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Enefty | Register",
  description: "NFT Marketplace",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={` min-h-screen ${poppins.variable}`}>{children}</div>;
}
