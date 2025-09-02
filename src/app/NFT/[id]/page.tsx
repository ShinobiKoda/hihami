"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import Breadcrumb from "@/app/components/layout/Breadcrumb";
import {
  fadeIn,
  fadeInDown,
  fadeInUp,
  scaleOnHover,
  zoomIn,
} from "@/app/components/animations/motion";
import { HashLoader, ClipLoader } from "react-spinners";

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

function truncateMiddle(value: string, front: number = 6, back: number = 6) {
  if (!value) return "";
  if (value.length <= front + back + 1) return value;
  return `${value.slice(0, front)}…${value.slice(-back)}`;
}

const DEFAULT_ETH_USD = 3000; // fallback if no env provided
const ETH_USD_RATE = Number(process.env.NEXT_PUBLIC_ETH_USD) || DEFAULT_ETH_USD;

export default function NFTDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [nft, setNft] = useState<LocalNFT | null>(null);
  const [owners, setOwners] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  const { contract, tokenId } = useMemo(() => {
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
        const res = await fetch("/data/NFT.json", { cache: "no-store" });
        const json = (await res.json()) as LocalNFT[];
        const found = json.find(
          (x) =>
            x.contract.address.toLowerCase() === contract.toLowerCase() &&
            x.token.id === tokenId
        );
        setNft(found || null);
        setOwners(found?.owner?.address ? [found.owner.address] : []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [contract, tokenId]);

  const priceEth = nft?.price?.eth;
  const priceUsd =
    typeof priceEth === "number" && isFinite(priceEth)
      ? priceEth * ETH_USD_RATE
      : undefined;

  const displayName = nft
    ? `${nft.name}`
    : `${contract.slice(0, 6)}…${contract.slice(-4)} #${tokenId}`;

  const truncatedName =
    displayName && displayName.length > 36
      ? `${displayName.slice(0, 36)}…`
      : displayName;

  const imageUrl = nft?.image || undefined;

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#140C1F] text-white flex items-center">
        <div className="w-full max-w-[1440px] mx-auto p-4 lg:px-12 md:px-8 flex justify-center">
          <HashLoader color="#AD1AAF" aria-label="Loading NFT" />
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="w-full min-h-screen bg-[#140C1F] text-white">
        <div className="w-full max-w-[1440px] mx-auto p-4 lg:px-12 md:px-8">
          <p className="opacity-80">NFT not found.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm underline opacity-80"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#140C1F] text-white">
      <div className="w-full max-w-[1440px] mx-auto p-4 lg:px-12 md:px-8 lg:mt-10">
        <Breadcrumb
          className="mb-4"
          items={[
            { label: "Home", href: "/Home" },
            {
              label: truncatedName || "NFT",
              tooltip: displayName || undefined,
            },
          ]}
        />
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
                className="w-full max-h-[600px] object-contain rounded-xl  p-4"
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
              {nft?.description || "No description available."}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex items-center gap-4">
              {typeof priceEth === "number" && isFinite(priceEth) && (
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
                    {priceUsd !== undefined && (
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
              <div className="font-mono text-sm break-all">
                {truncateMiddle(contract)}
              </div>
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
                    {truncateMiddle(o)}
                  </div>
                ))}
                {owners && owners.length > 5 && (
                  <div className="text-xs opacity-60">
                    and {owners.length - 5} more…
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="pt-4 w-full">
              <motion.button
                onClick={async () => {
                  if (buying) return;
                  setBuying(true);
                  try {
                    await new Promise((r) => setTimeout(r, 1500));
                  } finally {
                    setBuying(false);
                  }
                }}
                disabled={buying}
                className={`flex items-center justify-center text-center w-full max-w-sm disabled:cursor-not-allowed ${
                  buying ? "opacity-80 cursor-not-allowed" : ""
                }`}
                variants={scaleOnHover}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
                <span className="button-48 px-8 lg:px-12 py-3 w-full">
                  <span className="text font-medium text-base lg:text-[20px] flex items-center justify-center gap-2">
                    {buying ? (
                      <>
                        Buying
                        <ClipLoader size={16} color="#ffffff" />
                      </>
                    ) : (
                      <>Buy Now</>
                    )}
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
