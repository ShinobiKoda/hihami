"use client";
import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { hCarouselSlide } from "./animations/motion";

type Item = {
  image: string;
  alt: string;
  name?: string;
  price?: number;
};

type Props = {
  items: Item[];
  intervalMs?: number;
  className?: string;
  glossy?: boolean;
};

export default function CarouselHorizontal({
  items,
  intervalMs = 5000,
  className,
  glossy = true,
}: Props) {
  const [index, setIndex] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const safeLen = items.length || 1;

  React.useEffect(() => {
    if (hover || items.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % safeLen),
      intervalMs
    );
    return () => clearInterval(id);
  }, [hover, intervalMs, safeLen, items.length]);

  const current = items[index % safeLen] ?? items[0];

  return (
    <div
      className={
        "relative w-full max-w-[640px] mx-auto select-none " + (className ?? "")
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="overflow-hidden rounded-3xl">
        <div className="relative flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${current?.image}-${index}`}
              variants={hCarouselSlide}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex items-center justify-center"
            >
              <div
                className={
                  glossy
                    ? "rounded-[41.67px] max-w-[321px] p-3 bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_8px_30px_rgba(0,0,0,0.12)] min-h-[397px]"
                    : "max-w-[340px]"
                }
              >
                <Image
                  src={current?.image ?? ""}
                  alt={current?.alt ?? "NFT"}
                  width={420}
                  height={420}
                  className="w-[280px] sm:w-[340px] h-auto rounded-2xl"
                />
                {(current?.name || typeof current?.price !== "undefined") && (
                  <div className="pt-6 px-1 text-center gap-4">
                    {current?.name && (
                      <p className="text-white text-xl font-medium">
                        {current.name}
                      </p>
                    )}
                    {typeof current?.price !== "undefined" && (
                      <p className="text-white font-medium text-lg">
                        ${current.price?.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
