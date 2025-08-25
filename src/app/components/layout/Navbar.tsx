"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  fadeInDown,
  slideInFromLeft,
  staggerChildren,
  fadeInUp,
  slideInFromRight,
} from "../animations/motion";
import { MobileSidebar } from "./MobileSidebar";
import { useUser } from "@/app/context/UserContext";
import { FiRefreshCw } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState<string>("p");
  const [avatarError, setAvatarError] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { user: me, refreshUser, clearUser } = useUser();

  useEffect(() => {
    if (profileOpen) void refreshUser();
  }, [profileOpen, refreshUser]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const onSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch {}
    clearUser();
    router.replace("/login");
  };

  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
    avatarSeed
  )}`;
  const randomizeSeed = () => {
    const s = Math.random().toString(36).slice(2, 10);
    setAvatarSeed(s);
  };

  // Reset fallback state whenever the seed changes
  useEffect(() => {
    setAvatarError(false);
  }, [avatarSeed]);

  return (
    <motion.nav
      variants={fadeInDown}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[1440px] mx-auto p-4 lg:pt-4 flex items-center justify-between"
    >
      <motion.div className="flex items-center" variants={slideInFromLeft}>
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={100}
          height={100}
          className="w-[40px] lg:w-[43px]"
        />
        <p className="font-bold text-xl lg:text-3xl">HIHAMI</p>
      </motion.div>

      <motion.ul
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex items-center gap-[50px] font-normal text-base *:hover:opacity-90 *:cursor-pointer"
      >
        <motion.li variants={fadeInUp}>
          <Link href="#">EXPLORE</Link>
        </motion.li>
        <motion.li variants={fadeInUp}>
          <Link href="#">TRENDING NFTs</Link>
        </motion.li>
        <motion.li variants={fadeInUp}>
          <Link href="#">AUCTIONED NFTs</Link>
        </motion.li>
        <motion.li variants={fadeInUp}>
          <Link href="#">INFLUENCERS</Link>
        </motion.li>
      </motion.ul>

      <div className="flex items-center gap-[30px]">
        <motion.div
          variants={slideInFromRight}
          className="items-center justify-between hidden lg:flex cursor-pointer hover:opacity-90"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image
            src="/images/connect-wallet-btn.svg"
            alt="Connect Wallet Btn"
            width={100}
            height={100}
            className="w-[180px]"
          />
        </motion.div>
        <button
          aria-label="Open menu"
          onClick={openMenu}
          className="lg:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center hover:opacity-85"
        >
          {avatarError ? (
            <FaRegUser className="w-6 h-6 text-[#160430]" />
          ) : (
            <Image
              src={avatarUrl}
              alt="avatar"
              width={100}
              height={100}
              className="w-full rounded-full"
              onError={() => setAvatarError(true)}
            />
          )}
        </button>

        <div className="relative hidden lg:block" ref={profileRef}>
          <button
            aria-label="Open profile"
            onClick={() => setProfileOpen((v) => !v)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:opacity-85"
          >
            {avatarError ? (
              <FaRegUser className="w-6 h-6 text-[#160430]" />
            ) : (
              <Image
                src={avatarUrl}
                alt="avatar"
                width={100}
                height={100}
                className="w-full rounded-full"
                onError={() => setAvatarError(true)}
              />
            )}
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.6,
                }}
                className="absolute right-0 mt-2 w-72 rounded-xl border border-white/10 bg-gradient-to-b from-[#0c0c12]/95 to-[#131320]/95 text-white shadow-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center">
                    {avatarError ? (
                      <FaRegUser className="w-5 h-5 text-[#160430]" />
                    ) : (
                      <Image
                        src={avatarUrl}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white/70 truncate">
                      {me?.email ?? "Not signed in"}
                    </p>
                    <p className="font-semibold truncate">
                      {me?.username ?? "Guest"}
                    </p>
                  </div>
                  <button
                    aria-label="Refresh avatar"
                    onClick={randomizeSeed}
                    className="ml-2 rounded-md p-2 text-white/75 hover:text-white hover:bg-white/10 transition"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 h-px bg-white/10" />
                <ul className="mt-3 space-y-2 text-sm *:rounded-md *:px-3 *:py-2">
                  <li className="hover:bg-white/10 cursor-pointer">Profile</li>
                  <li className="hover:bg-white/10 cursor-pointer">Settings</li>
                  <li
                    className="hover:bg-white/10 cursor-pointer text-red-300"
                    onClick={onSignOut}
                  >
                    Sign out
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <MobileSidebar
        open={open}
        onClose={closeMenu}
        avatarSeed={avatarSeed}
        onRandomizeSeed={randomizeSeed}
      />
    </motion.nav>
  );
}
