"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { slideInFromLeft } from "../animations/motion";
import {
  FaYoutube,
  FaTwitter,
  FaFacebookF,
  FaGooglePlusG,
} from "react-icons/fa";

export function Footer() {
  return (
    <div className="w-full max-w-[1440px] mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-4 md:px-8 lg:px-12 gap-8 md:gap-10 lg:gap-12 py-10">
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

      <div className="space-y-[60px]">
        <p className="font-medium text-lg lg:text-xl text-[#96839B]">
          Shihami is the world’s leading NFTs marketplace where you can
          discover, sell and bid NFTs and get rich{" "}
        </p>
        <ul className="flex items-center gap-8">
          <li>
            <FaYoutube size={30} color="#AD1AAF" />
          </li>
          <li>
            <FaTwitter size={30} color="#AD1AAF" />
          </li>
          <li>
            <FaFacebookF size={30} color="#AD1AAF" />
          </li>
          <li>
            <FaGooglePlusG size={30} color="#AD1AAF" />
          </li>
        </ul>
        <p className="font-normal lg:text-xl text-lg text-[#96839B]">
          All rights reserved &copy;HIHAMI
        </p>
      </div>

      <div className="space-y-5">
        <h3 className="font-bold text-2xl">About</h3>
        <div className="flex flex-col gap-4 font-medium text-xl text-[#96839B]">
          <Link href="#" className="">
            About NFT
          </Link>
          <Link href="/Auctioned">Live Auctions</Link>
          <Link href="#">NFT Blog</Link>
          <Link href="#">Activity</Link>
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="font-bold text-2xl">Support</h3>
        <div className="flex flex-col gap-4 font-medium text-xl text-[#96839B]">
          <Link href="#">Help & Support</Link>
          <Link href="#">Item Details</Link>
          <Link href="/">Author Profile</Link>
          <Link href="#">Collection</Link>
        </div>
      </div>
    </div>
  );
}
