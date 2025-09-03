"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  slideInFromLeft,
  fadeInUp,
  fadeIn,
  staggerChildren,
  scaleOnHover,
} from "../animations/motion";
import {
  FaYoutube,
  FaTwitter,
  FaFacebookF,
  FaGooglePlusG,
} from "react-icons/fa";

export function Footer() {
  return (
    <motion.div
      className="w-full max-w-[1440px] mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-4 md:px-8 lg:px-12 gap-8 md:gap-10 lg:gap-12 py-10 text-white"
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
    >
      <Link href="/Home">
        <motion.div className="flex items-center" variants={slideInFromLeft}>
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className="w-[45px] lg:w-[63px]"
          />
          <p className="font-bold text-3xl lg:text-5xl">HIHAMI</p>
        </motion.div>
      </Link>

      <motion.div className="space-y-[60px]" variants={fadeInUp}>
        <motion.p
          className="font-medium text-lg lg:text-xl text-[#96839B]"
          variants={fadeIn}
        >
          Shihami is the world’s leading NFTs marketplace where you can
          discover, sell and bid NFTs and get rich{" "}
        </motion.p>
        <ul className="flex items-center gap-8">
          <motion.li
            variants={scaleOnHover}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <FaYoutube size={30} color="#AD1AAF" />
          </motion.li>
          <motion.li
            variants={scaleOnHover}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <FaTwitter size={30} color="#AD1AAF" />
          </motion.li>
          <motion.li
            variants={scaleOnHover}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <FaFacebookF size={30} color="#AD1AAF" />
          </motion.li>
          <motion.li
            variants={scaleOnHover}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <FaGooglePlusG size={30} color="#AD1AAF" />
          </motion.li>
        </ul>
        <motion.p
          className="font-normal lg:text-xl text-lg text-[#96839B]"
          variants={fadeIn}
        >
          All rights reserved &copy;HIHAMI
        </motion.p>
      </motion.div>

      <motion.div className="space-y-5" variants={fadeInUp}>
        <h3 className="font-bold text-2xl">About</h3>
        <div className="flex flex-col gap-4 font-medium text-xl text-[#96839B]">
          <Link href="/AboutNFT" className="">
            <motion.span
              className="inline-block"
              variants={scaleOnHover}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              About NFT
            </motion.span>
          </Link>
          <Link href="/Auctioned">
            <motion.span
              className="inline-block"
              variants={scaleOnHover}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              Live Auctions
            </motion.span>
          </Link>
          <Link href="/NFTBlog">
            <motion.span
              className="inline-block"
              variants={scaleOnHover}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              NFT Blog
            </motion.span>
          </Link>
          <Link href="/Activity">
            <motion.span
              className="inline-block"
              variants={scaleOnHover}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              Activity
            </motion.span>
          </Link>
        </div>
      </motion.div>

      <motion.div className="space-y-5" variants={fadeInUp}>
        <h3 className="font-bold text-2xl">Support</h3>
        <div className="flex flex-col gap-4 font-medium text-xl text-[#96839B]">
          <Link href="/Support">
            <motion.span
              className="inline-block"
              variants={scaleOnHover}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              Help & Support
            </motion.span>
          </Link>
          <Link href="#">
            <motion.span
              className="inline-block"
              variants={scaleOnHover}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              Privacy Policy
            </motion.span>
          </Link>
          <Link href="/AuthorProfile">
            <motion.span
              className="inline-block"
              variants={scaleOnHover}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              Author Profile
            </motion.span>
          </Link>
          <Link href="/Collections">
            <motion.span
              className="inline-block"
              variants={scaleOnHover}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              Collection
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
