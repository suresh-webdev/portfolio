import { useEffect, useRef } from "react";
import {
  gsap,
  registerFieldSection,
  splitWords,
  charRise,
  settle,
  attachMagnetic,
  ENTER,
} from "../lib/animations";
import { ENERGY } from "../lib/field";
import { siteConfig } from "../data/siteConfig";
import { PAD } from "../lib/layout";
import SectionLabel from "./SectionLabel";
import { IconMail, IconLinkedIn, IconGithub } from "./icons";

// CONTACT — where the field converges.
//
// This is the only section that asks the shader to gather rather than spread:
// the traffic pulls in on the middle of the viewport and the junctions there
// brighten, so the page closes by arriving somewhere instead of fading out.
// It is also the only centred section on the page, which is why the
// convergence has something to converge on.
//
// One magnetic element — the primary CTA. It is the second and last on the
// site; magnetism used more than twice stops reading as attention and starts
// reading as slippage.

const LINKS = [
  { key: "email", label: "Email", cursor: "EMAIL", Icon: IconMail },
  { key: "linkedin", label: "LinkedIn", cursor: "LINKEDIN", Icon: IconLinkedIn },
  { key: "github", label: "GitHub", cursor: "GITHUB", Icon: IconGithub },
] as const;

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const href = (key: string) =>
    key === "email"
      ? `mailto:${siteConfig.email}`
      : key === "linkedin"
        ? siteConfig.linkedin
        : siteConfig.github;

  useEffect(() => {
    const cleanupField = registerFieldSection(sectionRef.current, ENERGY.contact, { converge: 0.55 });
    const ctx = gsap.context(() => {
      settle(markRef.current, 0, ENTER);
      // Signature weight — the closing headline is the third and last
      // character rise on the site, and it should land heavier than anything
      // that came between it and the hero.
      charRise(splitWords(titleRef.current), {
        scrollTrigger: { trigger: titleRef.current, start: ENTER, once: true },
        weight: "signature",
        stagger: 0.03,
      });
      settle(ledeRef.current, 0.12);
      settle(rowRef.current, 0.2);
    }, sectionRef);
    const cleanupMagnetic = attachMagnetic(ctaRef.current, 0.3, 14);
    return () => {
      ctx.revert();
      cleanupMagnetic();
      cleanupField();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-section
      className={`relative min-h-[76vh] md:min-h-[88vh] flex flex-col items-center justify-center text-center py-20 md:py-36 ${PAD}`}
    >
      <div ref={markRef} className="flex justify-center">
        <SectionLabel index="09" label="Contact" />
      </div>

      <h2
        ref={titleRef}
        className="display display-etched mt-10 mb-8 max-w-[16ch]"
        style={{ fontSize: "clamp(46px, 9vw, 156px)" }}
      >
        Let's build something.
      </h2>

      <p
        ref={ledeRef}
        className="font-body text-[var(--color-muted)] text-base md:text-lg max-w-lg leading-relaxed mb-12"
      >
        Have an interesting product, engineering problem or interface to build?
      </p>

      <div ref={rowRef} className="flex flex-col items-center gap-10">
        <a
          ref={ctaRef}
          href={siteConfig.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor
          data-cursor-label="MESSAGE →"
          className="group relative inline-flex items-center gap-5 border border-[rgba(240,237,230,0.22)] px-9 py-5 overflow-hidden transition-colors duration-500 hover:border-[var(--color-accent)]"
        >
          {/* The fill arrives as a wipe, matching the beam language used for
              headline reveals elsewhere. */}
          <span className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] bg-[rgba(255,157,60,0.09)]" />
          <span className="relative display text-xl md:text-2xl group-hover:text-[var(--color-accent)] transition-colors duration-300">
            Get in touch
          </span>
          <span className="relative font-mono text-[var(--color-accent)] text-xl transition-transform duration-300 group-hover:translate-x-2">
            →
          </span>
        </a>

        <div className="flex items-stretch gap-px bg-[rgba(240,237,230,0.1)] border border-[rgba(240,237,230,0.1)]">
          {LINKS.map(({ key, label, cursor, Icon }) => (
            <a
              key={key}
              href={href(key)}
              target={key === "email" ? undefined : "_blank"}
              rel={key === "email" ? undefined : "noopener noreferrer"}
              data-cursor
              data-cursor-label={cursor}
              aria-label={label}
              className="group relative w-14 h-14 bg-[#0c0c0b] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors duration-300 overflow-hidden"
            >
              <span className="absolute top-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out bg-[var(--color-accent)]" />
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
