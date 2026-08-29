import { useEffect, useRef } from "react";
import { gsap } from "../lib/animations";
import { skills } from "../data/skills";
import SectionLabel from "./SectionLabel";
import GhostNumeral from "./GhostNumeral";

export default function TheStack() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const groupsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const groups = groupsRef.current;

    if (title) {
      gsap.fromTo(
        title,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: title, start: "top 95%", toggleActions: "play none none reverse" },
        }
      );
    }

    if (groups) {
      const rows = groups.querySelectorAll(".skill-group");
      rows.forEach((row, i) => {
        const dir = i % 2 === 0 ? -20 : 20;
        gsap.fromTo(
          row,
          { x: dir, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 95%", toggleActions: "play none none reverse" },
            delay: i * 0.03,
          }
        );
      });
    }
  }, []);

  return (
    <section className="relative py-20 md:py-28 px-8 md:px-12 border-t border-[rgba(240,237,230,0.06)] overflow-hidden">
      <GhostNumeral value="09" />
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="09" label="Skills" />

        <h2
          ref={titleRef}
          className="font-display font-black uppercase text-[#f0ede6] mb-20"
          style={{ fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 0.95, letterSpacing: "-0.02em" }}
        >
          THE STACK
        </h2>

        <div ref={groupsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(240,237,230,0.06)]">
          {skills.map((group) => (
            <div key={group.category} className="skill-group bg-[#0c0c0b] p-8">
              <span className="font-mono text-[9px] text-[#38bdf8] tracking-[0.3em] uppercase block mb-6">
                {group.category}
              </span>
              <div className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <span key={item} className="font-body text-[#f0ede6] text-sm opacity-70 hover:opacity-100 transition-opacity duration-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
