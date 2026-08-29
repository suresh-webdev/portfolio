import { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerFieldSection,
  settle,
  settleGroup,
  drawRule,
  wipe,
  ENTER,
} from "../lib/animations";
import { ENERGY } from "../lib/field";
import { PAD, SHELL } from "../lib/layout";
import SectionLabel from "./SectionLabel";
import GhostNumeral from "./GhostNumeral";

// PRODUCTS — full-width cases rather than a bulleted list beside a line.
//
// The previous layout was a 200px meta column against a text column, with a
// scrubbed vertical rule down the side. That rule is now the page's conduit,
// so it does not need a second copy here; what the section needed instead was
// weight. Each case is a slab: a full-width rail of metadata, an oversized
// title, and the deliverables set as a lit index that responds to the cursor.
//
// The bracket on the left of each deliverable extends on hover. It is the
// smallest interaction on the page and the only one in this section — enough
// to make a long list feel like an instrument panel rather than a résumé.

interface CaseProps {
  number: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  technologies: string[];
  note?: string;
}

function ProductCase({
  number,
  title,
  category,
  description,
  highlights,
  technologies,
  note,
}: CaseProps) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      drawRule(railRef.current);
      // A beam across it, not a character rise. Splitting these to characters
      // gave a case title the same entrance as the name in the hero, and once
      // eight headlines share the signature move it stops being one.
      wipe(titleRef.current);
      settle(bodyRef.current, 0.08);
      if (listRef.current) {
        settleGroup(listRef.current.querySelectorAll(".deliverable"), {
          stagger: 0.045,
          y: 16,
          start: ENTER,
        });
      }
      settle(chipsRef.current, 0.12);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <article ref={rootRef} className="relative pt-14 pb-20 md:pt-20 md:pb-28">
      {/* Metadata rail across the full measure. */}
      <div className="flex items-center gap-5 mb-8 md:mb-12">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--color-ember)] whitespace-nowrap">
          {number}
        </span>
        <span
          ref={railRef}
          className="h-px flex-1 origin-left bg-gradient-to-r from-[rgba(240,237,230,0.24)] to-transparent"
        />
        <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[var(--color-muted)] whitespace-nowrap">
          {category}
        </span>
      </div>

      <h3
        ref={titleRef}
        className="display display-etched mb-10 md:mb-14"
        style={{ fontSize: "clamp(40px, 7.5vw, 118px)" }}
      >
        {title}
      </h3>

      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 md:gap-16 lg:gap-24">
        <div ref={bodyRef}>
          <p className="font-body text-[var(--color-muted)] text-base leading-relaxed max-w-xl">
            {description}
          </p>
          {note && (
            <p className="mt-8 pl-5 border-l border-[var(--color-ember)] font-mono text-[10px] leading-relaxed tracking-wide text-[var(--color-muted)] max-w-sm">
              {note}
            </p>
          )}
        </div>

        <div ref={listRef}>
          <span className="font-mono text-[9px] text-[var(--color-muted)] tracking-[0.28em] uppercase block mb-6">
            Key deliverables
          </span>
          <ul className="flex flex-col">
            {highlights.map((h) => (
              <li
                key={h}
                className="deliverable group flex items-baseline gap-4 py-3 border-b border-[rgba(240,237,230,0.06)]"
              >
                <span className="relative flex-none h-px w-4 bg-[var(--color-faint)] translate-y-[-3px] overflow-visible">
                  <span className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-500 ease-out group-hover:scale-x-[2.2]" />
                </span>
                <span className="font-body text-sm text-[var(--color-fg)] opacity-75 transition-opacity duration-300 group-hover:opacity-100">
                  {h}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div ref={chipsRef} className="flex flex-wrap gap-2 mt-12">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="font-mono text-[9px] tracking-[0.2em] text-[var(--color-muted)] border border-[rgba(240,237,230,0.12)] px-2.5 py-1 uppercase"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const cleanupField = registerFieldSection(sectionRef.current, ENERGY.products);
    const ctx = gsap.context(() => {
      wipe(headRef.current);
      settle(ledeRef.current, 0.12);
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => {
      ctx.revert();
      cleanupField();
    };
  }, []);

  return (
    <section ref={sectionRef} id="engineering" data-section className="relative py-24 md:py-32">
      <GhostNumeral value="04" place="tr" />
      <div className={`relative ${PAD} ${SHELL}`}>
        <SectionLabel index="04" label="Product & Engineering Work" />

        <h2 ref={headRef} className="display mt-8 mb-6" style={{ fontSize: "clamp(52px, 8vw, 132px)" }}>
          Products
        </h2>
        {/* Hanging indent. Interfaces sets its lede beside the headline;
            this one drops it into the second column with a rule leading into
            it, so the two sections open on visibly different axes rather than
            running the same flush-left column twice. */}
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-4 md:gap-10 items-start">
          {/* `items-start`, not `items-baseline`: an empty span has no baseline
              to align to, so baseline alignment left this rule's position up to
              the browser. Nudged down by hand to meet the lede's first line. */}
          <span className="hidden md:block h-px w-full bg-gradient-to-r from-[rgba(240,237,230,0.18)] to-transparent mt-[0.7em]" />
          <p
            ref={ledeRef}
            className="font-body text-[var(--color-muted)] text-base md:text-lg max-w-lg leading-relaxed"
          >
            Beyond the interface. Building systems, APIs and infrastructure that power real products.
          </p>
        </div>

        <div className="mt-8">
          <ProductCase
            number="01 / 02"
            title="Finnulate AI"
            category="Fintech Compliance Platform"
            description="End-to-end ownership of five core production modules on Finnulate AI, a fintech compliance platform. Responsible for the full contract from data model to API to implementation to interface to deployment."
            highlights={[
              "API contract design and implementation",
              "Data model design and schema evolution",
              "Backend implementation and production support",
              "React interfaces consuming APIs",
              "Third-party integrations",
              "Deployment and infrastructure ownership",
            ]}
            technologies={["NODE.JS", "PYTHON", "EXPRESS.JS", "FASTAPI", "MONGODB", "NEO4J", "AWS", "REACT"]}
          />

          <ProductCase
            number="02 / 02"
            title="Auditee AI"
            category="AI Ad Auditing Platform"
            description="Built the backend of an internal AI ad-auditing tool from the ground up: authentication and authorization, file processing and data pipelines. The system ran in production for approximately 20 operations users before the project was wound down due to budget."
            highlights={[
              "Authentication and authorization system",
              "File processing and data pipelines",
              "Backend architecture from scratch",
              "Production deployment and support",
            ]}
            technologies={["NODE.JS", "APIS", "AUTHENTICATION", "DATA PIPELINES", "AI"]}
            note="Ran in production for ~20 operations users before the project was wound down due to budget."
          />
        </div>
      </div>
    </section>
  );
}
