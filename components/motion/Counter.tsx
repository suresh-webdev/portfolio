"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useMedia";

type CounterProps = {
  to: number;
  duration?: number;
  className?: string;
  format?: (v: number) => string;
};

/** Counts once when scrolled into view. Eased, not linear. */
export function Counter({
  to,
  duration = 1.4,
  className,
  format = (v) => Math.round(v).toLocaleString("en-US"),
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let raf = requestAnimationFrame(function start() {
      if (reduced) {
        setValue(to);
        return;
      }

      const startTime = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - startTime) / (duration * 1000), 1);
        // expo-out, matches --ease-out
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setValue(to * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(raf);
  }, [duration, inView, reduced, to]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
