import { useEffect, useRef } from "react";
import { gsap } from "../lib/animations";

export default function IBuildBoth() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    const title = titleRef.current;

    if (title) {
      gsap.fromTo(
        title,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: title, start: "top 95%", toggleActions: "play none none reverse" },
        }
      );
    }

    if (left && right) {
      gsap.fromTo(
        left,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: left, start: "top 95%", toggleActions: "play none none reverse" },
        }
      );
      gsap.fromTo(
        right,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: right, start: "top 95%", toggleActions: "play none none reverse" },
        }
      );

      // Opposing scroll movement
      gsap.fromTo(
        left,
        { x: 0 },
        {
          x: -30,
          ease: "none",
          scrollTrigger: {
            trigger: left.parentElement?.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      );
      gsap.fromTo(
        right,
        { x: 0 },
        {
          x: 30,
          ease: "none",
          scrollTrigger: {
            trigger: right.parentElement?.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      );
    }
  }, []);

  return (
    <section className="py-20 md:py-28 px-8 md:px-12 overflow-hidden border-t border-[rgba(240,237,230,0.06)]">
      <div className="max-w-7xl mx-auto">
        <h2
          ref={titleRef}
          className="font-display font-black uppercase text-[#f0ede6] text-center mb-20 md:mb-28"
          style={{ fontSize: "clamp(56px, 10vw, 140px)", lineHeight: 0.9, letterSpacing: "-0.02em" }}
        >
          I BUILD BOTH.
        </h2>

        <div className="grid md:grid-cols-2 gap-1">
          <div ref={leftRef} className="p-10 md:p-14 border border-[rgba(240,237,230,0.08)]">
            <span className="font-mono text-[9px] text-[#38bdf8] tracking-[0.3em] uppercase block mb-6">
              01 / Interfaces
            </span>
            <h3
              className="font-display font-black uppercase text-[#f0ede6] mb-6"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              INTERFACES
            </h3>
            <p className="font-body text-[#6b6860] text-base leading-relaxed">
              Interactive frontend experiences. Responsive interfaces consuming real APIs. Motion and visual
              execution under production performance budgets.
            </p>
          </div>

          <div ref={rightRef} className="p-10 md:p-14 border border-[rgba(240,237,230,0.08)] border-l-0 md:border-l">
            <span className="font-mono text-[9px] text-[#38bdf8] tracking-[0.3em] uppercase block mb-6">
              02 / Systems
            </span>
            <h3
              className="font-display font-black uppercase text-[#f0ede6] mb-6"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              SYSTEMS
            </h3>
            <p className="font-body text-[#6b6860] text-base leading-relaxed">
              APIs, services, data and infrastructure. End-to-end ownership from data model to deployment.
              Performance, reliability and production support.
            </p>
          </div>
        </div>

        <p className="font-body text-[#6b6860] text-sm text-center mt-12 max-w-xl mx-auto leading-relaxed">
          I care about how a product feels, but I also care about how it works underneath.
        </p>
      </div>
    </section>
  );
}
