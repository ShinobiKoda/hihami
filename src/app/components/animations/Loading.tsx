"use client";

import { motion } from "motion/react";
import { Variants } from "motion/react";

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const pulse: Variants = {
  hidden: { opacity: 0.6 },
  visible: {
    opacity: 1,
    transition: { duration: 1, repeat: Infinity, repeatType: "reverse" },
  },
};

type LoadingProps = {
  // Number of skeleton cards to render (defaults to 8 for a 4x2 feel on xl)
  count?: number;
};

export default function Loading({ count = 8 }: LoadingProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          variants={card}
          className="min-h-[543px] max-w-[394px] p-2 rounded-lg bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] flex h-full justify-between flex-col"
        >
          <div>
            {/* Image placeholder */}
            <motion.div
              variants={pulse}
              className="w-full h-[261px] rounded-lg overflow-hidden bg-white/10"
            />

            {/* Title row */}
            <div className="mt-[31px] px-6 flex items-center gap-4">
              <motion.div
                variants={pulse}
                className="w-10 h-10 rounded-full bg-white/70"
              />
              <div className="flex-1 space-y-2">
                <motion.div
                  variants={pulse}
                  className="h-5 w-2/3 rounded bg-white/20"
                />
                <motion.div
                  variants={pulse}
                  className="h-3 w-1/3 rounded bg-white/10"
                />
              </div>
            </div>

            {/* Price row */}
            <div className="mt-4 px-6 w-full flex justify-end">
              <div className="flex items-center gap-2">
                <motion.div
                  variants={pulse}
                  className="w-10 h-10 rounded bg-white/15"
                />
                <div className="space-y-1">
                  <motion.div
                    variants={pulse}
                    className="h-4 w-24 rounded bg-white/20"
                  />
                  <motion.div
                    variants={pulse}
                    className="h-3 w-20 rounded bg-white/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Button skeleton */}
          <motion.div
            variants={pulse}
            className="flex items-center justify-center text-center w-full"
          >
            <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]/60"></span>
            <span className="px-8 lg:px-12 py-2 w-full rounded relative overflow-hidden border border-[#AD1AAF]/60">
              <span className="block h-5 w-24 mx-auto rounded bg-white/20" />
            </span>
            <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]/60"></span>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
