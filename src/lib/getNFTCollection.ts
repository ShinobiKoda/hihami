import { NFT, NFTResponseCollection } from "@/types/type";

type LocalNFT = {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: { eth?: number };
  contract: { address: string; name?: string; symbol?: string };
  token: { id: string };
};

function adapt(local: LocalNFT): NFT {
  return {
    contract: { address: local.contract.address },
    id: {
      tokenId: local.token.id,
      tokenMetadata: { tokenType: "ERC721" },
    },
    title: local.name,
    description: local.description,
    tokenUri: { raw: local.image, gateway: local.image },
    media: [{ gateway: local.image }],
    metadata: {
      name: local.name,
      description: local.description,
      image: local.image,
    },
    timeLastUpdated: new Date().toISOString(),
    contractMetadata: {
      name: local.contract.name || "Collection",
      symbol: local.contract.symbol || "NFT",
      totalSupply: "1",
      tokenType: "ERC721",
    },
  };
}

export async function getNFTsForCollection(
  contractAddress: string,
  limit: number = 10
): Promise<NFTResponseCollection> {
  try {
    const res = await fetch("/data/NFT.json", { cache: "no-store" });
    const all = (await res.json()) as LocalNFT[];
    const filtered = all.filter(
      (x) => x.contract.address.toLowerCase() === contractAddress.toLowerCase()
    );
    const slice = filtered.slice(0, limit).map(adapt);
    return { nfts: slice };
  } catch {
    return { nfts: [] };
  }
}
