const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const BASE_URL = `https://eth-mainnet.g.alchemy.com/nft/v3/${API_KEY}`;

export type OwnersForTokenResponse = {
  owners: string[];
};

export async function getOwnersForToken(
  contractAddress: string,
  tokenId: string
): Promise<OwnersForTokenResponse> {
  if (!API_KEY) {
    throw new Error(
      "Alchemy API key is missing. Set NEXT_PUBLIC_ALCHEMY_API_KEY in .env.local"
    );
  }

  const res = await fetch(
    `${BASE_URL}/getOwnersForNFT?contractAddress=${contractAddress}&tokenId=${tokenId}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch owners: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
