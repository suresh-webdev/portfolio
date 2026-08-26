"use client";

import { experience } from "@/data/experience";
import { SectionHead } from "@/components/system/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import { TrajectoryBackdrop } from "@/components/backdrop/TrajectoryBackdrop";

export function Trajectory() {
  return (
    <section id="trajectory" className="surface-light relative">
      <TrajectoryBackdrop />
      <div className="u-shell u-section u-inner relative z-10">
        <SectionHead
          index="03"
          title="Trajectory"
          meta={`${experience.length} roles · 1 company`}
        />

        <div className="mt-2">
          {experience.map((role, i) => (
            <Reveal
              key={role.id}
              delay={i}
              className="grid gap-4 border-b border-(--surface-border) py-8 md:grid-cols-[10rem_1fr_11rem] md:gap-8 md:py-10"
            >
              <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-1.5">
                <span
                  className={cn(
                    "t-mono text-[0.75rem]",
                    role.current ? "text-ember" : "text-(--surface-fg-45)",
                  )}
                >
                  {role.from} — {role.to}
                </span>
                <span className="t-label">{role.duration}</span>
              </div>

              <div>
                <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="t-display text-[clamp(1.375rem,2.6vw,1.875rem)]">
                    {role.role}
                  </h3>
                  {role.current && (
                    <span className="t-label inline-flex items-center gap-1.5 text-ember">
                      <span className="h-1 w-1 rounded-full bg-ember" />
                      Current
                    </span>
                  )}
                </div>
                <p className="t-mono mb-4 text-[0.75rem] text-(--surface-fg-45)">
                  {role.company} · {role.stack}
                </p>
                <ul className="space-y-2">
                  {role.points.map((point) => (
                    <li
                      key={point}
                      className="t-body relative pl-4 text-[0.9375rem] before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:bg-(--surface-fg-28) before:content-['']"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden md:block" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
