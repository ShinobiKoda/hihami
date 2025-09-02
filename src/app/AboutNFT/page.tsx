"use client";
import { motion } from "motion/react";
import {
  fadeInDown,
  fadeIn,
  staggerChildren,
} from "../components/animations/motion";

export default function AboutNFTPage() {
  return (
    <div className="w-full min-h-full text-white">
      <div className="w-full max-w-[1440px] mx-auto p-4 md:px-8 lg:px-12">
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
            About NFT
          </motion.h1>
          <motion.p className="opacity-60 mt-4 lg:text-xl" variants={fadeIn}>
            Learn what NFTs are, how they work, and why they matter for creators
            and collectors.
          </motion.p>
        </motion.div>
        <div className="prose prose-invert max-w-none mt-8 lg:mt-12">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
            What is an NFT?
          </h2>
          <p className="opacity-80">
            NFTs (Non‑Fungible Tokens) are unique digital assets recorded on a
            blockchain. They represent ownership of items like art, music,
            in‑game assets, and more.
          </p>
          <h2 className="text-2xl lg:text-3xl font-semibold mt-8 mb-4">
            How do NFTs work?
          </h2>
          <p className="opacity-80">
            Each NFT has a unique identifier stored on-chain, making it
            verifiable and tradable. Creators can mint NFTs and earn royalties
            on secondary sales.
          </p>
        </div>
      </div>
    </div>
  );
}
