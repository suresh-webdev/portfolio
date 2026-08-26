"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { easeInOut, easeOut } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useMedia";
import { siteConfig } from "@/data/site";

const BootContext = createContext(false);

/** True once the boot curtain is gone and the hero may play. */
export function useBootReady() {
  return useContext(BootContext);
}

const SESSION_KEY = "trace:booted";
const DURATION = 600;

export function BootProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [booting, setBooting] = useState(false);
  const [count, setCount] = useState(0);

  // Decide after mount so SSR and first paint agree on "no curtain".
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMounted(true);
      if (reduced) return;
      if (sessionStorage.getItem(SESSION_KEY)) return;
      setBooting(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => {
    if (!booting) return;

    document.body.dataset.locked = "true";
    window.scrollTo(0, 0);

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(SESSION_KEY, "1");
        setBooting(false);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [booting]);

  useEffect(() => {
    if (!booting) delete document.body.dataset.locked;
  }, [booting]);

  const ready = mounted && !booting;

  return (
    <BootContext.Provider value={ready}>
      {children}
      <AnimatePresence>
        {booting && (
          <motion.div
            key="boot"
            className="fixed inset-0 z-[100] bg-ink"
            initial={{ y: 0 }}
            exit={{ y: "-101%" }}
            transition={{ duration: 0.45, ease: easeInOut }}
            aria-hidden="true"
          >
            <div className="u-shell flex h-full flex-col justify-between py-8 md:py-10">
              <motion.p
                className="t-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: easeOut }}
              >
                <span className="tick" />
                Trace initialising
              </motion.p>

              <div className="flex items-end justify-between gap-6">
                <motion.p
                  className="t-display s-md max-w-[10ch]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
                >
                  {siteConfig.name}
                </motion.p>
                <p className="t-mono text-[clamp(2.5rem,9vw,6rem)] leading-none tabular-nums">
                  {String(count).padStart(3, "0")}
                </p>
              </div>

              <div className="relative h-px w-full bg-[var(--bone-14)]">
                <div
                  className="absolute inset-y-0 left-0 bg-ember"
                  style={{ width: `${count}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BootContext.Provider>
  );
}
