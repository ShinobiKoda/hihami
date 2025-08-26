"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

type CoverflowItem = {
  name: string;
  image: string;
  alt: string;
};

type Props = {
  items: CoverflowItem[];
  autoPlayMs?: number;
  visibleRange?: number; // how many items on each side of center remain visible
  className?: string;
};

// Compute the minimal wrapped distance between two indices on a ring of size n
function wrappedDelta(i: number, active: number, n: number) {
  let d = i - active;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

export default function Coverflow({
  items,
  autoPlayMs = 2500,
  visibleRange,
  className,
}: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = items.length;
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (n <= 1) return;
    if (paused) return;
    timerRef.current = window.setInterval(() => {
      setActive((a) => (a + 1) % n);
    }, autoPlayMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [autoPlayMs, n, paused]);

  const layout = useMemo(() => {
    const half = Math.floor(n / 2);
    const range =
      typeof visibleRange === "number" && visibleRange >= 0
        ? Math.min(visibleRange, half)
        : half; // show all by default

    return items.map((_, i) => {
      const d = wrappedDelta(i, active, n);
      const abs = Math.abs(d);
      const baseOffset = 180; // tighter spacing to reduce overflow
      const x = d * baseOffset;
      const rotateY = d * -22; // moderate tilt
      // Bring center forward, push sides back gently
      const translateZ = (abs === 0 ? 60 : 0) - Math.abs(d) * 60;
      const zIndex = 100 - abs;
      let opacity = 1 - abs * 0.12; // progressive fade
      if (opacity < 0.25) opacity = 0.25; // never fully invisible
      // Scale up center more, keep sides reasonably large
      let scale = 1 - abs * 0.06;
      if (abs === 0) scale += 0.05; // subtle pop for the front card
      if (scale < 0.85) scale = 0.85;
      const hidden = typeof visibleRange === "number" ? abs > range : false;
      return { i, d, x, rotateY, translateZ, zIndex, opacity, scale, hidden };
    });
  }, [active, items, n, visibleRange]);

  if (!n) return null;

  return (
    <div
      className={"relative w-full select-none " + (className ? className : "")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[430px] [perspective:1000px]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px]">
          {layout.map(
            ({ i, x, rotateY, translateZ, zIndex, opacity, scale }) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ zIndex }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity,
                  transform: `translateX(${x}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 26,
                  mass: 0.7,
                }}
              >
                <div
                  className="relative w-[320px] h-[426px] overflow-hidden [transform-style:preserve-3d]"
                  style={{
                    pointerEvents: "auto",
                  }}
                  onClick={() => setActive(i)}
                  role="button"
                  aria-label={`Show ${items[i].name}`}
                >
                  <Image
                    src={items[i].image}
                    alt={items[i].alt}
                    fill
                    sizes="320px"
                    className="object-cover"
                    priority={i === active}
                  />
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
