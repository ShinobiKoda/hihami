"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { FiChevronRight } from "react-icons/fi";
import { fadeInDown, fadeInUp, staggerChildren } from "../animations/motion";

export type Crumb = {
  label: string;
  href?: string;
  tooltip?: string;
};

type Props = {
  items: Crumb[];
  className?: string;
};

export function Breadcrumb({ items, className }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <motion.nav
      aria-label="Breadcrumb"
      variants={fadeInDown}
      initial="hidden"
      animate="visible"
      className={
        "w-full text-white/90 text-sm" + (className ? ` ${className}` : "")
      }
    >
      <motion.ol
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 flex-wrap"
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const content = (
            <span
              className={
                "truncate max-w-[60vw] md:max-w-[40vw] " +
                (isLast
                  ? "opacity-70"
                  : "hover:opacity-100 transition-opacity opacity-90")
              }
              title={item.tooltip || item.label}
            >
              {item.label}
            </span>
          );

          return (
            <motion.li
              key={idx}
              variants={fadeInUp}
              className="flex items-center"
            >
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:underline">
                  {content}
                </Link>
              ) : (
                content
              )}
              {!isLast && (
                <FiChevronRight className="mx-2 text-white/50" aria-hidden />
              )}
            </motion.li>
          );
        })}
      </motion.ol>
    </motion.nav>
  );
}

export default Breadcrumb;
