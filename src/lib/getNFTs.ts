// lib/getNFTs.ts - local stub
import { NFT, NFTResponseOwner } from "@/types/type";

type LocalNFT = {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: { eth?: number };
  contract: { address: string; name?: string; symbol?: string };
  token: { id: string };
  owner?: { address?: string };
};

function adapt(local: LocalNFT): NFT {
  return {
    contract: { address: local.contract.address },
    id: { tokenId: local.token.id, tokenMetadata: { tokenType: "ERC721" } },
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

export async function getNFTs(owner: string): Promise<NFTResponseOwner> {
  try {
    const res = await fetch("/data/NFT.json", { cache: "no-store" });
    const all = (await res.json()) as LocalNFT[];
    const list = all
      .filter((x) => x.owner?.address?.toLowerCase() === owner.toLowerCase())
      .map(adapt);
    return {
      ownedNfts: list,
      totalCount: list.length,
      blockHash: "local",
    };
  } catch {
    return { ownedNfts: [], totalCount: 0, blockHash: "local" };
  }
}
