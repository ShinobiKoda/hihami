"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupSchema, type SignupSchema } from "@/lib/auth";
import { FaUser, FaEye, FaGoogle, FaFacebook } from "react-icons/fa";
import { IoIosMail, IoIosEyeOff } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { motion } from "motion/react";
import {
  fadeInUp,
  fadeInDown,
  staggerChildren,
  scaleOnHover,
} from "@/app/components/animations/motion";
import Image from "next/image";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupSchema) => {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          username: data.name, 
        }),
      });

      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        if (res.status === 409) {
          setServerError(
            (json.error ?? "This email is already registered.") +
              " You can log in instead."
          );
        } else {
          setServerError(json.error ?? "Signup failed. Please try again.");
        }
        return;
      }

      const params = new URLSearchParams({ email: data.email });
      router.push(`/verify-email?${params.toString()}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setServerError(msg);
    }
  };

  return (
    <div className="w-full lg:flex min-h-screen relative bg-[#160430] text-white">
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
        <div className="lg:hidden absolute bottom-0 inset-x-0 h-28 bg-gradient-to-b from-transparent to-[#160430] pointer-events-none" />
      </motion.div>

      <motion.div
        className="flex-1 flex flex-col items-center lg:items-start justify-center lg:ml-[10rem] px-4 relative lg:static z-20 -top-[14rem] lg:top-0"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-bold text-5xl lg:text-7xl mb-4 w-full text-left flex items-start max-w-[460px]"
          variants={fadeInDown}
        >
          SIGN UP
        </motion.h1>
        <div className="w-full max-w-[460px] space-y-4">
          <motion.p className="font-bold text-lg" variants={fadeInDown}>
            Sign up with email address
          </motion.p>
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            {serverError && (
              <p className="text-red-400 text-sm -mb-2" role="alert">
                {serverError}
              </p>
            )}
            <motion.div
              className="bg-[#261046] py-3 px-4 rounded-md w-full text-[#A4A4A4] flex items-center"
              variants={fadeInUp}
            >
              <FaUser className="inline-block mr-2" size={20} />
              <input
                type="text"
                placeholder="Username"
                autoComplete="name"
                className="bg-transparent w-full outline-none border-none"
                {...register("name")}
              />
            </motion.div>
            {errors.name && (
              <p className="text-red-400 text-sm -mt-2">
                {errors.name.message}
              </p>
            )}

            <motion.div
              className="bg-[#261046] py-3 px-4 rounded-md w-full text-[#A4A4A4] flex items-center"
              variants={fadeInUp}
            >
              <IoIosMail className="inline-block mr-2" size={20} />
              <input
                type="email"
                placeholder="yourmail@mail.com"
                autoComplete="email"
                className="bg-transparent w-full outline-none border-none"
                {...register("email")}
              />
            </motion.div>
            {errors.email && (
              <p className="text-red-400 text-sm -mt-2">
                {errors.email.message}
              </p>
            )}

            <motion.div
              className="bg-[#261046] py-3 px-4 rounded-md w-full text-[#A4A4A4] flex items-center relative"
              variants={fadeInUp}
            >
              <RiLockPasswordLine className="inline-block mr-2" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                className="bg-transparent w-full outline-none border-none pr-10"
                {...register("password")}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 text-[#A4A4A4] hover:text-white focus:outline-none"
              >
                {showPassword ? <IoIosEyeOff size={20} /> : <FaEye size={18} />}
              </button>
            </motion.div>
            {errors.password && (
              <p className="text-red-400 text-sm -mt-2">
                {errors.password.message}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 text-white font-medium text-xl py-3 rounded-md disabled:opacity-70 cursor-pointer bg-[linear-gradient(89.933deg,#501794_0%,#3E70A1_100%)] text-center"
              variants={scaleOnHover}
              whileHover="hover"
            >
              {isSubmitting ? (
                <p className="flex items-center justify-center w-full text-white gap-2">
                  <ClipLoader size={20} color="white" />
                  Signing up
                </p>
              ) : (
                "Signup"
              )}
            </motion.button>
          </motion.form>
          <motion.div
            className="w-full flex items-center justify-between"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <motion.p className="text-sm text-[#B6B6B6]" variants={fadeInUp}>
              Already have an account?{" "}
              <Link href="/login">
                <motion.span
                  className="text-[#9D5CE9] font-semibold hover:underline"
                  variants={scaleOnHover}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Log in
                </motion.span>
              </Link>
            </motion.p>
          </motion.div>
        </div>

        <div className="h-px w-full bg-[#727272] mt-10 mb-8 max-w-[460px]"></div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.p
            className="text-sm font-semibold text-[#B6B6B6]"
            variants={fadeInUp}
          >
            Or continue with
          </motion.p>
          <div className="flex items-center w-full gap-6">
            <motion.button
              className="flex items-center gap-2 bg-[#3B2063] font-semibold text-base flex-1 py-2 rounded-md justify-center"
              variants={scaleOnHover}
              whileHover="hover"
              whileTap="tap"
            >
              <FaGoogle />
              Google
            </motion.button>
            <motion.button
              className="flex items-center gap-2 bg-[#3B2063] font-semibold text-base flex-1 py-2 rounded-md text-center justify-center"
              variants={scaleOnHover}
              whileHover="hover"
              whileTap="tap"
            >
              <FaFacebook />
              Facebook
            </motion.button>
          </div>
          <motion.p
            className="text-sm font-semibold text-[#B6B6B6] "
            variants={fadeInUp}
          >
            By registering you agree to our{" "}
            <span className="text-[#9D5CE9]">
              Terms of Service and Privacy Policy
            </span>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
