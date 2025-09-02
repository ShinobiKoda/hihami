"use client";
import { motion } from "motion/react";
import {
  fadeInDown,
  fadeIn,
  staggerChildren,
} from "../components/animations/motion";

export default function ActivityPage() {
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
            Activity
          </motion.h1>
          <motion.p className="opacity-60 mt-4 lg:text-xl" variants={fadeIn}>
            Track marketplace sales, listings, and transfers.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
