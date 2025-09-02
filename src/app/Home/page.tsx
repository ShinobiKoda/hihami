"use client";
import Carousel3D from "../components/Carousel3D";
import CarouselHorizontal from "../components/CarouselHorizontal";
import Coverflow from "../components/Coverflow";
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
import { TfiWallet } from "react-icons/tfi";
import { BsCollection } from "react-icons/bs";
import { MdOutlineHexagon } from "react-icons/md";
import { MdAddToPhotos } from "react-icons/md";
import { NFTCard } from "../components/NFTCard";

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

const nftCollection = [
  {
    name: "Monkey Ape",
    image: "/images/monkey-ape.svg",
    alt: "Monkey Ape NFT",
  },
  {
    name: "Moon Fall",
    image: "/images/moon-fall.svg",
    alt: "Moon Fall NFT",
  },
  {
    name: "Racer to Go",
    image: "/images/racer-to-go.svg",
    alt: "Racer to Go NFT",
  },
  {
    name: "Sleeping Beauty",
    image: "/images/sleeping-beauty.svg",
    alt: "Sleeping Beauty NFT",
  },
  {
    name: "Statue of Vughae",
    image: "/images/statue-of-vughae.svg",
    alt: "Statue of Vughae",
  },
  {
    name: "Swagger Ape",
    image: "/images/swagger-ape.svg",
    alt: "Swagger Ape NFT",
  },
  {
    name: "Wired Human",
    image: "/images/wired-human.svg",
    alt: "Wired Human NFT",
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
      <div className="w-full max-w-[1440px] mx-auto p-4 lg:px-12 md:px-8">
        <div className="grid xl:grid-cols-2 gap-8 lg:gap-12 items-start">
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
              className="flex flex-col
               gap-6 lg:gap-10 w-full sm:flex-row max-w-xl"
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
                <span className="border px-8 py-4 bg-[#AD1AAF] border-[#AD1AAF] text-center flex items-center justify-center font-medium lg:text-[22px] text-base text-nowrap w-full">
                  EXPLORE
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
                <span className="button-48 px-8 lg:px-12 py-4 w-full">
                  <span className="text font-medium text-base lg:text-[22px]">
                    Create
                  </span>
                </span>
                <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            className="mt-10 block xl:hidden"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <CarouselHorizontal items={nfts} />
          </motion.div>
          <motion.div
            className="mt-10 lg:mt-[257px] hidden xl:block"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <Carousel3D items={nfts} />
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] p-4 mx-auto text-center mt-20 lg:px-12 md:px-8">
        <motion.h3
          className="font-normal lg:text-[25px] text-lg bg-gradient-to-r from-[#AD1AAF] via-[#D946EF] to-[#6E56CF] bg-clip-text text-transparent mb-24 lg:mb-32"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Trade With the World&apos;s Most Trusted And Fastest Wallet
        </motion.h3>
        <motion.h2
          className="font-medium lg:text-[64px] text-4xl lg:mb-[50px] mb-10"
          variants={fadeInDown}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Wallets We Support
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[20px]"
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

      <div className="mt-10 lg:mt-20 w-full max-w-[1440px] mx-auto p-4 lg:px-12 md:px-8">
        <motion.h2
          className="w-full text-center font-medium text-4xl lg:text-[64px] mb-16"
          variants={fadeInDown}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          How it Works
        </motion.h2>
        <motion.div
          className="flex flex-col xl:flex-row items-center justify-between gap-[80px]"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className="space-y-[30px] flex flex-col items-center"
            variants={fadeInUp}
          >
            <div className="w-[106px] h-[106px] rounded-full bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] flex items-center justify-center">
              <TfiWallet size={48} color="#F81DFB" />
            </div>
            <p className="text-center font-normal text-2xl">
              Set Up Your Wallet
            </p>
          </motion.div>
          <motion.div variants={fadeInDown}>
            <Image
              src="/images/how-it-works-arrow.svg"
              alt="Arrow"
              width={100}
              height={100}
              className="max-w-[166px] rotate-90 xl:rotate-0 transition-transform"
            />
          </motion.div>
          <motion.div
            className="space-y-[30px] flex flex-col items-center"
            variants={fadeInUp}
          >
            <div className="w-[106px] h-[106px] rounded-full bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] flex items-center justify-center">
              <BsCollection size={48} color="#F81DFB" />
            </div>
            <p className="text-center font-normal text-2xl">
              Create Your Collection
            </p>
          </motion.div>
          <motion.div variants={fadeInDown}>
            <Image
              src="/images/how-it-works-arrow.svg"
              alt="Arrow"
              width={100}
              height={100}
              className="max-w-[166px] rotate-90 xl:rotate-0 transition-transform"
            />
          </motion.div>
          <motion.div
            className="space-y-[30px] flex flex-col items-center"
            variants={fadeInUp}
          >
            <div className="w-[106px] h-[106px] rounded-full bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] flex items-center justify-center">
              <MdAddToPhotos size={48} color="#F81DFB" />
            </div>
            <p className="text-center font-normal text-2xl">Add Your NFTs</p>
          </motion.div>
          <motion.div variants={fadeInDown}>
            <Image
              src="/images/how-it-works-arrow.svg"
              alt="Arrow"
              width={100}
              height={100}
              className="max-w-[166px] rotate-90 xl:rotate-0 transition-transform"
            />
          </motion.div>
          <motion.div
            className="space-y-[30px] flex flex-col items-center"
            variants={fadeInUp}
          >
            <div className="w-[106px] h-[106px] rounded-full bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] flex items-center justify-center">
              <MdOutlineHexagon size={48} color="#F81DFB" />
            </div>
            <p className="text-center font-normal text-2xl">
              List them For Sale
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-10 lg:mt-20 p-4 lg:px-12 md:px-8">
        <h3 className="bg-[linear-gradient(90.126deg,#FFFFFF_0%,#F81DFB_100%)] bg-clip-text text-transparent font-medium text-2xl md:text-3xl text-center lg:my-32 my-24">
          Explore Our Newly Released NFT Collection
        </h3>
        <div>
          <h2 className="w-full text-center font-medium text-4xl lg:text-[64px] mb-16">
            Our Collection
          </h2>
          <div className="xl:hidden">
            <CarouselHorizontal
              items={nftCollection}
              intervalMs={3000}
              className="px-2"
              glossy={false}
            />
          </div>
          <div className="hidden xl:block">
            <Coverflow items={nftCollection} className="px-4" />
          </div>
        </div>
      </div>

      <div className="mt-10 lg:mt-20 p-4 lg:px-12 md:px-8 w-full max-w-[1440px] mx-auto">
        <div className="w-full flex items-center justify-between ">
          <div>
            <h3 className="font-light text-base lg:text-[25px]">
              Most Loved NFTs of The Time
            </h3>
            <h2 className="font-medium text-4xl lg:text-[64px] mb-16">
              Hot Trending NFTs
            </h2>
          </div>

          <motion.button
            className="items-center justify-center text-center hidden lg:flex"
            variants={scaleOnHover}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
            <span className="button-48 px-8 lg:px-12 py-4 w-full">
              <span className="text font-medium text-base lg:text-[22px]">
                View All
              </span>
            </span>
            <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
          </motion.button>
        </div>
        <NFTCard />
        <div className="w-full flex items-center justify-center">
          <motion.button
            className="flex items-center justify-center text-center lg:hidden mt-10"
            variants={scaleOnHover}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
            <span className="button-48 px-8 lg:px-12 py-4 w-full">
              <span className="text font-medium text-base lg:text-[22px]">
                View All
              </span>
            </span>
            <span className="w-[4.59px] h-[42.6px] bg-[#AD1AAF]"></span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
