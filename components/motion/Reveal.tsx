"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, still, viewportEarly } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useMedia";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

/** Standard in-view entrance: 20px rise + fade, once. */
export function Reveal({ children, delay = 0, ...rest }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportEarly}
      custom={delay}
      variants={reduced ? still : fadeUp}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
