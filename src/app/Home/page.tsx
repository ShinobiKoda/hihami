"use client";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  fadeInUp,
  fadeIn,
  staggerChildren,
} from "@/app/components/animations/motion";
import { FaRegUserCircle } from "react-icons/fa";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<{
    email: string;
    username: string | null;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as {
          ok: boolean;
          data?: { email: string; username: string | null };
        };
        if (mounted && json.ok && json.data) setMe(json.data);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <button
          aria-label="User menu"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10"
        >
          <FaRegUserCircle size={28} />
        </button>
        {open && (
          <div className="mt-2 w-64 rounded-md bg-[#161616] border border-white/10 shadow-lg p-4">
            <p className="text-sm text-gray-400">Signed in as</p>
            <p className="font-semibold break-all">{me?.username ?? "—"}</p>
            <p className="text-sm break-all text-gray-300">{me?.email ?? ""}</p>
          </div>
        )}
      </div>
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.h1
          className="text-5xl lg:text-6xl font-bold"
          variants={fadeInUp}
        >
          Homepage
        </motion.h1>
        <motion.p className="text-gray-600 mt-2 text-lg" variants={fadeIn}>
          Welcome to Enefty
        </motion.p>
      </motion.div>
    </div>
  );
}
