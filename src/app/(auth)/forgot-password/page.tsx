"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/lib/auth";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { IoIosMail } from "react-icons/io";
import {
  fadeInUp,
  fadeInDown,
  staggerChildren,
  scaleOnHover,
} from "@/app/components/animations/motion";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });
    const json = await res.json();
    if (!res.ok) {
      alert(json?.error ?? "Failed to send reset link");
      return;
    }
    alert("If the email exists, a reset link has been sent.");
    router.push("/login");
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

      {/* Form */}
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
          RESET PASSWORD
        </motion.h1>
        <div className="w-full max-w-[460px] space-y-4">
          <motion.p className="font-bold text-lg" variants={fadeInDown}>
            Enter your email to receive reset instructions
          </motion.p>
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-4"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
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

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 text-white font-medium text-base lg:text-xl py-3 rounded-md disabled:opacity-70 cursor-pointer bg-[linear-gradient(89.933deg,#501794_0%,#3E70A1_100%)] text-center"
              variants={scaleOnHover}
              whileHover="hover"
              whileTap="tap"
            >
              {isSubmitting ? (
                <p className="flex items-center justify-center w-full text-white gap-2">
                  <ClipLoader size={20} color="white" />
                  Sending
                </p>
              ) : (
                "Send Reset Link"
              )}
            </motion.button>

            <motion.button
              type="button"
              aria-label="Return to sign in"
              onClick={() => router.push("/login")}
              className="mt-2 text-white font-medium text-base lg:text-xl py-3 rounded-md cursor-pointer border border-[#3B2063] bg-transparent hover:bg-[#3B2063] transition-colors text-center"
              variants={scaleOnHover}
              whileHover="hover"
              whileTap="tap"
            >
              Return to Sign In
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
