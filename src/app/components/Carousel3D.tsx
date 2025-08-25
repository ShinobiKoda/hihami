"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { carouselRing } from "./animations/motion";

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
};

type SlotName = "center" | "right" | "back" | "left";

function getSlotNames(len: number): readonly SlotName[] {
  if (len >= 4) return ["center", "right", "back", "left"] as const;
  if (len === 3) return ["center", "right", "left"] as const;
  if (len === 2) return ["center", "right"] as const;
  if (len === 1) return ["center"] as const;
  return [] as const;
}

function slotForIndex(
  baseIndex: number,
  i: number,
  slots: readonly SlotName[]
): SlotName {
  const rel = (((i - baseIndex) % slots.length) + slots.length) % slots.length;
  return slots[rel];
}

export default function Carousel3D({
  items,
  intervalMs = 5000,
  className,
}: Props) {
  const [active, setActive] = React.useState(0);
  const [isHover, setIsHover] = React.useState(false);

  const ringItems = items;

  const slotNames = React.useMemo(
    () => getSlotNames(ringItems.length),
    [ringItems.length]
  );

  React.useEffect(() => {
    if (isHover) return;
    const id = setInterval(() => {
      setActive((a) => (slotNames.length ? (a + 1) % slotNames.length : 0));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, isHover, slotNames.length]);

  return (
    <div
      className={
        "relative w-full max-w-[980px] mx-auto aspect-[16/9] select-none " +
        (className ?? "")
      }
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {ringItems.map((it, i) => {
            const slot = slotForIndex(active, i, slotNames);
            const isCenter = slot === "center";
            return (
              <motion.div
                key={`${it.image}-${i}`}
                variants={carouselRing}
                animate={slot}
                initial={slot}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className={
                    "rounded-[41.67px] max-w-[321px] p-3 bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_8px_30px_rgba(0,0,0,0.12)] min-h-[397px] pt-5" +
                    (isCenter ? " scale-100" : "")
                  }
                >
                  <Image
                    src={it.image}
                    alt={it.alt}
                    width={320}
                    height={400}
                    className="w-[260px] md:w-[300px] lg:w-[320px] h-auto rounded-2xl"
                  />

                  {(it.name || typeof it.price !== "undefined") && (
                    <div className="pt-3 px-1 text-center">
                      {it.name && (
                        <p className="text-white font-medium text-[25px]">
                          {it.name}
                        </p>
                      )}
                      {typeof it.price !== "undefined" && (
                        <p className="text-white font-medium text-[17px]">
                          ${it.price?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
