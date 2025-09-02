"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  fadeIn,
  fadeInUp,
  staggerChildren,
  zoomIn,
  scaleOnHover,
} from "./animations/motion";
import Loading from "./animations/Loading";

type LocalNFT = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: { eth: number };
  contract: { address: string; name?: string; symbol?: string };
  token: { id: string };
  owner?: { address?: string; username?: string };
  creator?: { address?: string; username?: string };
};

function seedFrom(nft: LocalNFT): string {
  const input = `${nft.contract.address.toLowerCase()}-${nft.token.id}`;
  let h = 5381; // djb2
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(h >>> 0).toString(36);
}



const DEFAULT_ETH_USD = 3000; // fallback if no env provided
const ETH_USD_RATE = Number(process.env.NEXT_PUBLIC_ETH_USD) || DEFAULT_ETH_USD;

export function NFTCard() {
  const [nfts, setNfts] = useState<LocalNFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/data/NFT.json", { cache: "no-store" });
        const json = (await res.json()) as LocalNFT[];
        setNfts(json);
      } catch (e) {
        console.error("Failed to load local NFTs", e);
        setNfts([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <Loading />;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {nfts.map((nft) => {
        const href = `/NFT/${nft.contract.address}-${encodeURIComponent(
          nft.token.id
        )}`;
        const ownerName = nft.owner?.username || "Owner";
        const seed = seedFrom(nft);
        const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
          seed
        )}`;
        const priceUsd =
          typeof nft.price?.eth === "number" && isFinite(nft.price.eth)
            ? nft.price.eth * ETH_USD_RATE
            : undefined;
        return (
          <motion.div
            key={`${nft.contract.address}-${nft.token.id}`}
            className="min-h-[543px] max-w-[394px] p-2 rounded-lg shadow bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] flex h-full justify-between flex-col"
            variants={fadeInUp}
          >
            <div>
              {nft.image && (
                <motion.div variants={zoomIn}>
                  <Link href={href} aria-label={nft.name}>
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      width={300}
                      height={300}
                      className="w-full h-[261px] object-cover rounded-lg"
                    />
                  </Link>
                </motion.div>
              )}
              <motion.div
                className="mt-[31px] px-6 flex items-center gap-4"
                variants={fadeIn}
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Image
                    src={avatarUrl}
                    alt={`Avatar for ${ownerName}`}
                    width={100}
                    height={100}
                    className="w-full"
                  />
                </div>
                <Link
                  href={href}
                  className="font-semibold truncate flex flex-col"
                >
                  <span className="font-normal lg:text-[25px] text-lg">
                    {nft.name}
                  </span>
                  <span className="font-regular text-sm">By {ownerName}</span>
                </Link>
              </motion.div>
              {typeof nft.price?.eth === "number" &&
                isFinite(nft.price.eth) && (
                  <motion.div className="mt-4 px-6 w-full" variants={fadeIn}>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/(eth).svg"
                        alt="Eth"
                        width={40}
                        height={40}
                      />
                      <div>
                        <p className="font-normal text-xl">
                          {nft.price.eth.toFixed(2)} ETH
                        </p>
                        {priceUsd !== undefined && (
                          <div className="text-sm text-gray-300 font-normal">
                            ${" "}
                            {priceUsd.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
            </div>
            <Link href={href} className="w-full">
              <motion.div
                className="flex items-center justify-center text-center w-full"
                variants={scaleOnHover}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
                <span className="button-48 px-8 lg:px-12 py-2 w-full">
                  <span className="text font-medium text-lg">View Details</span>
                </span>
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
