import { useEffect, useRef } from "react";
import { gsap, registerFieldSection, settle, settleGroup, wipe, ENTER } from "../lib/animations";
import { ENERGY } from "../lib/field";
import { experience } from "../data/experience";
import { PAD, SHELL } from "../lib/layout";
import SectionLabel from "./SectionLabel";
import GhostNumeral from "./GhostNumeral";

// TIMELINE — the page's quiet beat.
//
// Coming off the lattice, this section deliberately runs the field at its
// lowest level short of the blackout and asks almost nothing of the visitor.
// A page that is loud everywhere has no dynamics; this is where it exhales.
//
// The only scroll behaviour is that each period sticks while its own entry
// passes it. That is the whole idea of a timeline expressed as a scroll
// property rather than drawn as a dotted rule — and it replaces the second
// copy of the connecting line that used to live here, which the page-wide
// conduit now owns.

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanupField = registerFieldSection(sectionRef.current, ENERGY.timeline);
    const ctx = gsap.context(() => {
      wipe(headRef.current);
      listRef.current?.querySelectorAll<HTMLElement>(".entry").forEach((entry) => {
        settle(entry, 0, ENTER);
        settleGroup(entry.querySelectorAll(".hl"), { stagger: 0.05, y: 12 });
      });
    }, sectionRef);
    return () => {
      ctx.revert();
      cleanupField();
    };
  }, []);

  return (
    <section ref={sectionRef} id="timeline" data-section className="relative py-24 md:py-32">
      <GhostNumeral value="08" place="br" />
      <div className={`relative ${PAD} ${SHELL}`}>
        <SectionLabel index="08" label="Experience" />
        <h2 ref={headRef} className="display mt-8 mb-16 md:mb-24" style={{ fontSize: "clamp(52px, 8vw, 132px)" }}>
          Timeline
        </h2>

        <div ref={listRef}>
          {experience.map((entry, i) => (
            <div
              key={i}
              className="entry grid md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-6 md:gap-16 lg:gap-24 py-12 md:py-16 border-t border-[rgba(240,237,230,0.08)]"
            >
              {/* The period holds while its entry passes. */}
              <div className="md:sticky md:top-28 md:self-start">
                <span
                  className="display block text-[var(--color-muted)]"
                  style={{ fontSize: "clamp(26px, 3.4vw, 46px)", lineHeight: 0.92 }}
                >
                  {entry.period}
                </span>
              </div>

              <div className="max-w-2xl">
                <h3 className="display mb-1" style={{ fontSize: "clamp(22px, 2.4vw, 34px)" }}>
                  {entry.role}
                </h3>
                <span className="font-mono text-[10px] text-[var(--color-ember)] tracking-[0.24em] uppercase block mb-6">
                  {entry.company}
                </span>

                <div className="flex flex-col gap-3 mb-8">
                  {entry.description.map((d, j) => (
                    <p key={j} className="font-body text-[var(--color-muted)] text-sm leading-relaxed">
                      {d}
                    </p>
                  ))}
                </div>

                {entry.highlights && (
                  <ul className="flex flex-col gap-2.5">
                    {entry.highlights.map((h) => (
                      <li key={h} className="hl flex items-baseline gap-3">
                        <span className="flex-none h-px w-3 bg-[var(--color-ember)] translate-y-[-3px]" />
                        <span className="font-mono text-[10px] leading-relaxed tracking-wide text-[var(--color-fg)] opacity-75">
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
