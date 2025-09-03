import { http, createConfig } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Declare a global type for caching wagmi config during HMR (dev only)
declare global {
  var __wagmiConfig: ReturnType<typeof createConfig> | undefined;
}

// WalletConnect and Coinbase connectors removed; only injected (MetaMask/Trust) is supported.

// Cache config across HMR to avoid re-initializing WalletConnect Core multiple times
export const config =
  globalThis.__wagmiConfig ??
  createConfig({
    chains: [mainnet, polygon, sepolia],
    connectors: [
      injected(), // MetaMask, Trust Wallet extension, Brave, etc.
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
