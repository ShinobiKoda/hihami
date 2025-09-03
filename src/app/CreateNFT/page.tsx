"use client";
import { lato } from "../font";
import Image from "next/image";
import { FaEthereum } from "react-icons/fa";
import { motion } from "motion/react";
import {
  fadeInDown,
  fadeIn,
  fadeInUp,
  staggerChildren,
  zoomIn,
  scaleOnHover,
} from "../components/animations/motion";

export default function CreateNFT() {
  return (
    <div className="w-full text-white max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 mt-10 lg:mt-20">
      <motion.div
        className="text-center space-y-8 mb-10"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="font-medium text-4xl lg:text-[64px]"
          variants={fadeInDown}
        >
          Create Your Own MasterPiece
        </motion.h2>
        <motion.p
          className={`${lato.className} text-base lg:text-lg opacity-50`}
          variants={fadeIn}
        >
          Get Onboard And Earn Money Like a Pro
        </motion.p>
      </motion.div>

      <motion.div
        className="bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] backdrop-blur-3xl rounded-[15px] p-4 h-[461px] text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="w-full rounded-[15px] border-2 border-dashed border-white/50 h-full flex flex-col items-center justify-center space-y-8">
          <motion.div
            className="w-[85px] h-[85px] rounded-md bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] flex items-center justify-center"
            variants={zoomIn}
          >
            <Image
              src="/images/folder-img.svg"
              alt="Folder Image"
              height={30}
              width={30}
            />
          </motion.div>
          <motion.p className="flex flex-col gap-4" variants={fadeIn}>
            <span className="font-normal text-base lg:text-lg">
              Drag and Drop Your NFT File Here
            </span>
            <span className="font-light text-white opacity-50 text-base">
              Png, Jpg, Gif, Video Or Any File Up to 100mb
            </span>
          </motion.p>
          <motion.p
            className="underline text-[#379BD3] font-normal text-lg lg:text-xl"
            variants={scaleOnHover}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            Browse
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 mt-20 gap-10"
        variants={staggerChildren}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="flex flex-col gap-6" variants={fadeInUp}>
          <label htmlFor="itemName" className="font-light text-lg lg:text-xl">
            Item Name
          </label>
          <input
            type="text"
            placeholder="Enter Item Name"
            className="rounded-[15px] px-6 py-4 border border-gray-600 outline-none text-[#A48EA9] font-light text-base lg:text-xl"
          />
        </motion.div>
        <motion.div className="flex flex-col gap-6" variants={fadeInUp}>
          <label
            htmlFor="externalLink"
            className="font-light text-lg lg:text-xl"
          >
            External Link
          </label>
          <input
            type="text"
            placeholder="https://yoursite.com/item/123"
            className="rounded-[15px] px-6 py-4 border border-gray-600 outline-none text-[#A48EA9] font-light text-base lg:text-xl"
          />
        </motion.div>
        <motion.div className="flex flex-col gap-6" variants={fadeInUp}>
          <label htmlFor="collection" className="font-light text-lg lg:text-xl">
            Collection
          </label>
          <input
            type="text"
            placeholder="Select Collection"
            className="rounded-[15px] px-6 py-4 border border-gray-600 outline-none text-[#A48EA9] font-light text-base lg:text-xl"
          />
        </motion.div>
        <motion.div className="flex flex-col gap-6" variants={fadeInUp}>
          <label htmlFor="supply" className="font-light text-lg lg:text-xl">
            Supply
          </label>
          <input
            type="text"
            placeholder="Supply"
            className="rounded-[15px] px-6 py-4 border border-gray-600 outline-none text-[#A48EA9] font-light text-base lg:text-xl"
          />
        </motion.div>
        <motion.div className="flex flex-col gap-6" variants={fadeInUp}>
          <label htmlFor="blockChain" className="font-light text-lg lg:text-xl">
            Blockhain
          </label>
          <div className="rounded-[15px] px-6 py-4 border border-gray-600 outline-none flex items-center gap-2">
            <FaEthereum size={20} />
            <input
              type="text"
              placeholder="Etherum"
              className="text-[#A48EA9] font-light text-base lg:text-xl w-full outline-none border-none"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
