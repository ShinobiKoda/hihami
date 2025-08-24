"use client";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full max-w-[1440px] mx-auto p-4 lg:py-[41px] flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={100}
          height={100}
          className="w-[43px] lg:w-[63px]"
        />
        <p className="font-bold text-2xl lg:text-[40px]">HIHAMI</p>
      </div>

      <ul className="hidden lg:flex items-center gap-[50px] font-normal text-lg bg-gradient-to-r from-white/10 to-white/0 py-[28px] px-[50px] ">
        <li>
          <Link href="#">EXPLORE</Link>
        </li>
        <li>
          <Link href="#">TRENDING NFTs</Link>
        </li>
        <li>
          <Link href="#">AUCTIONED NFTs</Link>
        </li>
        <li>
          <Link href="#">INFLUENCERS</Link>
        </li>
      </ul>

      <div className="flex items-center gap-[30px]">
        <button className="cyber-btn text-white text-lg hidden lg:inline-flex">
          Connect Wallet
        </button>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <Image
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=p"
            alt="avatar"
            width={100}
            height={100}
            className="w-full rounded-full"
          />
        </div>
      </div>
    </nav>
  );
}
