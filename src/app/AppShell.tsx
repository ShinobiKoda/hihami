"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./components/layout/Navbar";

const AUTH_PREFIXES = [
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

function isAuthRoute(pathname: string | null) {
  if (!pathname) return false;
  return AUTH_PREFIXES.some((p) => pathname.startsWith(p));
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = isAuthRoute(pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
