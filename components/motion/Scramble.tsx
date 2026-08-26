"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useMedia";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>-_=+*#";

type ScrambleProps = {
  text: string;
  className?: string;
  /** ms per character resolved */
  speed?: number;
  /** Re-run on hover of the nearest [data-scramble-host] ancestor. */
  hoverTrigger?: boolean;
  as?: "span" | "div";
};

/**
 * Mono text that decodes into place — the machine voice arriving.
 * Resolves left-to-right so the label stays readable mid-animation.
 */
export function Scramble({
  text,
  className,
  speed = 28,
  hoverTrigger = false,
  as = "span",
}: ScrambleProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const frame = useRef<number>(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const run = useCallback(() => {
    // Initial state already equals `text`; reduced motion just skips animating.
    if (reduced) return;
    if (timer.current) clearInterval(timer.current);
    frame.current = 0;

    timer.current = setInterval(() => {
      frame.current += 1;
      const resolved = frame.current;

      if (resolved > text.length) {
        setDisplay(text);
        if (timer.current) clearInterval(timer.current);
        return;
      }

      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (i < resolved || char === " ") return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
    }, speed);
  }, [reduced, speed, text]);

  useEffect(() => {
    if (inView) run();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [inView, run]);

  useEffect(() => {
    if (!hoverTrigger || reduced) return;
    const host = ref.current?.closest("[data-scramble-host]");
    if (!host) return;
    const onEnter = () => run();
    host.addEventListener("mouseenter", onEnter);
    return () => host.removeEventListener("mouseenter", onEnter);
  }, [hoverTrigger, reduced, run]);

  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={cn("t-mono tabular-nums", className)}
      aria-label={text}
    >
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
