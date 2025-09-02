import { http, createConfig } from 'wagmi'
import { mainnet, polygon, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, polygon, sepolia],
  connectors: [
    injected(), // MetaMask, Brave, Coinbase Wallet extension, etc.
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
  },
})
