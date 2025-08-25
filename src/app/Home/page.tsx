"use client";
import { Navbar } from "../components/layout/Navbar";
import Carousel3D from "../components/Carousel3D";
import CarouselHorizontal from "../components/CarouselHorizontal";
import Image from "next/image";
import { motion } from "motion/react";
import {
  fadeInDown,
  fadeIn,
  fadeInUp,
  staggerChildren,
  scaleOnHover,
  zoomIn,
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

const supportedWallets = [
  {
    image: "/images/alpha.svg",
    name: "Alpha",
  },
  {
    image: "/images/binance.svg",
    name: "Binance",
  },
  {
    image: "/images/coingecko.svg",
    name: "CoinGecko",
  },
  {
    image: "/images/metamask.svg",
    name: "MetaMask",
  },
  {
    image: "/images/trust-wallet.svg",
    name: "Trust Wallet",
  },
];

export default function HomePage() {
  return (
    <div className="w-full min-h-full bg-[#140C1F] text-white">
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

      <div className="w-full">
        <Image
          src="/images/milky-way.svg"
          alt="Milky Way Image"
          width={100}
          height={100}
          className="w-full"
        />
      </div>

      <div className="w-full max-w-[1440px] p-4 mx-auto text-center">
        <motion.h3
          className="font-normal lg:text-[25px] text-lg hidden lg:block bg-gradient-to-r from-[#AD1AAF] via-[#D946EF] to-[#6E56CF] bg-clip-text text-transparent"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Trade With the World&apos;s Most Trusted And Fastest Wallet
        </motion.h3>
        <motion.h2
          className="font-medium lg:text-[100px] text-4xl lg:mb-[100px] mb-10"
          variants={fadeInDown}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Wallets We Support
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-5 gap-[20px]"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {supportedWallets.map((wallet, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-[15px] flex flex-col gap-[34px] items-center justify-center bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] min-h-[322px]"
            >
              <motion.div
                className="w-[203px] h-[203px] p-10 rounded-full bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)]"
                variants={zoomIn}
              >
                <Image
                  src={wallet.image}
                  alt="Wallet Image"
                  width={100}
                  height={100}
                  className="w-full"
                />
              </motion.div>
              <motion.p className="font-medium text-xl" variants={fadeIn}>
                {wallet.name}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
