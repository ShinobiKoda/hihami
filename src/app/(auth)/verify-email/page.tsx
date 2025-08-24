"use client";
import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  fadeInUp,
  fadeInDown,
  zoomIn,
  scaleOnHover,
} from "@/app/components/animations/motion";
import Image from "next/image";

export default function Page() {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const search = useSearchParams();
  const email = search.get("email");
  // uid removed in new flow; we use a pending signup cookie on the server
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const digits = (text.match(/\d/g) || []).slice(0, 4);
    if (digits.length === 0) return;
    const next = ["", "", "", ""];
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setCode(next);
    const focusIndex = Math.min(digits.length, 3);
    inputsRef.current[focusIndex]?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const joined = code.join("");
    if (joined.length !== 4) return;
    // uid not required; server reads pending_signup cookie

    try {
      setSubmitting(true);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: joined }),
      });
      const json = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setServerError(json.error ?? "Verification failed. Try again.");
        return;
      }
      router.push("/login?verified=1");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isComplete = code.every((c) => c.length === 1);

  return (
    <div className="w-full lg:flex min-h-screen relative bg-[#160430] text-white">
      {/* Background / hero */}
      <motion.div
        className="relative max-w-[932px] lg:min-h-screen h-[571px] flex-1 lg:p-8 p-4 bg-[url('/images/background-img-mobile.svg')] lg:bg-[url('/images/background-img-desktop.svg')] bg-cover bg-center"
        variants={fadeInDown}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center">
          <Image
            src="/images/logo.svg"
            alt="Logo Image"
            width={50}
            height={50}
            className="w-[40px] h-[50px]"
          />
          <p className="flex flex-col">
            <span className="font-bold text-2xl">HIHAMI</span>
            <span className="font-normal text-[10px] tracking-[0.7rem] justify-end">
              NEON
            </span>
          </p>
        </div>
        {/* Mobile gradient to blend image into background */}
        <div className="lg:hidden absolute bottom-0 inset-x-0 h-28 bg-gradient-to-b from-transparent to-[#160430] pointer-events-none" />
      </motion.div>

      {/* Verify content */}
      <motion.div
        className="flex-1 flex flex-col items-center lg:items-start justify-center lg:ml-[10rem] px-4 relative lg:static z-20 -top-[14rem] lg:top-0"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-bold text-5xl lg:text-7xl mb-4 w-full text-left max-w-[460px]"
          variants={fadeInDown}
        >
          VERIFY EMAIL
        </motion.h1>
        <motion.form
          onSubmit={onSubmit}
          className="w-full max-w-[460px] space-y-5 bg-[#261046] p-6 rounded-md"
          variants={zoomIn}
        >
          {serverError && (
            <p className="text-red-400 text-sm" role="alert">
              {serverError}
            </p>
          )}
          <p className="text-[#D5D5D5] text-base lg:text-lg">
            Enter the four digit number we sent
            {email ? ` to ${email}` : " to your email"}
          </p>

          <div className="flex items-center gap-4">
            {code.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                value={val}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                autoFocus={idx === 0}
                className="w-14 h-14 rounded-lg bg-[#3B2063] text-white text-2xl text-center outline-none focus:ring-2 focus:ring-[#9D5CE9]"
              />
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={!isComplete || submitting}
            className="text-white font-medium text-lg lg:text-xl py-3 rounded-md cursor-pointer disabled:opacity-60 bg-[linear-gradient(89.933deg,#501794_0%,#3E70A1_100%)] w-full"
            variants={scaleOnHover}
            whileHover="hover"
            whileTap="tap"
          >
            {submitting ? "Verifying..." : "Verify"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
