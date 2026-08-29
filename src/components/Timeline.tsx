import { useEffect, useRef } from "react";
import { gsap } from "../lib/animations";
import SectionLabel from "./SectionLabel";
import GhostNumeral from "./GhostNumeral";
import { experience } from "../data/experience";

const LINE_OFFSET = 200;

export default function Timeline() {
  const listRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = list.querySelectorAll(".timeline-item");
    items.forEach((item) => {
      gsap.fromTo(
        item,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 95%", toggleActions: "play none none reverse" },
        }
      );
    });

    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: list,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        }
      );
    }
  }, []);

  return (
    <section id="timeline" className="relative py-24 md:py-32 px-8 md:px-12 border-t border-[rgba(240,237,230,0.06)] overflow-hidden">
      <GhostNumeral value="15" />
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="15" label="Experience" />

        <h2
          className="font-display font-black uppercase text-[#f0ede6] mb-20"
          style={{ fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 0.95, letterSpacing: "-0.02em" }}
        >
          TIMELINE
        </h2>

        <div ref={listRef} className="relative flex flex-col">
          {/* Connecting line: faint track plus a scroll-scrubbed accent
              segment that draws downward as the reader moves through the
              entries below it. */}
          <div
            className="hidden md:block absolute top-0 bottom-0 w-px bg-[rgba(240,237,230,0.1)]"
            style={{ left: LINE_OFFSET }}
          />
          <div
            ref={progressRef}
            className="hidden md:block absolute top-0 w-px h-full bg-[#38bdf8] origin-top"
            style={{ left: LINE_OFFSET, transform: "scaleY(0)" }}
          />

          {experience.map((entry, i) => (
            <div
              key={i}
              className="timeline-item relative border-t border-[rgba(240,237,230,0.1)] py-12 grid md:grid-cols-[200px_1fr] gap-8"
            >
              <div
                className="hidden md:block absolute w-2.5 h-2.5 rounded-full bg-[#38bdf8] border-2 border-[#0c0c0b]"
                style={{ left: LINE_OFFSET - 5, top: 52 }}
              />
              <div>
                <span className="font-mono text-[9px] text-[#38bdf8] tracking-[0.2em] block leading-relaxed">
                  {entry.period}
                </span>
              </div>
              <div>
                <div className="mb-4">
                  <h3 className="font-display font-bold uppercase text-[#f0ede6] text-xl md:text-2xl tracking-tight mb-1">
                    {entry.role}
                  </h3>
                  <span className="font-mono text-[10px] text-[#6b6860] tracking-[0.2em] uppercase">
                    {entry.company}
                  </span>
                </div>
                <div className="flex flex-col gap-3 mb-6">
                  {entry.description.map((d, j) => (
                    <p key={j} className="font-body text-[#6b6860] text-sm leading-relaxed">
                      {d}
                    </p>
                  ))}
                </div>
                {entry.highlights && (
                  <div className="flex flex-col gap-2">
                    {entry.highlights.map((h) => (
                      <div key={h} className="flex items-start gap-3">
                        <span className="text-[#38bdf8] font-mono text-[10px] mt-0.5">→</span>
                        <span className="font-mono text-[10px] text-[#f0ede6] opacity-70 tracking-wide">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
