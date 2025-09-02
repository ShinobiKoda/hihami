"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  fadeInDown,
  fadeIn,
  fadeInUp,
  staggerChildren,
  scaleOnHover,
  zoomIn,
} from "../components/animations/motion";
import Image from "next/image";

const exploreNfts = [
  {
    image: "/images/bleeding-ghost-nft.svg",
    name: "Bleeding Ghost",
    alt: "Bleeding Ghost NFT",
  },
  {
    image: "/images/living-of-the-art-nft.svg",
    name: "Living Of The Art",
    alt: "Living of the art NFT",
  },
  {
    image: "/images/statue-of-vughae-nft.svg",
    name: "Statue of Vughae",
    alt: "Statue of Vughae NFT",
  },
  { image: "/images/monkey-ape.svg", name: "Monkey Ape", alt: "Monkey Ape" },
  { image: "/images/moon-fall.svg", name: "Moon Fall", alt: "Moon Fall" },
  { image: "/images/racer-to-go.svg", name: "Racer to Go", alt: "Racer to Go" },
  {
    image: "/images/sleeping-beauty.svg",
    name: "Sleeping Beauty",
    alt: "Sleeping Beauty",
  },
  {
    image: "/images/swagger-ape.svg",
    name: "Swagger Ape",
    alt: "Swagger Ape",
  },
  { image: "/images/wired-human.svg", name: "Wired Human", alt: "Wired Human" },
];

function seedFrom(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (h * 33) ^ text.charCodeAt(i);
  return Math.abs(h).toString(36);
}

function creatorNameFromSeed(name: string): string {
  const adjectives = [
    "Neon",
    "Quantum",
    "Pixel",
    "Crypto",
    "Aether",
    "Chain",
    "Meta",
    "Arcane",
    "Nova",
    "Lunar",
  ];
  const nouns = [
    "Artist",
    "Ape",
    "Wizard",
    "Samurai",
    "Ghost",
    "Shogun",
    "Voyager",
    "Nomad",
    "Smith",
    "Crafter",
  ];
  const seed = seedFrom(name);
  let a = 0,
    b = 0;
  for (let i = 0; i < seed.length; i++) {
    const code = seed.charCodeAt(i);
    if (i % 2 === 0) a = (a + code) % adjectives.length;
    else b = (b + code) % nouns.length;
  }
  const num = (seed.charCodeAt(0) + seed.charCodeAt(seed.length - 1)) % 999;
  return `${adjectives[a]} ${nouns[b]} #${(num + 1)
    .toString()
    .padStart(3, "0")}`;
}

function altAdjective(seed: string): string {
  const adjectives = [
    "Neon",
    "Quantum",
    "Pixel",
    "Crypto",
    "Aether",
    "Chain",
    "Meta",
    "Arcane",
    "Nova",
    "Lunar",
  ];
  const cryptoIndex = 3;
  const sum = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  let idx = sum % adjectives.length;
  if (idx === cryptoIndex) idx = (idx + 1) % adjectives.length;
  return adjectives[idx];
}

export default function ExplorePage() {
  const [permalinksByImage, setPermalinksByImage] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/data/NFT.json", { cache: "force-cache" });
        const data = (await res.json()) as Array<{
          image: string;
          links?: { permalink?: string };
          contract: { address: string };
          token: { id: string };
        }>;
        if (cancelled) return;
        const map: Record<string, string> = {};
        for (const n of data) {
          const fallback = `/NFT/${n.contract.address}-${encodeURIComponent(
            n.token.id
          )}`;
          map[n.image] = n.links?.permalink || fallback;
        }
        setPermalinksByImage(map);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className="w-full min-h-full bg-[#140C1F] text-white">
      <div className="w-full max-w-[1440px] mx-auto p-4 lg:px-12 md:px-8">
        <motion.div
          className="w-full text-center mt-10 lg:mt-20"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="font-semibold text-4xl lg:text-[64px]"
            variants={fadeInDown}
          >
            Explore NFTs
          </motion.h1>
          <motion.p className="opacity-60 mt-4 lg:text-xl" variants={fadeIn}>
            Discover collections, creators, and trending assets.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {(() => {
            let usedCrypto = false;
            return exploreNfts.map((item, i) => {
              const href = permalinksByImage[item.image];
              const baseName = creatorNameFromSeed(item.name);
              let finalName = baseName;
              if (baseName.startsWith("Crypto ")) {
                if (usedCrypto) {
                  const seed = seedFrom(item.name);
                  const rest = baseName.replace(/^Crypto\s+/, "");
                  finalName = `${altAdjective(seed)} ${rest}`;
                } else {
                  usedCrypto = true;
                }
              }
              const Card = (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-[15px] bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] p-4"
                >
                  <motion.div
                    variants={zoomIn}
                    className="relative w-full h-44 rounded-md overflow-hidden bg-white/5"
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={i < 3}
                    />
                  </motion.div>
                  <div className="mt-4">
                    <p className="font-medium text-lg">{item.name}</p>
                    <p className="text-sm opacity-70">By {finalName}</p>
                  </div>
                  <motion.button
                    className="mt-4 items-center justify-center text-center w-full"
                    variants={scaleOnHover}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
                    <span className="button-48 px-8 lg:px-12 py-3 w-full">
                      <span className="text font-medium text-base lg:text-[18px]">
                        View Details
                      </span>
                    </span>
                    <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
                  </motion.button>
                </motion.div>
              );

              return href ? (
                <Link
                  key={`l-${i}`}
                  href={href}
                  prefetch={false}
                  className="block"
                  aria-label={`View ${item.name}`}
                >
                  {Card}
                </Link>
              ) : (
                Card
              );
            });
          })()}
        </motion.div>
      </div>
    </div>
  );
}
