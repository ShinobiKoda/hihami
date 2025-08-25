"use client";
import { Navbar } from "../components/layout/Navbar";
import Carousel3D from "../components/Carousel3D";
import CarouselHorizontal from "../components/CarouselHorizontal";
import { motion } from "motion/react";
import {
  fadeInDown,
  fadeIn,
  fadeInUp,
  staggerChildren,
  scaleOnHover,
} from "../components/animations/motion";

const nfts = [
  {
    image: "/images/bleeding-ghost-nft.svg",
    name: "Bleeding Ghost",
    alt: "Bleeding Ghost NFT",
    price: 152793.17,
  },
  {
    image: "/images/living-of-the-art-nft.svg",
    name: "Living Of The Art",
    alt: "Living of the art NFT",
    price: 543576.13,
  },
  {
    image: "/images/statue-of-vughae-nft.svg",
    name: "Statue of Vughae",
    alt: "Statue of vughae NFT",
    price: 452968.17,
  },
];

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[#140C1F] text-white">
      <Navbar />

      <div className="w-full max-w-[1440px] mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <motion.div
            className="w-full max-w-[718px] lg:mt-[147px]"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="lg:text-[64px] font-semibold text-3xl mb-10"
              variants={fadeInDown}
            >
              EXPLORE, CREATE AND <br />
              SELL YOUR NFT&apos;S ON <br />
              HIHAMI
            </motion.h1>
            <motion.p
              className="font-light lg:text-[25px] text-base lg:mb-[60px] mb-10 opacity-50"
              variants={fadeIn}
            >
              Hihami is the World&apos; First and Largest NFT/Avatar Marketplace
            </motion.p>
            <motion.div
              className="flex items-center gap-10"
              variants={fadeInUp}
            >
              <motion.button
                className="flex items-center justify-center text-center"
                variants={scaleOnHover}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
                <span className="border px-8 py-4 bg-[#AD1AAF] border-[#AD1AAF] text-center flex items-center justify-center font-medium lg:text-[22px] text-base">
                  Explore More
                </span>
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
              </motion.button>
              <motion.button
                className="flex items-center justify-center text-center"
                variants={scaleOnHover}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
                <span className="px-8 lg:px-12 py-4 border border-[#AD1AAF] text-center flex items-center justify-center font-medium text-base lg:text-[22px]">
                  Create
                </span>
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            className="mt-10 block lg:hidden"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <CarouselHorizontal items={nfts} />
          </motion.div>
          <motion.div
            className="mt-10 lg:mt-[257px] hidden lg:block"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <Carousel3D items={nfts} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
