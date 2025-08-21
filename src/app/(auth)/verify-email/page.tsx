"use client";
import { motion } from "motion/react";
import {
  fadeInUp,
  fadeInDown,
  zoomIn,
  scaleOnHover,
} from "@/app/components/animations/motion";
import Image from "next/image";

export default function Page() {
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
            VERIFY EMAIL
          </motion.h1>
          <motion.div
            className="w-full max-w-[460px] space-y-4 bg-[#261046] p-6 rounded-md"
            variants={zoomIn}
          >
            <p className="text-[#D5D5D5]">
              We sent a verification link to your email. Click the link to
              verify your account.
            </p>
            <motion.button
              className="text-white font-medium text-lg py-3 rounded-md cursor-pointer bg-[linear-gradient(89.933deg,#501794_0%,#3E70A1_100%)] w-full"
              variants={scaleOnHover}
              whileHover="hover"
            >
              Resend Email
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
