import { http, createConfig } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

// Declare a global type for caching wagmi config during HMR (dev only)
declare global {
  var __wagmiConfig: ReturnType<typeof createConfig> | undefined;
}

const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo";

// Cache config across HMR to avoid re-initializing WalletConnect Core multiple times
export const config =
  globalThis.__wagmiConfig ??
  createConfig({
    chains: [mainnet, polygon, sepolia],
    connectors: [
      injected(), // MetaMask, Trust Wallet extension, Brave, Coinbase Wallet extension, etc.
      walletConnect({ projectId: WALLETCONNECT_PROJECT_ID, showQrModal: true }),
      coinbaseWallet({ appName: "HIHAMI" }),
    ],
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [sepolia.id]: http(),
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__wagmiConfig = config;
}
