"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  staggerChildren,
  fadeInDown,
  fadeInUp,
  scaleOnHover,
} from "./animations/motion";
import Image from "next/image";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setMessage(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const value = email.trim();
    if (!value) {
      const msg = "Please enter your email address.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!emailRegex.test(value)) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Subscription failed");
      const successMsg =
        "Thank you for subscribing to HIHAMI. Check your inbox.";
      setMessage(successMsg);
      toast.success(successMsg);
      setEmail("");
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-30 w-full max-w-[1440px] mx-auto flex flex-col justify-center items-center gap-6 px-4 lg:px-12 md:px-8"
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2
        className="font-bold text-4xl lg:text-[56px] text-center"
        variants={fadeInDown}
      >
        Ready for the next NFT drop?
      </motion.h2>
      <motion.p
        className="text-[#A48EA9] text-center max-w-[640px]"
        variants={fadeInUp}
      >
        Join our newsletter to get curated drops, platform updates, and insights
        from the HIHAMI team.
      </motion.p>
      <motion.div
        className="rounded-[16px] text-[#E6DAEE] bg-[#110A14]/60 border border-[#3C0D41] w-full max-w-[520px] flex items-center overflow-hidden backdrop-blur-sm"
        variants={fadeInUp}
      >
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent placeholder-[#A48EA9] outline-none border-none w-full px-4 py-4 text-base"
          disabled={loading}
          aria-label="Email address"
        />
        <motion.button
          className="bg-[#AD1AAF] disabled:opacity-50 disabled:cursor-not-allowed rounded-[12px] m-2 w-[68px] h-[52px] p-2 cursor-pointer hover:opacity-90 focus:ring-2 focus:ring-[#D34ED6] focus:outline-none flex items-center justify-center"
          variants={scaleOnHover}
          initial="hidden"
          animate="visible"
          whileHover={!loading ? "hover" : undefined}
          whileTap={!loading ? "tap" : undefined}
          onClick={onSubmit}
          disabled={loading}
          aria-label="Subscribe"
        >
          {loading ? (
            <ClipLoader size={20} color="white" />
          ) : (
            <Image
              src="/images/arrow.svg"
              alt="Subscribe"
              width={100}
              height={100}
              className="w-full"
            />
          )}
        </motion.button>
      </motion.div>
      {message && (
        <motion.div
          className="text-sm text-emerald-300 bg-emerald-900/20 border border-emerald-700 rounded-lg px-3 py-2"
          variants={fadeInUp}
        >
          {message}
        </motion.div>
      )}
      {error && (
        <motion.div
          className="text-sm text-rose-300 bg-rose-900/20 border border-rose-700 rounded-lg px-3 py-2"
          variants={fadeInUp}
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}
