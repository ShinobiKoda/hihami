"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  fadeInDown,
  fadeIn,
  fadeInUp,
  staggerChildren,
  scaleOnHover,
  overlayFade,
  zoomIn,
} from "../components/animations/motion";
import Image from "next/image";

const influencers = Array.from({ length: 8 }).map((_, i) => ({
  handle: `@creator${i + 1}`,
}));

const funFacts: string[] = [
  "Once minted an NFT of a potato that sold for 0.01 ETH and now signs emails as 'Root Asset Manager'.",
  "Claims their wallet password is 32 bytes of pure vibes (it isn’t, thankfully).",
  "Accidentally staked the wrong token and called it ‘yield farming in hard mode’.",
  "Creates pixel dragons at 3 AM and says they’re ‘gas-optimized companions’.",
  "Believes coffee is a Layer 0 scalability solution for creators.",
  "Has a dashboard tracking floor prices and the number of snacks left at home.",
  "Once tried to explain gas fees using pizza slices and started a food fight metaphor thread.",
  "Says ‘GM’ in five chains daily for cross‑community interoperability.",
];

interface SelectedInfluencer {
  index: number;
  handle: string;
  name: string;
}

export default function InfluencersPage() {
  const [selected, setSelected] = useState<SelectedInfluencer | null>(null);

  const close = useCallback(() => setSelected(null), []);

  // Close on Escape
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, close]);

  return (
    <div className="w-full min-h-screen bg-[#140C1F] text-white relative">
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
            return influencers.map((p, idx) => {
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
                  className="group rounded-[15px] bg-white/5 p-5 cursor-pointer border border-transparent hover:border-white/10 transition-colors duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40"
                  whileHover="hover"
                  whileTap="tap"
                  tabIndex={0}
                  onClick={() =>
                    setSelected({
                      index: idx,
                      handle: p.handle,
                      name: finalName,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected({
                        index: idx,
                        handle: p.handle,
                        name: finalName,
                      });
                    }
                  }}
                  aria-haspopup="dialog"
                  aria-label={`Open fun fact for ${finalName}`}
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

      {/* Fun Fact Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              variants={overlayFade}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="influencer-fact-title"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div
                variants={zoomIn}
                className="w-full max-w-md rounded-2xl bg-[#1E132C] border border-white/10 p-6 shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-purple-500/5 via-transparent to-fuchsia-400/5" />
                <button
                  onClick={close}
                  className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors text-sm"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
                <h2
                  id="influencer-fact-title"
                  className="text-xl font-semibold mb-2 flex items-center gap-2"
                >
                  {selected.name}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 font-normal tracking-wide">
                    Fun Fact
                  </span>
                </h2>
                <p className="text-sm leading-relaxed text-white/80">
                  {funFacts[selected.index % funFacts.length]}
                </p>
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    onClick={close}
                    className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
