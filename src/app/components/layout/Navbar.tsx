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
  scaleOnHover,
} from "../animations/motion";
import { MobileSidebar } from "./MobileSidebar";
import { useUser } from "@/app/context/UserContext";
import { FiRefreshCw, FiCheck } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { useAccount } from "wagmi";
import { ConnectModal } from "../wallet/ConnectModal";

export function Navbar() {
  const AVATAR_SEED_KEY = "hihami.avatarSeed.v1";
  const [open, setOpen] = useState(false);
  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState<string>("p");
  const [avatarError, setAvatarError] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { user: me, refreshUser, clearUser } = useUser();
  const { isConnected, connector } = useAccount();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletLabel, setWalletLabel] = useState<string>("Wallet");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (profileOpen) void refreshUser();
  }, [profileOpen, refreshUser]);

  // Prevent hydration mismatch by delaying wallet UI until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

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
  const setGlobalAvatarSeed = useCallback((s: string) => {
    setAvatarSeed(s);
    try {
      localStorage.setItem(AVATAR_SEED_KEY, s);
      const evt: CustomEvent<string> = new CustomEvent("hihami:avatarSeed", {
        detail: s,
      });
      window.dispatchEvent(evt);
    } catch {}
  }, []);

  const randomizeSeed = () => {
    const s = Math.random().toString(36).slice(2, 10);
    setGlobalAvatarSeed(s);
  };

  useEffect(() => {
    // Load persisted avatar seed on mount
    try {
      const saved = localStorage.getItem(AVATAR_SEED_KEY);
      if (saved) setGlobalAvatarSeed(saved);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAvatarError(false);
  }, [avatarSeed]);

  useEffect(() => {
    if (!isConnected) {
      setWalletLabel("Wallet");
      return;
    }
    let label = "Wallet";
    try {
      const eth = (
        typeof window !== "undefined"
          ? (window as unknown as { ethereum?: Record<string, unknown> })
              .ethereum
          : null
      ) as
        | (Record<string, unknown> & {
            isMetaMask?: boolean;
            isTrust?: boolean;
            isTrustWallet?: boolean;
            provider?: { isTrustWallet?: boolean };
          })
        | null;
      const isTrust =
        eth?.isTrust === true ||
        eth?.isTrustWallet === true ||
        eth?.provider?.isTrustWallet === true ||
        (connector?.name?.toLowerCase?.().includes("trust") ?? false);
      const isMetaMask = eth?.isMetaMask === true;
      if (connector?.id === "injected") {
        if (isTrust) {
          label = "Trust Wallet";
        } else if (isMetaMask) {
          label = "MetaMask";
        } else {
          label = connector?.name || "Injected Wallet";
        }
      } else if (connector?.name) {
        label = connector.name;
      }
    } catch {}
    setWalletLabel(label);
  }, [isConnected, connector]);

  const onConnectWallet = () => {
    setWalletModalOpen(true);
  };

  return (
    <div className="w-full bg-[#140C1F] text-white">
      <motion.nav
        variants={fadeInDown}
        initial="hidden"
        animate="visible"
        className="relative z-50 w-full max-w-[1440px] mx-auto p-4 lg:pt-4 flex items-center justify-between lg:px-12 md:px-8"
      >
        <Link href="/Home">
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
        </Link>

        <motion.ul
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="hidden xl:flex items-center gap-[50px] font-normal text-base lg:text-xl *:hover:opacity-90 *:cursor-pointer"
        >
          <motion.li variants={fadeInUp}>
            <Link href="/Explore">
              <motion.span
                className="inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#AD1AAF] after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                variants={scaleOnHover}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                EXPLORE
              </motion.span>
            </Link>
          </motion.li>
          <motion.li variants={fadeInUp}>
            <Link href="/Trending">
              <motion.span
                className="inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#AD1AAF] after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                variants={scaleOnHover}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                TRENDING NFTs
              </motion.span>
            </Link>
          </motion.li>
          <motion.li variants={fadeInUp}>
            <Link href="/Auctioned">
              <motion.span
                className="inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#AD1AAF] after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                variants={scaleOnHover}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                AUCTIONED NFTs
              </motion.span>
            </Link>
          </motion.li>
          <motion.li variants={fadeInUp}>
            <Link href="/Influencers">
              <motion.span
                className="inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#AD1AAF] after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                variants={scaleOnHover}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                INFLUENCERS
              </motion.span>
            </Link>
          </motion.li>
        </motion.ul>

        <div className="flex items-center gap-[30px]">
          {!mounted ? (
            <div
              className="hidden lg:block w-[200px] h-10 rounded-full bg-white/10 border border-white/15"
              aria-hidden="true"
            />
          ) : isConnected ? (
            <motion.button
              type="button"
              variants={slideInFromRight}
              className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-2 hover:bg-white/15"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConnectWallet}
              aria-label="Wallet Connected"
            >
              <span className="text-sm font-medium flex items-center gap-1">
                {walletLabel}:
                <FiCheck className="text-green-400" aria-hidden="true" />
              </span>
            </motion.button>
          ) : (
            <motion.div
              variants={slideInFromRight}
              className="items-center justify-between hidden lg:flex cursor-pointer hover:opacity-90"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConnectWallet}
              aria-label="Connect Wallet"
            >
              <Image
                src="/images/connect-wallet-btn.svg"
                alt="Connect Wallet Btn"
                width={100}
                height={100}
                className="w-[180px] md:w-[200px]"
              />
            </motion.div>
          )}
          <button
            aria-label="Open menu"
            onClick={openMenu}
            className="xl:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center hover:opacity-85"
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

          <div className="relative hidden xl:block" ref={profileRef}>
            <button
              aria-label="Open profile"
              onClick={() => setProfileOpen((v) => !v)}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:opacity-85 cursor-pointer"
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
                  className="absolute right-0 mt-2 w-72 rounded-xl border border-white/10 bg-gradient-to-b from-[#0c0c12]/95 to-[#131320]/95 text-white shadow-2xl p-4 z-[60]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center cursor-pointer">
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
                      onClick={() => {
                        randomizeSeed();
                        setIsSpinning(true);
                        window.setTimeout(() => {
                          setIsSpinning(false);
                        }, 600);
                      }}
                      className="ml-2 rounded-md p-2 text-white/75 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    >
                      <motion.div
                        key={isSpinning ? "spin" : "idle"}
                        initial={{ rotate: 0 }}
                        animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
                        transition={{
                          duration: isSpinning ? 0.6 : 0,
                          ease: "easeInOut",
                        }}
                      >
                        <FiRefreshCw className="w-4 h-4" />
                      </motion.div>
                    </button>
                  </div>
                  <div className="mt-3 h-px bg-white/10" />
                  <ul className="mt-3 space-y-2 text-sm *:rounded-md *:px-3 *:py-2">
                    <li className="hover:bg-white/10 cursor-pointer">
                      <Link href="/CreateNFT" className="w-full">
                        Create NFT
                      </Link>
                    </li>

                    <li className="hover:bg-white/10 cursor-pointer">
                      <Link href="/Profile" className="w-full">
                        Profile
                      </Link>
                    </li>

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
      <ConnectModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </div>
  );
}
