import { useEffect, useRef } from "react";
import { gsap, splitChars } from "../lib/animations";
import { siteConfig } from "../data/siteConfig";
import GhostNumeral from "./GhostNumeral";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const stmtRef = useRef<HTMLParagraphElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const name = nameRef.current;
    const role = roleRef.current;
    const stmt = stmtRef.current;
    const stack = stackRef.current;
    const scroll = scrollRef.current;
    const line = lineRef.current;

    if (!name) return;

    const chars = splitChars(name);

    tl.set([name, role, stmt, stack, scroll, line], { visibility: "visible" })
      .fromTo(chars, { y: "110%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.8, stagger: 0.04 }, 0.2)
      .fromTo(role, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.9)
      .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 1.0)
      .fromTo(stmt, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 1.1)
      .fromTo(stack, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.3)
      .fromTo(scroll, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.7);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-20 px-8 md:px-12 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(240,237,230,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,237,230,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <GhostNumeral value="01" />

      <div className="relative z-10 max-w-7xl">
        {/* Overflowing name */}
        <div className="overflow-hidden mb-2">
          <h1
            ref={nameRef}
            className="font-display font-black uppercase text-[#f0ede6] invisible"
            style={{ fontSize: "clamp(72px, 14vw, 200px)", lineHeight: 0.9, letterSpacing: "-0.02em" }}
          >
            {siteConfig.name}
          </h1>
        </div>

        {/* Role */}
        <div ref={roleRef} className="invisible flex items-center gap-4 mb-6 mt-4">
          <span className="font-mono text-[11px] text-[#d4a843] tracking-[0.3em] uppercase">
            {siteConfig.role}
          </span>
          <span className="text-[#6b6860] font-mono text-[11px]">·</span>
          <span className="font-mono text-[11px] text-[#6b6860] tracking-[0.2em] uppercase">
            Full-Stack Engineering
          </span>
        </div>

        {/* Divider */}
        <div
          ref={lineRef}
          className="invisible h-px bg-[#f0ede6] mb-8 origin-left"
          style={{ opacity: 0.12, maxWidth: "40vw" }}
        />

        {/* Statement */}
        <p
          ref={stmtRef}
          className="invisible font-body text-[#6b6860] text-lg md:text-xl max-w-xl leading-relaxed mb-8"
        >
          {siteConfig.tagline}
        </p>

        {/* Stack */}
        <div ref={stackRef} className="invisible flex flex-wrap gap-3">
          {siteConfig.stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[10px] tracking-[0.25em] text-[#6b6860] border border-[rgba(240,237,230,0.1)] px-3 py-1.5 uppercase"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="invisible absolute bottom-8 right-8 md:right-12 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-[#6b6860] uppercase rotate-90 origin-right mb-4">
          Scroll
        </span>
        <div className="w-px h-12 bg-[#6b6860] relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-[#d4a843]"
            style={{
              height: "40%",
              animation: "scrollLine 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  );
}
