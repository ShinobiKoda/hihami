"use client";
import Link from "next/link";
import { motion } from "motion/react";
import {
  fadeInDown,
  fadeIn,
  fadeInUp,
  staggerChildren,
} from "../components/animations/motion";

export default function NFTBlogPage() {
  const posts = [
    { title: "Getting Started with NFTs", href: "#" },
    { title: "How to Evaluate a Collection", href: "#" },
    { title: "Creator Royalties Explained", href: "#" },
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
            NFT Blog
          </motion.h1>
          <motion.p className="opacity-60 mt-4 lg:text-xl" variants={fadeIn}>
            Guides, insights, and marketplace news.
          </motion.p>
        </motion.div>
        <motion.ul
          className="mt-10 space-y-4 max-w-2xl mx-auto"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {posts.map((p, i) => (
            <motion.li key={i} variants={fadeInUp}>
              <Link
                href={p.href}
                className="text-lg lg:text-xl text-[#D1C2D6] hover:text-white"
              >
                {p.title}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
