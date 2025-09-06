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

const influencers = Array.from({ length: 8 }).map((_, i) => ({
  handle: `@creator${i + 1}`,
}));

export default function InfluencersPage() {
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
            Influencers
          </motion.h1>
          <motion.p className="opacity-60 mt-4 lg:text-xl" variants={fadeIn}>
            Meet the creators shaping the space.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {(() => {
            let usedCrypto = false;
            return influencers.map((p) => {
              const baseName = creatorNameFromSeed(p.handle);
              let finalName = baseName;
              if (baseName.startsWith("Crypto ")) {
                if (usedCrypto) {
                  const s = seedFrom(p.handle);
                  const rest = baseName.replace(/^Crypto\s+/, "");
                  finalName = `${altAdjective(s)} ${rest}`;
                } else {
                  usedCrypto = true;
                }
              }
              return (
                <motion.div
                  key={p.handle}
                  variants={fadeInUp}
                  className="group rounded-[15px] bg-white/5 p-5 cursor-pointer border border-transparent hover:border-white/10 transition-colors duration-300 backdrop-blur-sm"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.div
                    variants={scaleOnHover}
                    className="w-24 h-24 rounded-full bg-white/10 mx-auto overflow-hidden relative group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-shadow"
                  >
                    <Image
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
                        seedFrom(p.handle)
                      )}`}
                      alt={`${p.handle} avatar`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="text-center mt-4">
                    <p className="font-semibold group-hover:text-purple-300 transition-colors">
                      {finalName}
                    </p>
                    <p className="text-sm opacity-70 group-hover:opacity-90 transition-opacity">
                      {p.handle}
                    </p>
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

function seedFrom(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (h * 33) ^ text.charCodeAt(i);
  return Math.abs(h).toString(36);
}

function creatorNameFromSeed(handle: string): string {
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
  const seed = seedFrom(handle);
  // Simple hash into indices
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
