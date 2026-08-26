"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePointerFine, useReducedMotion } from "@/lib/hooks/useMedia";

type MagneticProps = {
  children: React.ReactNode;
  /** How far the element travels toward the pointer, as a fraction of offset. */
  pull?: number;
  className?: string;
};

/** Desktop-only pointer attraction. Disabled entirely on touch and reduced motion. */
export function Magnetic({ children, pull = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.4 });

  const active = fine && !reduced;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={active ? { x: sx, y: sy } : undefined}
      onPointerMove={(e) => {
        if (!active || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * pull);
        y.set((e.clientY - (r.top + r.height / 2)) * pull);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
