"use client";
import { motion } from "motion/react";
import {
  fadeInDown,
  fadeIn,
  fadeInUp,
  staggerChildren,
  scaleOnHover,
} from "../components/animations/motion";
import Image from "next/image";

const auctionLots = [
  {
    image: "/images/bleeding-ghost-nft.svg",
    name: "Bleeding Ghost",
    alt: "Bleeding Ghost NFT",
    endsInMin: 24,
  },
  {
    image: "/images/living-of-the-art-nft.svg",
    name: "Living Of The Art",
    alt: "Living Of The Art NFT",
    endsInMin: 18,
  },
  {
    image: "/images/statue-of-vughae-nft.svg",
    name: "Statue of Vughae",
    alt: "Statue of Vughae NFT",
    endsInMin: 12,
  },
  {
    image: "/images/monkey-ape.svg",
    name: "Monkey Ape",
    alt: "Monkey Ape",
    endsInMin: 30,
  },
  {
    image: "/images/moon-fall.svg",
    name: "Moon Fall",
    alt: "Moon Fall",
    endsInMin: 9,
  },
  {
    image: "/images/wired-human.svg",
    name: "Wired Human",
    alt: "Wired Human",
    endsInMin: 6,
  },
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

export default function AuctionedPage() {
  return (
    <div className="w-full min-h-screen bg-[#140C1F] text-white">
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
            Auctioned NFTs
          </motion.h1>
          <motion.p className="opacity-60 mt-4 lg:text-xl" variants={fadeIn}>
            Live and recently closed auctions.
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
            return auctionLots.map((lot, i) => {
              const baseName = creatorNameFromSeed(lot.name);
              let finalName = baseName;
              if (baseName.startsWith("Crypto ")) {
                if (usedCrypto) {
                  const seed = seedFrom(lot.name);
                  const rest = baseName.replace(/^Crypto\s+/, "");
                  finalName = `${altAdjective(seed)} ${rest}`;
                } else {
                  usedCrypto = true;
                }
              }
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="rounded-[15px] bg-white/5 p-4"
                >
                  <div className="relative w-full h-40 bg-white/10 rounded-md overflow-hidden">
                    <Image
                      src={lot.image}
                      alt={lot.alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={i < 3}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{lot.name}</p>
                      <p className="text-sm opacity-70">
                        By {finalName} • Ends in {lot.endsInMin}m
                      </p>
                    </div>
                    <motion.button
                      className="items-center justify-center text-center"
                      variants={scaleOnHover}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <span className="w-[4.59px] h-[38px] bg-[#AD1AAF]"></span>
                      <span className="button-48 px-6 py-3">
                        <span className="text font-medium text-sm">
                          Place Bid
                        </span>
                      </span>
                      <span className="w-[4.59px] h-[38px] bg-[#AD1AAF]"></span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            });
          })()}
        </motion.div>
      </div>
    </div>
  );
}
