"use client";

import { useEffect, useState } from "react";
import { getNFTsForCollection } from "@/lib/getNFTCollection";
import { NFT } from "@/types/type";
import Image from "next/image";

type NFTV3 = {
  tokenId?: string;
  name?: string;
  description?: string;
  image?: { cachedUrl?: string; originalUrl?: string };
  tokenUri?: string;
  raw?: {
    tokenUri?: string;
    metadata?: { name?: string; description?: string };
  };
  contract?: {
    address?: string;
    name?: string;
    symbol?: string;
    openSeaMetadata?: {
      collectionName?: string;
      floorPrice?: number;
      description?: string;
    };
  };
};

export function NFTCard() {
  const [nfts, setNfts] = useState<Array<NFT | NFTV3>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ethUsd, setEthUsd] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contracts = [
          "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", // BAYC
          "0xed5af388653567af2f388e6224dc7c4b3241c544", // Azuki
          "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e", // Doodles
        ];

        const results = await Promise.all(
          contracts.map((addr) => getNFTsForCollection(addr, 5)) // 5 NFTs per collection
        );

        const mixed = results.flatMap((res) => res.nfts || []);
        const shuffled = mixed.sort(() => Math.random() - 0.5);

        setNfts(shuffled);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch ETH -> USD rate once for conversion
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        if (!res.ok) return;
        const json = await res.json();
        const rate = json?.ethereum?.usd;
        if (typeof rate === "number" && isFinite(rate)) setEthUsd(rate);
      } catch {
        // ignore rate errors; USD row will be hidden
      }
    };
    fetchRate();
  }, []);

  const getTokenId = (nft: NFT | NFTV3): string | undefined => {
    const v2 = nft as NFT;
    if (v2?.id?.tokenId) return v2.id.tokenId;
    const v3 = nft as NFTV3;
    return v3.tokenId;
  };

  const formatTokenId = (tokenId?: string): string | undefined => {
    if (!tokenId) return undefined;
    const t = tokenId.toString();
    if (t.startsWith("0x")) {
      try {
        return parseInt(t, 16).toString();
      } catch {
        return t;
      }
    }
    return t.replace(/^0+(\d)/, "$1");
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
    const direct =
      v3.name || v2.title || v2.metadata?.name || v3.raw?.metadata?.name;
    if (direct && direct.trim().length > 0) return direct;

    const collection = v3.contract?.openSeaMetadata?.collectionName;
    const contractName = v3.contract?.name || v2.contractMetadata?.name;
    const symbol = v3.contract?.symbol || v2.contractMetadata?.symbol;
    const shortAddr = v3.contract?.address?.slice(0, 6);
    const tid = formatTokenId(getTokenId(nft));

    const base = collection || contractName || symbol || shortAddr;
    if (base && tid) return `${base} #${tid}`;
    if (base) return base;
    if (tid) return `NFT #${tid}`;
    return "NFT";
  };

  const getDisplayName = (nft: NFT | NFTV3): string => {
    const name = getName(nft) || "NFT";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0]}…` : name;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {nfts.map((nft, idx) => {
        const priceEth = (nft as NFTV3).contract?.openSeaMetadata?.floorPrice;
        const hasEth = typeof priceEth === "number" && isFinite(priceEth);
        const priceUsd =
          hasEth && ethUsd !== null ? priceEth! * ethUsd : undefined;
        return (
          <div
            key={`${nft.contract?.address || "unknown"}-${
              getTokenId(nft) || idx
            }`}
            className="min-h-[543px] max-w-[394px] p-2 rounded-lg shadow bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)]"
          >
            {getImageUrl(nft) && (
              <Image
                src={getImageUrl(nft)!}
                alt={getName(nft) || "NFT"}
                width={300}
                height={300}
                className="w-full h-[261px] object-cover rounded-lg"
              />
            )}
            <div className="mt-[31px] px-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Image
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=z"
                  alt="Avatar Image"
                  width={100}
                  height={100}
                  className="w-full"
                />
              </div>
              <p className="font-semibold truncate flex flex-col">
                <span className="font-normal lg:text-[25px] text-lg">
                  {getDisplayName(nft)}
                </span>
                <span className="font-regular text-sm">By John Smith</span>
              </p>
            </div>
            {hasEth && (
              <div className="mt-4 px-6">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/(eth).svg"
                    alt="Eth Image"
                    width={40}
                    height={40}
                  />
                  <div className="">
                    <p className="font-normal text-xl">{priceEth!.toFixed(2)} ETH</p>
                    {priceUsd !== undefined && (
                      <div className="text-sm text-gray-300 font-normal">{`$ ${priceUsd.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 }
                      )}`}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
