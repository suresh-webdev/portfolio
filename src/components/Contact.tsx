import { useEffect, useRef } from "react";
import { gsap, splitChars, attachMagnetic } from "../lib/animations";
import { siteConfig } from "../data/siteConfig";
import SectionLabel from "./SectionLabel";
import GhostNumeral from "./GhostNumeral";
import { IconMail, IconLinkedIn, IconGithub } from "./icons";

export default function Contact() {
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const line1 = titleLine1Ref.current;
    const line2 = titleLine2Ref.current;
    const content = contentRef.current;

    if (line1 && line2) {
      const chars = [...splitChars(line1), ...splitChars(line2)];

      gsap.fromTo(
        chars,
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.7,
          stagger: 0.03,
          ease: "power3.out",
          scrollTrigger: { trigger: line1, start: "top 95%", toggleActions: "play none none reverse" },
        }
      );
    }

    if (content) {
      gsap.fromTo(
        content,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: content, start: "top 95%", toggleActions: "play none none reverse" },
        }
      );
    }
    const cleanup = attachMagnetic(ctaRef.current, 0.35, 14);
    return cleanup;
  }, []);

  return (
    <section id="contact" className="relative py-28 md:py-40 px-8 md:px-12 border-t border-[rgba(240,237,230,0.06)] overflow-hidden">
      <GhostNumeral value="11" />
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="11" label="Contact" />

        <div className="overflow-hidden mb-12">
          <h2
            className="font-display font-black uppercase text-[#f0ede6]"
            style={{ fontSize: "clamp(48px, 8vw, 120px)", lineHeight: 0.9, letterSpacing: "-0.02em" }}
          >
            <span ref={titleLine1Ref}>LET'S BUILD </span>
            <span ref={titleLine2Ref} className="block md:inline">
              SOMETHING.
            </span>
          </h2>
        </div>

        <div ref={contentRef}>
          <p className="font-body text-[#6b6860] text-base md:text-lg max-w-xl leading-relaxed mb-12">
            Have an interesting product, engineering problem or interface to build?
          </p>

          <a
            ref={ctaRef}
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            data-cursor-label="MESSAGE →"
            className="inline-flex items-center gap-4 group mb-10 border border-[rgba(240,237,230,0.2)] px-7 py-4 hover:border-[#38bdf8] hover:bg-[rgba(56,189,248,0.06)] transition-colors duration-300"
          >
            <span className="font-display font-bold text-[#f0ede6] text-xl md:text-2xl tracking-tight uppercase group-hover:text-[#38bdf8] transition-colors duration-300">
              GET IN TOUCH
            </span>
            <span className="font-mono text-[#38bdf8] text-xl group-hover:translate-x-3 transition-transform duration-300 inline-block">
              →
            </span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${siteConfig.email}`}
              data-cursor
              data-cursor-label="EMAIL"
              aria-label="Email"
              className="w-11 h-11 flex items-center justify-center border border-[rgba(240,237,230,0.15)] text-[#6b6860] hover:text-[#38bdf8] hover:border-[#38bdf8] transition-colors duration-300"
            >
              <IconMail className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              data-cursor-label="LINKEDIN"
              aria-label="LinkedIn"
              className="w-11 h-11 flex items-center justify-center border border-[rgba(240,237,230,0.15)] text-[#6b6860] hover:text-[#38bdf8] hover:border-[#38bdf8] transition-colors duration-300"
            >
              <IconLinkedIn className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              data-cursor-label="GITHUB"
              aria-label="GitHub"
              className="w-11 h-11 flex items-center justify-center border border-[rgba(240,237,230,0.15)] text-[#6b6860] hover:text-[#38bdf8] hover:border-[#38bdf8] transition-colors duration-300"
            >
              <IconGithub className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
