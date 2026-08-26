"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stackLayers } from "@/data/stack";
import { SectionHead } from "@/components/system/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { Scramble } from "@/components/motion/Scramble";
import { easeOut } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useMedia";
import { cn } from "@/lib/utils";
import { StackBackdrop } from "@/components/backdrop/StackBackdrop";

/**
 * The vertical slice, read top-down as a request descending the stack.
 * Rows expand accordion-style — one open at a time, connected by a spine
 * that makes the "this is one continuous system" claim visually literal.
 */
export function Stack() {
  const [openId, setOpenId] = useState(stackLayers[0].id);
  const reduced = useReducedMotion();

  return (
    <section id="trace" className="surface-light relative">
      <StackBackdrop />
      <div className="u-shell u-section u-inner relative z-10">
        <SectionHead
          index="01"
          title="The stack I own"
          meta={`${stackLayers.length} layers · client → cloud`}
        />

        <div className="relative mt-4">
          <div
            className="absolute bottom-0 left-[1.4rem] top-0 hidden w-px bg-(--surface-fg-14) md:block"
            aria-hidden="true"
          />

          {stackLayers.map((layer, i) => {
            const open = openId === layer.id;
            return (
              <Reveal
                key={layer.id}
                delay={i}
                className="relative border-b border-(--surface-border)"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? "" : layer.id)}
                  aria-expanded={open}
                  data-cursor="link"
                  className="focus-ring group grid w-full grid-cols-[1.9rem_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[2.9rem_9rem_1fr_auto] md:gap-6 md:py-7"
                >
                  <span
                    className={cn(
                      "hidden h-2.5 w-2.5 rounded-full border transition-colors duration-500 md:block",
                      open
                        ? "border-ember bg-ember"
                        : "border-(--surface-fg-28) bg-transparent",
                    )}
                    style={{ marginLeft: "0.55rem" }}
                    aria-hidden="true"
                  />

                  <span className="t-mono text-[0.6875rem] text-(--surface-fg-45) md:hidden">
                    {layer.index}
                  </span>

                  <span className="hidden t-mono text-[0.6875rem] text-(--surface-fg-45) md:block">
                    {layer.index} · {layer.span}
                  </span>

                  <span className="t-display text-[clamp(1.5rem,3.2vw,2.5rem)] transition-colors duration-300 group-hover:text-fg">
                    {layer.name}
                  </span>

                  <span
                    className={cn(
                      "t-mono flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                      open
                        ? "rotate-45 border-ember text-ember"
                        : "border-(--surface-fg-28) text-(--surface-fg-45)",
                    )}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="panel"
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduced ? {} : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: easeOut }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-8 pl-0 md:grid-cols-[2.9rem_9rem_1fr_2.5rem] md:gap-6 md:pl-0">
                        <div className="hidden md:block" />
                        <div className="hidden md:block" />
                        <div className="max-w-2xl">
                          <p className="t-lead mb-4">
                            <Scramble text={layer.claim} speed={12} />
                          </p>
                          <p className="t-body mb-6">{layer.detail}</p>
                          <ul className="flex flex-wrap gap-2">
                            {layer.tech.map((t) => (
                              <li
                                key={t}
                                className="t-mono rounded-full border border-(--surface-border) px-3 py-1.5 text-[0.6875rem] text-(--surface-fg-70)"
                              >
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
