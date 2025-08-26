"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  sidebarSlide,
  overlayFade,
  staggerChildren,
  fadeInUp,
} from "../../components/animations/motion";
import { useUser } from "@/app/context/UserContext";
import { FiRefreshCw } from "react-icons/fi";

type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
  avatarSeed: string;
  onRandomizeSeed: () => void;
};

export function MobileSidebar({
  open,
  onClose,
  avatarSeed,
  onRandomizeSeed,
}: MobileSidebarProps) {
  const { user: me, refreshUser } = useUser();
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) void refreshUser();
  }, [open, refreshUser]);

  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
    avatarSeed
  )}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            role="button"
            aria-label="Close menu"
            tabIndex={-1}
            className="xl:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            variants={overlayFade}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          <motion.aside
            className="xl:hidden fixed right-0 top-0 z-50 h-dvh w-[84vw] max-w-[360px] shadow-xl border-l border-white/10 bg-gradient-to-b from-[#0c0c12]/95 to-[#131320]/95 text-white"
            variants={sidebarSlide}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="px-5 pt-6 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <Image
                    src={avatarUrl}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const span = document.createElement("span");
                        span.className =
                          "flex items-center justify-center w-full h-full";
                        span.innerHTML = `<svg viewBox='0 0 448 512' width='18' height='18' fill='#160430'><path d='M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z'/></svg>`;
                        parent.appendChild(span);
                      }
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-white/60 truncate">
                    {me?.email ?? "Not signed in"}
                  </p>
                  <p className="text-sm font-semibold truncate">
                    {me?.username ?? "Guest"}
                  </p>
                </div>
              </div>
              <button
                aria-label="Refresh avatar"
                onClick={() => {
                  onRandomizeSeed();
                  setIsSpinning(true);
                  window.setTimeout(() => setIsSpinning(false), 600);
                }}
                className="rounded-md p-2 text-white/80 hover:text-white hover:bg-white/10 transition mr-1"
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
              <button
                aria-label="Close"
                onClick={onClose}
                className="rounded-md px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            <motion.nav
              className="px-4"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <ul className="space-y-2">
                {[
                  { label: "Explore", href: "#" },
                  { label: "Trending NFTs", href: "#" },
                  { label: "Auctioned NFTs", href: "#" },
                  { label: "Influencers", href: "#" },
                ].map((item) => (
                  <motion.li key={item.label} variants={fadeInUp}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group block rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 transition"
                    >
                      <span className="flex items-center justify-between">
                        <span>{item.label}</span>
                        <span className="text-white/50 group-hover:text-white/80 transition">
                          →
                        </span>
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-5" />

              <motion.div variants={fadeInUp}>
                <button className="w-full justify-center inline-flex items-center">
                  Connect Wallet
                </button>
              </motion.div>

              <div className="h-px bg-white/10 my-4" />

              <motion.button
                variants={fadeInUp}
                onClick={async () => {
                  try {
                    await fetch("/api/auth/signout", { method: "POST" });
                  } finally {
                    onClose();
                    router.replace("/login");
                  }
                }}
                className="w-full text-left rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 text-red-300"
              >
                Sign out
              </motion.button>
            </motion.nav>

            <div className="mt-auto" />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
