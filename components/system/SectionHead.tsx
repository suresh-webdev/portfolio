"use client";

import { motion } from "framer-motion";
import { Scramble } from "@/components/motion/Scramble";
import { LineReveal } from "@/components/motion/LineReveal";
import { hairline, still, viewportEarly } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useMedia";
import { cn } from "@/lib/utils";

type SectionHeadProps = {
  index: string;
  title: string;
  /** Right-hand machine annotation: counts, spans, timings. */
  meta?: string;
  className?: string;
};

export function SectionHead({
  index,
  title,
  meta,
  className,
}: SectionHeadProps) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("relative", className)}>
      <div className="grid items-baseline gap-x-8 gap-y-3 pb-5 md:grid-cols-[5rem_1fr_auto]">
        <Scramble
          text={index}
          className="text-[0.6875rem] tracking-[0.2em] text-ember"
        />

        <h2 className="t-display s-md">
          <LineReveal lines={[title]} />
        </h2>

        {meta && (
          <p className="t-label md:text-right">
            <Scramble text={meta} speed={22} />
          </p>
        )}
      </div>

      <motion.div
        className="h-px w-full origin-left bg-(--surface-border)"
        initial="hidden"
        whileInView="show"
        viewport={viewportEarly}
        variants={reduced ? still : hairline}
      />
    </div>
  );
}
