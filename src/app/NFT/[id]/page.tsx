"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import {
  fadeIn,
  fadeInDown,
  fadeInUp,
  scaleOnHover,
  zoomIn,
} from "@/app/components/animations/motion";
import { getOwnersForToken } from "@/lib/getOwnersForToken";

type NFTV3 = {
  tokenId?: string;
  name?: string;
  description?: string;
  image?: { cachedUrl?: string; originalUrl?: string };
  tokenUri?: string;
  raw?: {
    tokenUri?: string;
    metadata?: { name?: string; description?: string; image?: string };
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

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const BASE_URL = `https://eth-mainnet.g.alchemy.com/nft/v3/${API_KEY}`;

async function fetchSingleNFT(
  contract: string,
  tokenId: string
): Promise<NFTV3 | null> {
  if (!API_KEY) return null;
  const url = `${BASE_URL}/getNFT?contractAddress=${contract}&tokenId=${tokenId}&withMetadata=true`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  // Alchemy v3 returns object at json.nft
  return json?.nft || json || null;
}

function resolveImageUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${url.replace("ipfs://", "")}`;
  }
  return url;
}

export default function NFTDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [nft, setNft] = useState<NFTV3 | null>(null);
  const [owners, setOwners] = useState<string[] | null>(null);
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { contract, tokenId } = useMemo(() => {
    // id format: `${address}-${rawTokenId}` where tokenId may be hex like 0x1a
    const raw = params?.id || "";
    const sep = raw.indexOf("-");
    if (sep === -1) return { contract: "", tokenId: "" };
    return {
      contract: raw.slice(0, sep),
      tokenId: decodeURIComponent(raw.slice(sep + 1)),
    };
  }, [params?.id]);

  useEffect(() => {
    const run = async () => {
      try {
        if (!contract || !tokenId) return;
        const [n, o] = await Promise.all([
          fetchSingleNFT(contract, tokenId),
          getOwnersForToken(contract, tokenId).catch(() => ({ owners: [] })),
        ]);
        setNft(n);
        setOwners(o?.owners || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [contract, tokenId]);

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
      } catch {}
    };
    fetchRate();
  }, []);

  const priceEth = nft?.contract?.openSeaMetadata?.floorPrice;
  const priceUsd =
    typeof priceEth === "number" && ethUsd ? priceEth * ethUsd : null;

  const displayName =
    nft?.name ||
    nft?.raw?.metadata?.name ||
    nft?.contract?.openSeaMetadata?.collectionName ||
    `${nft?.contract?.symbol || "NFT"} #${tokenId}`;

  const imageUrl =
    resolveImageUrl(nft?.image?.cachedUrl) ||
    resolveImageUrl(nft?.raw?.metadata?.image) ||
    resolveImageUrl(nft?.tokenUri) ||
    undefined;

  if (loading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto p-4 lg:px-12 md:px-8">
        <p className="opacity-70">Loading NFT…</p>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="w-full max-w-[1440px] mx-auto p-4 lg:px-12 md:px-8">
        <p className="opacity-70">NFT not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm underline opacity-80"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-[#140C1F] text-white">
      <div className="w-full max-w-[1440px] mx-auto p-4 lg:px-12 md:px-8">
        <motion.div
          className="grid lg:grid-cols-2 gap-8 items-start"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={zoomIn} className="w-full">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={displayName}
                width={800}
                height={800}
                className="w-full max-h-[600px] object-contain rounded-xl bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] p-4"
              />
            )}
          </motion.div>
          <div className="space-y-6">
            <motion.h1
              variants={fadeInDown}
              className="text-3xl md:text-5xl font-semibold"
            >
              {displayName}
            </motion.h1>
            <motion.p variants={fadeIn} className="opacity-80 leading-relaxed">
              {nft.description ||
                nft.raw?.metadata?.description ||
                nft.contract?.openSeaMetadata?.description ||
                "No description available."}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex items-center gap-4">
              {typeof priceEth === "number" && (
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/(eth).svg"
                    alt="ETH"
                    width={32}
                    height={32}
                  />
                  <div>
                    <div className="text-2xl font-medium">
                      {priceEth.toFixed(2)} ETH
                    </div>
                    {priceUsd && (
                      <div className="text-sm opacity-70">
                        ${" "}
                        {priceUsd.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-2">
              <div className="text-sm opacity-70">Contract</div>
              <div className="font-mono text-sm break-all">{contract}</div>
              <div className="text-sm opacity-70 mt-2">Token ID</div>
              <div className="font-mono text-sm break-all">{tokenId}</div>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-2">
              <div className="text-sm opacity-70">Owners</div>
              <div className="space-y-1">
                {(owners || []).slice(0, 5).map((o) => (
                  <div
                    key={o}
                    className="font-mono text-xs break-all opacity-90"
                  >
                    {o}
                  </div>
                ))}
                {owners && owners.length > 5 && (
                  <div className="text-xs opacity-60">
                    and {owners.length - 5} more…
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="pt-4 flex gap-4 flex-wrap"
            >
              <motion.button
                className="flex items-center justify-center text-center"
                variants={scaleOnHover}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
                <span className="button-48 px-8 lg:px-12 py-3 w-full">
                  <span className="text font-medium text-base lg:text-[20px]">
                    Buy
                  </span>
                </span>
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
              </motion.button>

              <motion.button
                className="flex items-center justify-center text-center"
                variants={scaleOnHover}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
                <span className="button-48 px-8 lg:px-12 py-3 w-full">
                  <span className="text font-medium text-base lg:text-[20px]">
                    Make Offer
                  </span>
                </span>
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
