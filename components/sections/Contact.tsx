"use client";

import { ArrowUpRight } from "lucide-react";
import { siteConfig, socials } from "@/data/site";
import { LineReveal } from "@/components/motion/LineReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { EmailAction } from "@/components/motion/EmailAction";
import { ContactBackdrop } from "@/components/backdrop/ContactBackdrop";

/**
 * The one light surface on the site — bone ground, ink type. Everything
 * that came before was a system being explained; this is the handoff.
 */
export function Contact() {
  return (
    <section
      id="contact"
      className="surface-light relative"
    >
      <ContactBackdrop />

      <div className="u-shell u-inner u-section relative z-10">
        <div className="grid items-baseline gap-x-8 gap-y-3 pb-8 md:grid-cols-[5rem_1fr]">
          <span className="t-mono text-[0.6875rem] tracking-[0.2em] text-ember">
            05
          </span>
          <p className="t-label">Let&apos;s talk</p>
        </div>

        <h2 className="t-display s-lg mb-10 max-w-4xl md:mb-14">
          <LineReveal
            lines={["If any of this", "resonated —", "say hello."]}
          />
        </h2>

        <div className="grid gap-10 border-t border-[var(--surface-border)] pt-10 md:grid-cols-[1fr_auto] md:items-end md:gap-8">
          <Reveal>
            <p className="t-body mb-8">
              I like talking about the things I build. If something above
              caught your eye — a project, a decision, or just the code
              itself — I&apos;d enjoy hearing from you.
            </p>

            <Magnetic pull={0.3}>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="link"
                className="hit focus-ring group inline-flex items-center gap-4 rounded-full bg-ink px-7 py-4 text-bone transition-transform duration-300 hover:scale-[1.02]"
              >
                <span className="t-mono text-[0.875rem]">
                  Say hello on LinkedIn
                </span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </a>
            </Magnetic>
          </Reveal>

          <Reveal delay={1} className="flex flex-col gap-3 md:items-end">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.external ? "_blank" : undefined}
                rel={s.external ? "noreferrer noopener" : undefined}
                data-cursor="link"
                className="hit focus-ring link-draw t-mono text-[0.8125rem] text-[var(--surface-fg-70)] hover:text-[var(--surface-fg)]"
              >
                {s.label} — {s.short}
              </a>
            ))}
            <EmailAction className="hit focus-ring link-draw t-mono text-[0.8125rem] text-[var(--surface-fg-70)] hover:text-[var(--surface-fg)]">
              Email — EM
            </EmailAction>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--surface-border)] pt-6 md:mt-24">
          <span className="t-mono text-[0.6875rem] text-[var(--surface-fg-45)]">
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <span className="t-mono text-[0.6875rem] text-[var(--surface-fg-45)]">
            {siteConfig.location} · built with Next.js
          </span>
        </div>
      </div>
    </section>
  );
}
