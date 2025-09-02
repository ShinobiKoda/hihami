"use client";

import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { UserProvider } from "./context/UserContext";
import { ToastProvider } from "./components/animations/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          {children}
          <ToastProvider />
        </UserProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
