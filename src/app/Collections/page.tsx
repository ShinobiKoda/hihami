"use client";
import Link from "next/link";
import { motion } from "motion/react";
import {
  fadeInDown,
  fadeIn,
  fadeInUp,
  staggerChildren,
} from "../components/animations/motion";

export default function CollectionsPage() {
  const cols = [
    { name: "Genesis Drops", href: "/Explore" },
    { name: "Top Trending", href: "/Trending" },
    { name: "Editor’s Picks", href: "/Explore" },
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
            Collections
          </motion.h1>
          <motion.p className="opacity-60 mt-4 lg:text-xl" variants={fadeIn}>
            Browse curated and trending collections.
          </motion.p>
        </motion.div>
        <motion.ul
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {cols.map((c, i) => (
            <motion.li
              key={i}
              variants={fadeInUp}
              className="rounded-xl border border-white/10 p-5 bg-white/5"
            >
              <Link
                href={c.href}
                className="text-lg lg:text-xl text-[#D1C2D6] hover:text-white"
              >
                {c.name}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
