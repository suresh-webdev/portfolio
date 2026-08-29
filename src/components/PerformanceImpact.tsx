import { useEffect, useRef } from "react";
import { gsap } from "../lib/animations";
import { metrics } from "../data/metrics";
import GhostNumeral from "./GhostNumeral";

export default function PerformanceImpact() {
  const fromRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const from = fromRef.current;
    const arrow = arrowRef.current;
    const to = toRef.current;
    const pct = pctRef.current;
    const desc = descRef.current;
    const metricsEl = metricsRef.current;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: from?.parentElement?.parentElement, start: "top 70%" },
    });

    if (from) tl.fromTo(from, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 0);
    if (arrow)
      tl.fromTo(
        arrow,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
        0.5
      );
    if (to) tl.fromTo(to, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 0.7);
    if (pct) tl.fromTo(pct, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.0);
    if (desc) tl.fromTo(desc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.1);

    // Metrics stagger
    if (metricsEl) {
      const items = metricsEl.querySelectorAll(".metric-item");
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: metricsEl, start: "top 80%" },
        }
      );
    }
  }, []);

  return (
    <section className="relative py-28 md:py-40 px-8 md:px-12 border-t border-[rgba(240,237,230,0.06)] overflow-hidden">
      <GhostNumeral value="08" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <span className="font-mono text-[9px] text-[#d4a843] tracking-[0.3em] uppercase">
            08 / Engineering Impact
          </span>
        </div>

        {/* 500ms → 50ms */}
        <div className="mb-8 overflow-hidden">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <span
              ref={fromRef}
              className="font-display font-black text-[#6b6860]"
              style={{ fontSize: "clamp(64px, 12vw, 160px)", lineHeight: 0.9, letterSpacing: "-0.03em" }}
            >
              500ms
            </span>
            <div
              ref={arrowRef}
              className="flex items-center gap-2 origin-left"
            >
              <div className="w-12 md:w-24 h-px bg-[#d4a843]" />
              <span
                className="font-display font-bold text-[#d4a843]"
                style={{ fontSize: "clamp(24px, 4vw, 48px)" }}
              >
                →
              </span>
            </div>
            <span
              ref={toRef}
              className="font-display font-black text-[#f0ede6]"
              style={{ fontSize: "clamp(64px, 12vw, 160px)", lineHeight: 0.9, letterSpacing: "-0.03em" }}
            >
              50ms
            </span>
          </div>

          <div ref={pctRef} className="mt-4">
            <span className="font-mono text-[10px] text-[#d4a843] tracking-[0.3em] uppercase">Core API Latency</span>
            <span className="font-display font-black text-[rgba(240,237,230,0.08)] ml-4"
              style={{ fontSize: "clamp(32px, 6vw, 80px)" }}>
              90%
            </span>
          </div>
        </div>

        <p ref={descRef} className="font-body text-[#6b6860] text-sm md:text-base max-w-lg leading-relaxed mb-16">
          Reduced core REST API latency by 90% through query optimization, indexing and caching, validated with
          performance profiling under load.
        </p>

        {/* Engineering Numbers grid */}
        <div ref={metricsRef} className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[rgba(240,237,230,0.06)]">
          {metrics.map((m) => (
            <div key={m.value} className="metric-item bg-[#0c0c0b] p-8 md:p-10">
              <span
                className="font-display font-black text-[#f0ede6] block mb-2"
                style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 0.9, letterSpacing: "-0.02em" }}
              >
                {m.value}
              </span>
              <span className="font-mono text-[9px] text-[#6b6860] tracking-[0.2em] uppercase">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
