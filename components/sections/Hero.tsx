"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { LineReveal } from "@/components/motion/LineReveal";
import { Scramble } from "@/components/motion/Scramble";
import { Magnetic } from "@/components/motion/Magnetic";
import { useBootReady } from "@/components/system/Boot";
import { easeOut } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useMedia";
import { HeroBackdrop } from "@/components/backdrop/HeroBackdrop";
import { HeroScene } from "@/components/three/HeroScene";

export function Hero() {
  const ready = useBootReady();
  const reduced = useReducedMotion();
  const play = reduced || ready;

  return (
    <section
      id="index"
      className="surface-dark relative flex min-h-[100svh] flex-col justify-between pb-8 pt-24 md:pb-10 md:pt-28"
    >
      <HeroBackdrop />

      <div className="u-shell u-inner relative z-10 flex flex-1 flex-col justify-center">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div>
            <motion.p
              className="t-label mb-5"
              initial={reduced ? false : { opacity: 0 }}
              animate={play ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
            >
              &ldquo;Hello world&rdquo;. I&apos;m
            </motion.p>

            <h1 className="t-display s-xl">
              <LineReveal
                immediate
                play={play}
                delay={0.35}
                lines={["Suresh."]}
              />
            </h1>

            <motion.p
              className="t-mono mt-4 text-[clamp(1.125rem,2.2vw,1.5rem)] text-ember"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={play ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.75 }}
            >
              &gt; Full-stack engineer
            </motion.p>

            <motion.p
              className="t-label mt-6 flex items-center gap-2.5"
              initial={reduced ? false : { opacity: 0 }}
              animate={play ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.9 }}
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
              </span>
              <Scramble text={siteConfig.intro} speed={18} />
            </motion.p>

            <motion.p
              className="t-body mt-6"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={play ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: easeOut, delay: 1.05 }}
            >
              I own things end to end — interface through infrastructure,
              one thread of responsibility from a user&apos;s click to the
              row it writes.
            </motion.p>

            <motion.div
              className="mt-7 flex items-center gap-3"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={play ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: easeOut, delay: 1.2 }}
            >
              <Magnetic pull={0.4}>
                <a
                  href="#work"
                  data-cursor="link"
                  className="hit focus-ring inline-flex items-center gap-3 rounded-full border border-(--surface-border-strong) px-5 py-2.5 transition-colors duration-300 hover:border-fg"
                >
                  <span className="t-label text-fg">
                    View work
                  </span>
                </a>
              </Magnetic>
              <Magnetic pull={0.5}>
                <a
                  href={siteConfig.resume}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="hit focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-300 hover:scale-105"
                  aria-label="Open résumé"
                >
                  <span className="t-mono text-xs">CV</span>
                </a>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            className="relative hidden aspect-square w-full max-w-120 justify-self-center lg:block"
            initial={reduced ? false : { opacity: 0, scale: 0.85 }}
            animate={play ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: easeOut, delay: 0.5 }}
            aria-hidden="true"
          >
            <div
              className="pointer-events-none absolute inset-[8%] rounded-full opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,77,25,0.16), transparent 70%)",
              }}
            />
            <HeroScene />
          </motion.div>
        </div>
      </div>

      <div className="u-shell u-inner relative z-10">
        <div className="grid grid-cols-2 gap-6 border-t border-(--surface-border) pt-5 md:grid-cols-4">
          {[
            ["Based in", siteConfig.location],
            ["Currently", siteConfig.discipline],
            ["Focus", "Product engineering"],
            ["Scroll", "for the stack ↓"],
          ].map(([k, v], i) => (
            <motion.div
              key={k}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={play ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: easeOut,
                delay: 1.4 + i * 0.06,
              }}
            >
              <p className="t-label mb-1.5">{k}</p>
              <p className="t-mono text-[0.8125rem] text-(--surface-fg-70)">
                {v}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
