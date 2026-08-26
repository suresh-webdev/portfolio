"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { sections, type SectionId } from "@/data/site";

type ScrollStateValue = {
  active: SectionId;
  activeIndex: number;
  /** 0 → 1 across the whole document. */
  progress: number;
  scrolled: boolean;
};

const ScrollStateContext = createContext<ScrollStateValue>({
  active: "index",
  activeIndex: 0,
  progress: 0,
  scrolled: false,
});

export function useScrollState() {
  return useContext(ScrollStateContext);
}

/**
 * One observer for the whole page — the rail, the nav and the section
 * counter all read the same source, so they can never disagree.
 */
export function ScrollStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<SectionId>("index");
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));

    // Trigger line sits a third down the viewport: a section becomes
    // "current" when its content actually occupies the reading zone.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-33% 0px -55% 0px", threshold: [0, 0.15, 0.5, 1] },
    );

    nodes.forEach((n) => observer.observe(n));

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
        setScrolled(window.scrollY > 24);
        raf = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const value = useMemo<ScrollStateValue>(() => {
    const idx = sections.findIndex((s) => s.id === active);
    return {
      active,
      activeIndex: idx < 0 ? 0 : idx,
      progress,
      scrolled,
    };
  }, [active, progress, scrolled]);

  return (
    <ScrollStateContext.Provider value={value}>
      {children}
    </ScrollStateContext.Provider>
  );
}
