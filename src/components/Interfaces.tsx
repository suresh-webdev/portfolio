import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, attachMagnetic } from "../lib/animations";
import SectionLabel from "./SectionLabel";
import LiveSitePreview from "./LiveSitePreview";
import { projects } from "../data/projects";

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const imgWrap = imgRef.current;
    if (!card || !imgWrap) return;

    const cleanupMagnetic = attachMagnetic(arrowRef.current, 0.5, 10);

    gsap.fromTo(
      card,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Scale on enter
    gsap.fromTo(
      imgWrap,
      { clipPath: "inset(8% 4%)", scale: 0.96 },
      {
        clipPath: "inset(0% 0%)",
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imgWrap,
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return cleanupMagnetic;
  }, []);

  const isEven = index % 2 === 0;
  const host = project.url ? new URL(project.url).host : "";

  return (
    <div
      ref={cardRef}
      data-cursor
      data-cursor-label="VIEW →"
      className="group relative cursor-pointer"
      onClick={() => project.url && window.open(project.url, "_blank")}
    >
      <div className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${isEven ? "" : "md:[direction:rtl]"}`}>
        {/* Image */}
        <div
          ref={imgRef}
          className="relative overflow-hidden bg-[#1a1a18]"
          style={{ aspectRatio: "16/9" }}
        >
          {project.video && project.image ? (
            <LiveSitePreview src={project.video} poster={project.image} label={host} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-[10px] text-[#6b6860] tracking-widest">[PROJECT IMAGE]</span>
            </div>
          )}
          <div className="absolute inset-0 bg-[#0c0c0b] opacity-20 group-hover:opacity-0 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className={`${isEven ? "" : "[direction:ltr]"} py-4`}>
          <div className="mb-4">
            <span className="font-mono text-[9px] text-[#38bdf8] tracking-[0.3em] uppercase">
              {project.category}
            </span>
          </div>
          <h3
            className="font-display font-black uppercase text-[#f0ede6] mb-6 group-hover:text-[#38bdf8] transition-colors duration-300"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 0.95, letterSpacing: "-0.01em" }}
          >
            {project.title}
          </h3>
          <p className="font-body text-[#6b6860] text-sm leading-relaxed mb-8 max-w-sm">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[9px] tracking-[0.2em] text-[#6b6860] border border-[rgba(240,237,230,0.1)] px-2.5 py-1 uppercase"
              >
                {tech}
              </span>
            ))}
          </div>
          {project.url && (
            <div className="inline-flex items-center gap-3 group/arrow border border-[rgba(240,237,230,0.15)] px-5 py-3 hover:border-[#38bdf8] transition-colors duration-300">
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#f0ede6] uppercase">
                View Project
              </span>
              <span
                ref={arrowRef}
                className="font-mono text-[11px] text-[#38bdf8] group-hover/arrow:translate-x-2 transition-transform duration-300 inline-block"
              >
                →
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-[rgba(240,237,230,0.06)] mt-16 md:mt-20" />
    </div>
  );
}

export default function Interfaces() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    if (title) {
      gsap.fromTo(
        title,
        { clipPath: "inset(0 100% 0 0)", x: -20 },
        {
          clipPath: "inset(0 0% 0 0)",
          x: 0,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: title, start: "top 95%", toggleActions: "play none none reverse" },
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
          ease: "power3.out",
          scrollTrigger: { trigger: subtitle, start: "top 95%", toggleActions: "play none none reverse" },
        }
      );
    }

  }, []);

  const uiProjects = projects.filter((p) => p.type === "UI");

  return (
    <section id="work" className="py-24 md:py-32 px-8 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="02" label="Selected UI Work" />

        <div className="mb-16">
          <h2
            ref={titleRef}
            className="font-display font-black uppercase text-[#f0ede6] mb-6"
            style={{ fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 0.95, letterSpacing: "-0.02em" }}
          >
            INTERFACES
          </h2>
          <p ref={subtitleRef} className="font-body text-[#6b6860] text-base md:text-lg max-w-lg leading-relaxed">
            Interactive interfaces where frontend engineering, motion and visual execution meet.
          </p>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {uiProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
