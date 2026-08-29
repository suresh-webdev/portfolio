import { useEffect, useRef } from "react";
import { gsap, splitChars, attachMagnetic } from "../lib/animations";
import { siteConfig } from "../data/siteConfig";
import SectionLabel from "./SectionLabel";
import GhostNumeral from "./GhostNumeral";

export default function Contact() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const content = contentRef.current;

    if (title) {
      const chars = splitChars(title);

      gsap.fromTo(
        chars,
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.7,
          stagger: 0.03,
          ease: "power3.out",
          scrollTrigger: { trigger: title, start: "top 80%" },
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
          scrollTrigger: { trigger: content, start: "top 85%" },
        }
      );
    }
    const cleanup = attachMagnetic(ctaRef.current, 0.35, 14);
    return cleanup;
  }, []);

  return (
    <section id="contact" className="relative py-28 md:py-40 px-8 md:px-12 border-t border-[rgba(240,237,230,0.06)] overflow-hidden">
      <GhostNumeral value="17" />
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="17" label="Contact" />

        <div className="overflow-hidden mb-12">
          <h2
            ref={titleRef}
            className="font-display font-black uppercase text-[#f0ede6]"
            style={{ fontSize: "clamp(48px, 8vw, 120px)", lineHeight: 0.9, letterSpacing: "-0.02em" }}
          >
            LET'S BUILD SOMETHING.
          </h2>
        </div>

        <div ref={contentRef}>
          <p className="font-body text-[#6b6860] text-base md:text-lg max-w-xl leading-relaxed mb-12">
            Have an interesting product, engineering problem or interface to build?
          </p>

          <a
            ref={ctaRef}
            href={`mailto:${siteConfig.email}`}
            data-cursor
            data-cursor-label="OPEN →"
            className="inline-flex items-center gap-4 group mb-16"
          >
            <span className="font-display font-bold text-[#f0ede6] text-xl md:text-2xl tracking-tight uppercase group-hover:text-[#d4a843] transition-colors duration-300">
              GET IN TOUCH
            </span>
            <span className="font-mono text-[#d4a843] text-xl group-hover:translate-x-3 transition-transform duration-300 inline-block">
              →
            </span>
          </a>

          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex flex-col gap-1 group"
            >
              <span className="font-mono text-[9px] text-[#6b6860] tracking-[0.25em] uppercase">Email</span>
              <span className="font-body text-[#f0ede6] text-sm group-hover:text-[#d4a843] transition-colors duration-300">
                {siteConfig.email}
              </span>
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 group"
            >
              <span className="font-mono text-[9px] text-[#6b6860] tracking-[0.25em] uppercase">LinkedIn</span>
              <span className="font-body text-[#f0ede6] text-sm group-hover:text-[#d4a843] transition-colors duration-300">
                linkedin.com/in/s-u-r-e-s-h
              </span>
            </a>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 group"
            >
              <span className="font-mono text-[9px] text-[#6b6860] tracking-[0.25em] uppercase">GitHub</span>
              <span className="font-body text-[#f0ede6] text-sm group-hover:text-[#d4a843] transition-colors duration-300">
                github.com/suresh-webdev
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
