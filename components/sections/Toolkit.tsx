"use client";

import { toolkit } from "@/data/toolkit";
import { SectionHead } from "@/components/system/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { ToolkitBackdrop } from "@/components/backdrop/ToolkitBackdrop";

export function Toolkit() {
  return (
    <section id="toolkit" className="surface-charcoal relative">
      <ToolkitBackdrop />
      <div className="u-shell u-section u-inner relative z-10">
        <SectionHead
          index="04"
          title="Toolkit"
          meta={`${toolkit.reduce((n, g) => n + g.tech.length, 0)} tools`}
        />

        <div className="mt-2 grid grid-cols-1 gap-px bg-(--surface-border) sm:grid-cols-2 lg:grid-cols-3">
          {toolkit.map((group, i) => (
            <Reveal
              key={group.id}
              delay={Math.min(i, 5)}
              className="group relative bg-surface p-6 transition-colors duration-500 hover:bg-surface-raised md:p-8"
            >
              <div className="mb-5 flex items-baseline justify-between gap-3">
                <h3 className="t-display text-[clamp(1.25rem,2.1vw,1.625rem)]">
                  {group.label}
                </h3>
                <span className="t-mono text-[0.6875rem] text-(--surface-fg-28)">
                  {String(group.tech.length).padStart(2, "0")}
                </span>
              </div>
              <p className="t-label mb-5">{group.note}</p>
              <ul className="flex flex-wrap gap-2">
                {group.tech.map((tech) => (
                  <li
                    key={tech}
                    className="t-mono rounded-full border border-(--surface-border) px-3 py-1.5 text-[0.6875rem] text-(--surface-fg-70) transition-colors duration-300 group-hover:border-(--surface-fg-28)"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
