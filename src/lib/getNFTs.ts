// lib/getNFTs.ts
import { NFTResponseOwner } from "@/types/type";

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const BASE_URL = `https://eth-mainnet.g.alchemy.com/nft/v3/${API_KEY}`;

export async function getNFTs(owner: string): Promise<NFTResponseOwner> {
  if (!API_KEY) {
    throw new Error("Alchemy API key is missing. Set NEXT_PUBLIC_ALCHEMY_API_KEY in .env.local");
  }

  const res = await fetch(`${BASE_URL}/getNFTsForOwner?owner=${owner}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch NFTs: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
