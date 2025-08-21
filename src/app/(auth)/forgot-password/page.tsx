"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/lib/auth";
import { motion } from "motion/react";
import { IoIosMail } from "react-icons/io";
import {
  fadeInUp,
  fadeInDown,
  staggerChildren,
  scaleOnHover,
} from "@/app/components/animations/motion";
import Image from "next/image";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Forgot password request", data);
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
            RESET PASSWORD
          </motion.h1>
          <div className="w-full max-w-[460px] space-y-4">
            <motion.p className="font-bold text-base" variants={fadeInDown}>
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
                className="mt-2 text-white font-medium text-xl py-3 rounded-md disabled:opacity-70 cursor-pointer bg-[linear-gradient(89.933deg,#501794_0%,#3E70A1_100%)] text-center"
                variants={scaleOnHover}
                whileHover="hover"
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
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
