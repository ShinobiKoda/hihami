import { http, createConfig } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo";

export const config = createConfig({
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
