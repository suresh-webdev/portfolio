"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sections, siteConfig, socials } from "@/data/site";
import { useScrollState } from "./ScrollState";
import { easeInOut, easeOut } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useMedia";
import { cn } from "@/lib/utils";
import { EmailAction } from "@/components/motion/EmailAction";

export function Nav() {
  const { active, scrolled } = useScrollState();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [close, open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled && !open
            ? "border-b border-[var(--bone-08)] bg-ink"
            : "border-b border-transparent",
        )}
      >
        <div className="u-shell flex h-16 items-center justify-between gap-6 md:h-20">
          <a
            href="#index"
            className="focus-ring hit group flex items-baseline gap-2.5"
            aria-label="Back to top"
          >
            <span className="t-mono text-[0.8125rem] tracking-tight">
              {siteConfig.shortName}
            </span>
            <span className="t-label hidden sm:inline">
              {siteConfig.role}
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Sections">
            {sections.slice(1).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cn(
                  "t-label focus-ring transition-colors duration-300 hover:text-bone",
                  active === s.id && "text-bone",
                )}
              >
                <span
                  className={cn(
                    "mr-2 inline-block transition-colors duration-300",
                    active === s.id
                      ? "text-ember"
                      : "text-[var(--bone-28)]",
                  )}
                >
                  {s.index}
                </span>
                {s.nav}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="link"
              className="t-label focus-ring hit link-draw hidden text-bone md:inline-flex"
            >
              Get in touch
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-panel"
              className="focus-ring hit -mr-1 flex items-center gap-2.5 px-1 lg:hidden"
            >
              <span className="t-label text-bone">
                {open ? "Close" : "Menu"}
              </span>
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-bone transition-all duration-300",
                    open ? "top-1.5 rotate-45" : "top-0.5",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-bone transition-all duration-300",
                    open ? "top-1.5 -rotate-45" : "top-2.5",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-panel"
            className="fixed inset-0 z-40 bg-ink lg:hidden"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={
              reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }
            }
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: easeInOut }}
          >
            <div className="u-shell flex h-full flex-col justify-between pb-10 pt-24">
              <nav aria-label="Sections">
                <ul>
                  {sections.map((s, i) => (
                    <li
                      key={s.id}
                      className="border-b border-[var(--bone-08)] last:border-b-0"
                    >
                      <motion.a
                        href={`#${s.id}`}
                        onClick={close}
                        className="focus-ring flex items-baseline gap-4 py-4"
                        initial={reduced ? false : { opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.15 + i * 0.05,
                          ease: easeOut,
                        }}
                      >
                        <span className="t-mono text-[0.6875rem] text-[var(--bone-28)]">
                          {s.index}
                        </span>
                        <span className="t-display text-[clamp(1.75rem,8vw,2.75rem)]">
                          {s.label}
                        </span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.external ? "_blank" : undefined}
                    rel={s.external ? "noreferrer noopener" : undefined}
                    className="t-label hit focus-ring link-draw text-bone"
                  >
                    {s.label}
                  </a>
                ))}
                <EmailAction className="t-label hit focus-ring link-draw text-bone">
                  Email
                </EmailAction>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
