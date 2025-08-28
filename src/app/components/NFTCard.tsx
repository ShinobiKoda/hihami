"use client";

import { useEffect, useState } from "react";
import { getNFTsForCollection } from "@/lib/getNFTCollection";
import { NFT } from "@/types/type";
import Image from "next/image";

// Minimal shape for Alchemy v3 collection NFTs
type NFTV3 = {
  tokenId?: string;
  name?: string;
  description?: string;
  image?: { cachedUrl?: string; originalUrl?: string };
  tokenUri?: string;
  raw?: { tokenUri?: string };
  contract?: { address?: string; name?: string; symbol?: string };
};

export function NFTCard() {
  const [nfts, setNfts] = useState<Array<NFT | NFTV3>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contract = "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e";
        const data = await getNFTsForCollection(contract, 10);
        setNfts((data.nfts || []).slice(0, 10)); // enforce max 10
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const getTokenId = (nft: NFT | NFTV3): string | undefined => {
    const v2 = nft as NFT;
    if (v2?.id?.tokenId) return v2.id.tokenId;
    const v3 = nft as NFTV3;
    return v3.tokenId;
  };

  const resolveImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${url.replace("ipfs://", "")}`;
    }
    return url;
  };

  const getImageUrl = (nft: NFT | NFTV3): string | undefined => {
    const v3 = nft as NFTV3;
    const v2 = nft as NFT;
    const rawUrl =
      v3.image?.cachedUrl ||
      v2.metadata?.image ||
      v3.tokenUri ||
      v3.raw?.tokenUri ||
      v2.tokenUri?.gateway ||
      v2.media?.[0]?.gateway ||
      v2.media?.[0]?.raw;
    return resolveImageUrl(rawUrl);
  };

  const getName = (nft: NFT | NFTV3): string | undefined => {
    const v3 = nft as NFTV3;
    const v2 = nft as NFT;
    return v3.name || v2.title || v2.metadata?.name;
  };

  const getDescription = (nft: NFT | NFTV3): string | undefined => {
    const v3 = nft as NFTV3;
    const v2 = nft as NFT;
    return v3.description || v2.metadata?.description;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {nfts &&
        nfts.map((nft, idx) => (
          <div
            key={`${nft.contract?.address || "unknown"}-${
              getTokenId(nft) || idx
            }`}
            className="min-h-[543px] max-w-[394px] px-2 border rounded-lg shadow"
          >
            {getImageUrl(nft) && (
              <Image
                src={getImageUrl(nft)!}
                alt={getName(nft) || "NFT"}
                width={300}
                height={300}
                className="w-full h-[261px] object-cover rounded-t-lg"
              />
            )}
            <div className="p-2">
              <p className="font-semibold">{getName(nft)}</p>
              <p className="text-sm text-gray-500 line-clamp-2">
                {getDescription(nft)}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
