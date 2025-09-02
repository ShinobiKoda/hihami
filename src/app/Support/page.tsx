"use client";
import { motion } from "motion/react";
import {
  fadeInDown,
  fadeIn,
  fadeInUp,
  staggerChildren,
} from "../components/animations/motion";

export default function SupportPage() {
  const faqs = [
    {
      q: "How do I create a wallet?",
      a: "Use a wallet like MetaMask or Trust Wallet and connect it on HIHAMI.",
    },
    {
      q: "How do I mint an NFT?",
      a: "Navigate to your profile and follow the mint flow (coming soon).",
    },
    {
      q: "What are gas fees?",
      a: "Network fees paid to validators; varies by chain congestion.",
    },
  ];
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
            Help & Support
          </motion.h1>
          <motion.p className="opacity-60 mt-4 lg:text-xl" variants={fadeIn}>
            FAQs and quick tips to get you unstuck.
          </motion.p>
        </motion.div>
        <motion.div
          className="mt-10 max-w-3xl mx-auto space-y-6"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="rounded-xl border border-white/10 p-5 bg-white/5"
            >
              <h3 className="text-xl font-semibold">{f.q}</h3>
              <p className="opacity-80 mt-2">{f.a}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
