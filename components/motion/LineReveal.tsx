"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { lineVariants, still, viewportEarly } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useMedia";
import { cn } from "@/lib/utils";

type LineRevealProps = {
  /** One entry per visual line — line breaks stay art-directed, never automatic. */
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Play immediately (hero) instead of waiting for the viewport. */
  immediate?: boolean;
  /** With `immediate`, gates the start — used to wait out the boot curtain. */
  play?: boolean;
};

/**
 * The signature entrance: each line rises out from behind a mask.
 * Wrapper clips, child translates — so the text appears to be revealed
 * by the edge rather than sliding in from nowhere.
 *
 * The in-view check runs on the outer (unclipped, untransformed) root,
 * not on the individual animated line spans — a line span starts shifted
 * fully behind its own overflow:hidden mask, so its own bounding box is
 * clipped to zero visible area before it plays. Observing it directly
 * would deadlock: it can never be seen entering view because entering
 * view is what's supposed to reveal it.
 */
export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  immediate = false,
  play = true,
}: LineRevealProps) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(rootRef, viewportEarly);
  const variants = reduced ? still : lineVariants;

  const shouldShow = immediate ? play : inView;

  return (
    <span ref={rootRef} className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="reveal-line">
          <motion.span
            className={cn("block", lineClassName)}
            initial="hidden"
            animate={shouldShow ? "show" : "hidden"}
            custom={i + delay}
            variants={variants}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
