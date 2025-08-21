"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginSchema, type LoginSchema } from "@/lib/auth";
import { IoIosMail, IoIosEyeOff } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Login form data", data);
  };

  return (
    <div>
      <div className="w-full min-h-screen relative bg-[#160430] text-white hidden lg:flex">
        <motion.div
          className="max-w-[932px] min-h-screen flex-1 "
          style={{
            backgroundImage: "url('/images/background-img-desktop.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={fadeInDown}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center p-8">
            <Image
              src="/images/logo.svg"
              alt="Logo Image"
              width={50}
              height={50}
              className="w-[40px] h-[30px]"
            />
            <p className="flex flex-col">
              <span className="font-bold text-2xl">ENEFTY</span>
              <span className="font-normal text-[10px] tracking-[0.7rem] justify-end">
                NEON
              </span>
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 flex flex-col items-start justify-center ml-[10rem]"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="font-bold lg:text-7xl mb-4"
            variants={fadeInDown}
          >
            LOG IN
          </motion.h1>
          <div className="w-full max-w-[460px] space-y-4">
            <motion.p className="font-bold text-base" variants={fadeInDown}>
              Sign in with email address
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

              <motion.div
                className="bg-[#261046] py-3 px-4 rounded-md w-full text-[#A4A4A4] flex items-center relative"
                variants={fadeInUp}
              >
                <RiLockPasswordLine className="inline-block mr-2" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="bg-transparent w-full outline-none border-none pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 text-[#A4A4A4] hover:text-white focus:outline-none"
                >
                  {showPassword ? (
                    <IoIosEyeOff size={20} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </motion.div>
              {errors.password && (
                <p className="text-red-400 text-sm -mt-2">
                  {errors.password.message}
                </p>
              )}

              <motion.div
                className="w-full flex justify-end -mt-1"
                variants={fadeInUp}
              >
                <Link href="/forgot-password">
                  <motion.span
                    className="text-sm text-[#9D5CE9] font-semibold hover:underline"
                    variants={scaleOnHover}
                    whileHover="hover"
                  >
                    Forgot password?
                  </motion.span>
                </Link>
              </motion.div>

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
                    Logging in
                  </p>
                ) : (
                  "Login"
                )}
              </motion.button>
            </motion.form>

            <motion.div
              className="w-full mt-3"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              <motion.p className="text-sm text-[#B6B6B6]" variants={fadeInUp}>
                Don’t have an account?{" "}
                <Link href="/signup">
                  <motion.span
                    className="text-[#9D5CE9] font-semibold hover:underline"
                    variants={scaleOnHover}
                    whileHover="hover"
                  >
                    Sign up
                  </motion.span>
                </Link>
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
