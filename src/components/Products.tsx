import { useEffect, useRef } from "react";
import { gsap } from "../lib/animations";
import SectionLabel from "./SectionLabel";
import GhostNumeral from "./GhostNumeral";

interface ProductProps {
  number: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  technologies: string[];
  note?: string;
}

function ProductCase({ number, title, category, description, highlights, technologies, note }: ProductProps) {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { y: 70, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%" },
      }
    );
  }, []);

  return (
    <div ref={blockRef} className="border-t border-[rgba(240,237,230,0.1)] pt-12 pb-16">
      <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16">
        <div>
          <span className="font-mono text-[#d4a843] text-[11px] tracking-[0.3em] block mb-3">{number}</span>
          <span className="font-mono text-[9px] text-[#6b6860] tracking-[0.2em] uppercase">{category}</span>
        </div>
        <div>
          <h3
            className="font-display font-black uppercase text-[#f0ede6] mb-6"
            style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.01em" }}
          >
            {title}
          </h3>
          <p className="font-body text-[#6b6860] text-base leading-relaxed mb-8 max-w-2xl">{description}</p>

          {note && (
            <div className="border-l-2 border-[#d4a843] pl-4 mb-8">
              <p className="font-mono text-[10px] text-[#6b6860] leading-relaxed tracking-wide">{note}</p>
            </div>
          )}

          <div className="mb-8">
            <span className="font-mono text-[9px] text-[#6b6860] tracking-[0.25em] uppercase block mb-4">
              Key Deliverables
            </span>
            <div className="flex flex-col gap-2">
              {highlights.map((h) => (
                <div key={h} className="flex items-start gap-3">
                  <span className="text-[#d4a843] font-mono text-[10px] mt-1">—</span>
                  <span className="font-body text-[#f0ede6] text-sm opacity-80">{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[9px] tracking-[0.2em] text-[#6b6860] border border-[rgba(240,237,230,0.1)] px-2.5 py-1 uppercase"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    if (title) {
      gsap.fromTo(
        title,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: title, start: "top 80%" },
        }
      );
    }
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: subtitle, start: "top 85%" },
        }
      );
    }
  }, []);

  return (
    <section id="engineering" className="relative py-24 md:py-32 px-8 md:px-12 bg-[#0c0c0b] overflow-hidden">
      <GhostNumeral value="05" />
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="05" label="Product & Engineering Work" />

        <h2
          ref={titleRef}
          className="font-display font-black uppercase text-[#f0ede6] mb-6"
          style={{ fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 0.95, letterSpacing: "-0.02em" }}
        >
          PRODUCTS
        </h2>
        <p ref={subtitleRef} className="font-body text-[#6b6860] text-base md:text-lg max-w-lg leading-relaxed mb-20">
          Beyond the interface — building systems, APIs and infrastructure that power real products.
        </p>

        <ProductCase
          number="01 / 02"
          title="FINTECH PLATFORM"
          category="Backend / Product Engineering"
          description="End-to-end ownership of five core production modules on a fintech platform. Responsible for the full contract from data model to API to implementation to interface to deployment."
          highlights={[
            "API contract design and implementation",
            "Data model design and schema evolution",
            "Backend implementation and production support",
            "React interfaces consuming APIs",
            "Third-party integrations",
            "Deployment and infrastructure ownership",
          ]}
          technologies={["NODE.JS", "REACT", "MONGODB", "AWS", "REST API", "EXPRESS.JS"]}
        />

        <ProductCase
          number="02 / 02"
          title="AUDITEE AI"
          category="AI Auditing Platform"
          description="Built the backend of an internal AI auditing tool from the ground up — authentication and authorization, file processing and data pipelines. The system ran in production for approximately 20 operations users before the project was wound down due to budget."
          highlights={[
            "Authentication and authorization system",
            "File processing and data pipelines",
            "Backend architecture from scratch",
            "Production deployment and support",
          ]}
          technologies={["NODE.JS", "APIS", "AUTHENTICATION", "DATA PIPELINES", "AI"]}
          note="Ran in production for ~20 operations users. Project was wound down due to budget. This is an honest account — and it makes for a stronger story."
        />
      </div>
    </section>
  );
}
