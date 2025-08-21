"use client";
import { motion } from "motion/react";
import { fadeInUp, staggerChildren } from "@/app/components/animations/motion";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-white text-black flex items-center justify-center">
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.h1 className="text-4xl font-bold" variants={fadeInUp}>
          Homepage
        </motion.h1>
        <motion.p className="text-gray-600 mt-2" variants={fadeInUp}>
          Welcome to Enefty
        </motion.p>
      </motion.div>
    </div>
  );
}
