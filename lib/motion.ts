import type { Transition, Variants } from "framer-motion";

/** Single easing curve across the whole site — expo-ish out. */
export const easeOut = [0.16, 1, 0.3, 1] as const;
export const easeInOut = [0.76, 0, 0.24, 1] as const;

export const viewportOnce = { once: true, amount: 0.25 } as const;
export const viewportEarly = { once: true, amount: 0.1 } as const;

export const transition = (
  duration = 0.7,
  delay = 0,
): Transition => ({ duration, delay, ease: easeOut });

/** Masked line: sits inside an overflow-hidden wrapper. */
export const lineVariants: Variants = {
  hidden: { y: "110%" },
  show: (i: number = 0) => ({
    y: "0%",
    transition: { duration: 0.9, delay: i * 0.075, ease: easeOut },
  }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.06, ease: easeOut },
  }),
};

export const hairline: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1, ease: easeOut } },
};

export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Neutralised variants for prefers-reduced-motion. */
export const still: Variants = {
  hidden: { opacity: 1, y: 0, scaleX: 1 },
  show: { opacity: 1, y: 0, scaleX: 1, transition: { duration: 0 } },
};
