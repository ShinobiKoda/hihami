// types/nft.ts

export interface NFT {
  contract: {
    address: string;
  };
  id: {
    tokenId: string;
    tokenMetadata: {
      tokenType: string;
    };
  };
  title: string;
  description: string;
  tokenUri: {
    raw: string;
    gateway: string;
  };
  media: Media[] | null;
  metadata: Metadata | null;
  timeLastUpdated: string;
  contractMetadata: ContractMetadata;
}

export interface Media {
  gateway?: string;
  thumbnail?: string;
  raw?: string;
  format?: string;
  bytes?: number;
}

export interface Metadata {
  image?: string;
  external_url?: string;
  name?: string;
  description?: string;
  attributes?: Attributes[];
}

export interface Attributes {
  value: string;
  trait_type: string;
}

export interface ContractMetadata {
  name: string;
  symbol: string;
  totalSupply: string;
  tokenType: string;
}

// 👇 Response when fetching NFTs for an owner (wallet address)
export interface NFTResponseOwner {
  ownedNfts: NFT[];
  totalCount: number;
  blockHash: string;
}

// 👇 Response when fetching NFTs for a collection (contract address)
export interface NFTResponseCollection {
  nfts: NFT[];
  nextToken?: string; // for pagination
}
