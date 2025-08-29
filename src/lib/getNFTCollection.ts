import { NFTResponseCollection } from "@/types/type";

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const BASE_URL = `https://eth-mainnet.g.alchemy.com/nft/v3/${API_KEY}`;

export async function getNFTsForCollection(
  contractAddress: string,
  limit: number = 10
): Promise<NFTResponseCollection> {
  if (!API_KEY) {
    throw new Error(
      "Alchemy API key is missing. Set NEXT_PUBLIC_ALCHEMY_API_KEY in .env.local"
    );
  }

  const res = await fetch(
    `${BASE_URL}/getNFTsForCollection?contractAddress=${contractAddress}&withMetadata=true&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch NFTs: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  // Defensive: some gateways ignore limit; enforce on client
  if (json?.nfts && Array.isArray(json.nfts)) {
    json.nfts = json.nfts.slice(0, limit);
  }
  return json;
}
