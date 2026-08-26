"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionHead } from "@/components/system/SectionHead";
import { AssetSlot } from "@/components/media/AssetSlot";
import { WorkBackdrop } from "@/components/backdrop/WorkBackdrop";
import { easeOut } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useMedia";
import { cn } from "@/lib/utils";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/animations/gsap";

/** Scroll distance per project, in viewport-heights, while the panel is pinned. */
const VH_PER_PROJECT = 0.8;

/**
 * One pinned editor window. GSAP ScrollTrigger pins the panel and scrubs
 * a progress value as the section's runway scrolls past; progress maps
 * to how many tabs have "opened" so far. Each new tab mounts and animates
 * up into the strip via Framer Motion; scrolling back up un-mounts it in
 * reverse, so the whole thing is naturally bidirectional. Clicking any
 * open tab previews it until the next scroll-driven change takes over.
 */
export function Work() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(() =>
    reduced ? projects.length - 1 : 0,
  );
  const [viewedIndex, setViewedIndex] = useState(() =>
    reduced ? projects.length - 1 : 0,
  );

  useEffect(() => {
    if (reduced) return;

    registerGsap();
    const container = containerRef.current;
    const panel = panelRef.current;
    if (!container || !panel) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top+=5rem",
        end: () => `+=${window.innerHeight * VH_PER_PROJECT * (projects.length - 1)}`,
        pin: panel,
        pinSpacing: true,
        scrub: 0.4,
        onUpdate: (self) => {
          const idx = Math.min(
            projects.length - 1,
            Math.floor(self.progress * projects.length),
          );
          setActiveIndex(idx);
          setViewedIndex(idx);
        },
      });
    }, container);

    return () => ctx.revert();
  }, [reduced]);

  const open = projects.slice(0, activeIndex + 1);
  const project = projects[viewedIndex];

  return (
    <section id="work" className="surface-dark relative">
      <WorkBackdrop />

      <div className="u-shell u-inner relative z-10">
        <div className="u-section pb-0">
          <SectionHead
            index="02"
            title="Selected work"
            meta={`${projects.length} shipped surfaces`}
          />
        </div>

        <div ref={containerRef} className="pb-24 pt-10 md:pt-14">
          <div
            ref={panelRef}
            className="flex h-[88svh] flex-col justify-center py-4"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-(--surface-border-strong) bg-surface-raised shadow-[0_30px_90px_-30px_rgba(0,0,0,0.7)]">
              {/* Terminal chrome + growing tab strip */}
              <div className="flex shrink-0 items-center gap-3 border-b border-(--surface-border) bg-surface px-5 py-4 md:px-7">
                <div className="flex shrink-0 items-center gap-2 pr-2">
                  <span className="h-3 w-3 rounded-full bg-(--surface-fg-28)" />
                  <span className="h-3 w-3 rounded-full bg-(--surface-fg-28)" />
                  <span className="h-3 w-3 rounded-full bg-ember/70" />
                </div>

                <div className="no-bar edge-fade flex flex-1 items-center gap-1.5 overflow-x-auto">
                  <AnimatePresence initial={false}>
                    {open.map((p, i) => {
                      const isViewed = i === viewedIndex;
                      return (
                        <motion.button
                          key={p.id}
                          type="button"
                          onClick={() => setViewedIndex(i)}
                          data-cursor="link"
                          initial={reduced ? false : { opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
                          transition={{ duration: 0.4, ease: easeOut }}
                          className={cn(
                            "t-mono flex shrink-0 items-center gap-2 rounded-t-md border-x border-t px-3.5 py-2 text-[0.75rem] transition-colors duration-300",
                            isViewed
                              ? "border-(--surface-border-strong) bg-surface-raised text-fg"
                              : "border-transparent text-(--surface-fg-45) hover:text-(--surface-fg-70)",
                          )}
                        >
                          <span className={isViewed ? "text-ember" : undefined}>
                            [{p.index}]
                          </span>
                          {p.id}.tsx
                          <span className="text-(--surface-fg-28)">×</span>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>

                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  aria-label={`Open ${project.name}`}
                  className="hit focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--surface-border-strong) transition-colors duration-300 hover:border-fg"
                >
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </a>
              </div>

              {/*
                Active tab's content. Default (non-"wait") AnimatePresence
                mode — this is keyed by the same scroll-driven index as the
                tabs, which can tick many times per second during a scrub.
                "wait" mode queues each exit before the next enter starts;
                a fast-changing key means that queue never drains, so the
                pane gets stuck invisible mid-exit. Overlapping mode has no
                such queue. Panes are absolutely positioned within this
                relative wrapper so an overlapping in/out pair doesn't
                stack and push the layout taller mid-crossfade.
              */}
              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence>
                  <motion.div
                    key={project.id}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                    className="absolute inset-0 grid gap-8 overflow-y-auto p-7 md:grid-cols-[18rem_1fr] md:gap-12 md:p-12"
                  >
                  <div className="space-y-6">
                    <AssetSlot
                      src={project.image}
                      alt={`${project.name} preview`}
                      caption={project.name}
                      spec="1440 × 900"
                      className="aspect-8/5 w-full rounded-sm"
                      sizes="(max-width: 768px) 100vw, 18rem"
                    />
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
                      <div>
                        <p className="t-mono mb-1 text-[0.6875rem] text-(--surface-fg-45)">
                          [Category]
                        </p>
                        <p className="t-mono text-[0.75rem] text-(--surface-fg-70)">
                          {project.category}
                        </p>
                      </div>
                      <div>
                        <p className="t-mono mb-1 text-[0.6875rem] text-(--surface-fg-45)">
                          [Role]
                        </p>
                        <p className="t-mono text-[0.75rem] text-(--surface-fg-70)">
                          {project.discipline}
                        </p>
                      </div>
                      <div>
                        <p className="t-mono mb-1 text-[0.6875rem] text-(--surface-fg-45)">
                          [Status]
                        </p>
                        <p className="t-mono text-[0.75rem] text-(--surface-fg-70)">
                          {project.statusLabel ?? "Case study"} · {project.year}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="t-mono mb-2 text-[0.6875rem] text-(--surface-fg-45)">
                      [Summary]
                    </p>
                    <p className="t-lead mb-7 max-w-none!">{project.summary}</p>

                    <p className="t-mono mb-2 text-[0.6875rem] text-(--surface-fg-45)">
                      [Contribution]
                    </p>
                    <p className="t-body mb-7 max-w-none! text-(--surface-fg-70)">
                      {project.contribution}
                    </p>

                    <p className="t-mono mb-3 text-[0.6875rem] text-(--surface-fg-45)">
                      [Stack]
                    </p>
                    <ul className="mb-7 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <li
                          key={t}
                          className="t-mono rounded-full border border-(--surface-border) px-3 py-1.5 text-[0.75rem] text-(--surface-fg-70)"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="hit focus-ring link-draw inline-flex items-center gap-2 text-fg"
                    >
                      <span className="t-mono text-[0.9375rem]">{project.domain}</span>
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                    </a>
                  </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <p className="t-mono mt-4 text-center text-[0.6875rem] text-(--surface-fg-28) md:hidden">
              scroll to open more tabs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
