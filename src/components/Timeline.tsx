import { useEffect, useRef } from "react";
import { gsap } from "../lib/animations";
import SectionLabel from "./SectionLabel";
import GhostNumeral from "./GhostNumeral";
import { experience } from "../data/experience";

export default function Timeline() {
  const listRef = useRef<HTMLDivElement>(null);

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
          scrollTrigger: { trigger: item, start: "top 88%" },
        }
      );
    });
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

        <div ref={listRef} className="flex flex-col">
          {experience.map((entry, i) => (
            <div
              key={i}
              className="timeline-item border-t border-[rgba(240,237,230,0.1)] py-12 grid md:grid-cols-[200px_1fr] gap-8"
            >
              <div>
                <span className="font-mono text-[9px] text-[#d4a843] tracking-[0.2em] block leading-relaxed">
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
                        <span className="text-[#d4a843] font-mono text-[10px] mt-0.5">→</span>
                        <span className="font-mono text-[10px] text-[#f0ede6] opacity-70 tracking-wide">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="border-t border-[rgba(240,237,230,0.1)] py-12 mt-4">
          <div className="grid md:grid-cols-[200px_1fr] gap-8">
            <div>
              <span className="font-mono text-[9px] text-[#d4a843] tracking-[0.2em] block">2021 — 2025</span>
            </div>
            <div>
              <h3 className="font-display font-bold uppercase text-[#f0ede6] text-xl md:text-2xl tracking-tight mb-1">
                B.Tech — Information Technology
              </h3>
              <span className="font-mono text-[10px] text-[#6b6860] tracking-[0.2em] uppercase block mb-4">
                SNS College of Engineering, Coimbatore
              </span>
              <span className="font-mono text-[9px] text-[#d4a843] tracking-[0.2em]">GPA: 8.7 / 10</span>
            </div>
          </div>
        </div>

        {/* Additional */}
        <div className="border-t border-[rgba(240,237,230,0.06)] pt-10">
          <div className="grid md:grid-cols-[200px_1fr] gap-8">
            <div>
              <span className="font-mono text-[9px] text-[#6b6860] tracking-[0.2em] block">Additional</span>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <span className="font-display font-bold text-[#f0ede6] text-2xl block mb-1">100+</span>
                <span className="font-mono text-[9px] text-[#6b6860] tracking-[0.2em] uppercase">
                  LeetCode Problems
                </span>
              </div>
              <div>
                <span className="font-mono text-[9px] text-[#6b6860] tracking-[0.2em] uppercase block mb-2">
                  Certifications
                </span>
                <div className="flex gap-3 flex-wrap">
                  {["NPTEL", "Coursera", "Udemy"].map((cert) => (
                    <span
                      key={cert}
                      className="font-mono text-[9px] text-[#6b6860] border border-[rgba(240,237,230,0.08)] px-2.5 py-1"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
