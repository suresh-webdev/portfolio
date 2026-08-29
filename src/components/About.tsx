import { useEffect, useRef } from "react";
import { gsap } from "../lib/animations";
import SectionLabel from "./SectionLabel";
import GhostNumeral from "./GhostNumeral";

export default function About() {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".about-line");
    gsap.fromTo(
      items,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      }
    );
  }, []);

  return (
    <section id="about" className="relative py-24 md:py-32 px-8 md:px-12 border-t border-[rgba(240,237,230,0.06)] overflow-hidden">
      <GhostNumeral value="14" />
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="14" label="About" />
        <div className="grid md:grid-cols-[1fr_2fr] gap-16" ref={blockRef}>
          <div>
            <h2
              className="about-line font-display font-black uppercase text-[#f0ede6]"
              style={{ fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.01em" }}
            >
              SURESH S
            </h2>
          </div>
          <div className="flex flex-col gap-8">
            <p className="about-line font-body text-[#f0ede6] text-lg leading-relaxed opacity-80">
              I enjoy working on difficult engineering problems — performance, reliability, APIs, data,
              infrastructure and the interfaces that bring everything together.
            </p>
            <p className="about-line font-body text-[#6b6860] text-base leading-relaxed">
              My work spans backend systems, cloud infrastructure, AI-powered workflows and interactive frontend
              experiences. I don't only build APIs. I can own the contract from data model to screen.
            </p>
            <div className="about-line flex flex-wrap gap-2 pt-4">
              {["DATA MODEL", "API", "BACKEND", "SERVICES", "INFRASTRUCTURE", "INTERFACE"].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#f0ede6] opacity-50 uppercase">
                    {step}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="font-mono text-[9px] text-[#d4a843]">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
