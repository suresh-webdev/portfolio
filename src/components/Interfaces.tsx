import { useEffect, useRef, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  registerFieldSection,
  driftX,
  settle,
  wipe,
  ENTER,
} from "../lib/animations";
import { ENERGY } from "../lib/field";
import { PAD, SHELL } from "../lib/layout";
import SectionLabel from "./SectionLabel";
import LiveSitePreview from "./LiveSitePreview";
import { projects, type Project } from "../data/projects";

// SELECTED WORK — three chapters, not three cards.
//
// Each project takes the whole screen and plays a single idea:
//
//     the name announces  →  the work opens behind it  →  the name recedes
//
// ── Why the three no longer play the same way ────────────────────────────
//
// They used to. All three pinned the viewport for 95% of a screen height and
// ran a byte-identical timeline: the same horizontal slit opening, the same
// scrim lifting 0.88 → 0.14, the same -3.2% title drift. The first one was a
// moment. The third was a template — and stacked with the two pinned sections
// that follow, the page held the visitor still for something like five and a
// quarter viewport heights in a row. Pinning is a currency; spent five times
// consecutively it stops reading as choreography and starts reading as a page
// that will not let you leave.
//
// So the mechanism is now introduced, varied, and then resolved:
//
//   01  PINNED   the full scrubbed reveal, held. The one pin in this section,
//                and shorter than it was — the content resolved well before
//                the old pin released.
//   02  IRIS     no pin. The frame opens from a vertical slit instead of a
//                horizontal one, on a mirrored axis: media left, type flush
//                right. Same grammar, different sentence.
//   03  CUT      no pin, no reveal. The work is simply already there when you
//                arrive; only the scrim lifts, and the title drifts across on
//                the scroll. The quietest of the three, because by the third
//                chapter the device has been made and does not need making
//                again.
//
// Everything is still transform and clip-path. Nothing here animates layout.

type ChapterMode = "pinned" | "iris" | "cut";

const MODES: ChapterMode[] = ["pinned", "iris", "cut"];

function Chapter({ project, index }: { project: Project; index: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLSpanElement>(null);
  const [onStage, setOnStage] = useState(false);

  const host = project.url ? new URL(project.url).host : "";
  const num = String(index + 1).padStart(2, "0");
  const mode = MODES[index % MODES.length];
  // The iris chapter mirrors the page's axis. Doing it once, in the middle of
  // three, is what keeps the run of chapters from reading as a repeated
  // template — and it is the only place on the page where the type sets
  // against the right edge.
  const flip = mode === "iris";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // The recording plays only while its chapter holds the viewport, on
      // every viewport size.
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onToggle: (self) => setOnStage(self.isActive),
      });

      const mm = gsap.matchMedia();

      mm.add(
        {
          wide: "(min-width: 768px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (c) => {
          const { wide, motion } = c.conditions as Record<string, boolean>;

          if (!wide || !motion) {
            // Phone, or reduced motion: no pin, no scrub. The chapter still
            // opens — it just does it once, on arrival, instead of being
            // driven by the scrollbar.
            //
            // Note there is no clearProps here: it strips *all* inline style,
            // including the element's own `font-size`, which silently dropped
            // every chapter title on mobile to the inherited 16px. matchMedia
            // reverts this branch's own tweens on its own.
            gsap.set(scrimRef.current, { opacity: 0.12 });
            wipe(titleRef.current, "top 78%");
            settle(metaRef.current, 0.1);
            gsap.fromTo(
              frameRef.current,
              { clipPath: "inset(18% 0% 18% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.2,
                ease: "expo.out",
                scrollTrigger: { trigger: frameRef.current, start: ENTER, once: true },
              }
            );
            return;
          }

          // The title arrives as a beam across it on every desktop chapter —
          // the character rise is reserved for the three headlines that carry
          // the page, and a chapter title is not one of them.
          //
          // Measured from the chapter wrapper, not from the heading: the
          // heading lives inside the stage, and in the pinned chapter that
          // stage stops moving with the scrollbar the instant the pin engages,
          // which would leave its own trigger never reaching the start point.
          wipe(titleRef.current, "top 72%", rootRef.current);

          if (mode === "pinned") {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top top",
                end: "+=60%",
                pin: stageRef.current,
                pinSpacing: true,
                scrub: 0.6,
                anticipatePin: 1,
              },
            });

            tl.fromTo(
              frameRef.current,
              { clipPath: "inset(46% 0% 46% 0%)", scale: 1.05 },
              { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "power2.out", duration: 0.42 },
              0
            )
              .fromTo(scrimRef.current, { opacity: 0.88 }, { opacity: 0.14, duration: 0.42 }, 0)
              .fromTo(
                edgeRef.current,
                { scaleY: 0 },
                { scaleY: 1, duration: 0.3, ease: "power2.out" },
                0.12
              )
              .fromTo(
                metaRef.current,
                { y: 34, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.24, ease: "power2.out" },
                0.34
              )
              // The name gives way. It has done its job by the time the work
              // is fully open.
              .fromTo(
                titleWrapRef.current,
                { xPercent: 0 },
                { xPercent: -3.2, ease: "none", duration: 1 },
                0
              )
              .fromTo(kickerRef.current, { xPercent: 0 }, { xPercent: -1.4, ease: "none", duration: 1 }, 0);
            return;
          }

          // Unpinned from here on. The timeline is still driven by the
          // scrollbar — it is scrubbed against the chapter's own passage
          // through the viewport — so the motion is every bit as scroll-linked
          // as the pinned one. What it no longer does is stop the page.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 82%",
              end: "top 18%",
              scrub: 0.6,
            },
          });

          if (mode === "iris") {
            tl.fromTo(
              frameRef.current,
              { clipPath: "inset(0% 44% 0% 44%)", scale: 1.04 },
              { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "power2.out", duration: 0.5 },
              0
            )
              .fromTo(scrimRef.current, { opacity: 0.85 }, { opacity: 0.14, duration: 0.5 }, 0)
              .fromTo(
                edgeRef.current,
                { scaleY: 0 },
                { scaleY: 1, duration: 0.34, ease: "power2.out" },
                0.16
              )
              .fromTo(
                metaRef.current,
                { y: 34, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
                0.4
              );
          } else {
            // CUT. No reveal on the frame at all — it is already open. Only
            // the light comes up on it.
            gsap.set(frameRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
            tl.fromTo(scrimRef.current, { opacity: 0.8 }, { opacity: 0.14, duration: 0.35 }, 0)
              .fromTo(
                edgeRef.current,
                { scaleY: 0 },
                { scaleY: 1, duration: 0.3, ease: "power2.out" },
                0.1
              )
              .fromTo(
                metaRef.current,
                { y: 34, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
                0.3
              );

            // The one piece of genuinely horizontal scroll-driven movement on
            // the page. The helper existed and was never called; this is the
            // chapter that wants it, because with no reveal of its own the
            // drift is what makes the passage read as motion.
            driftX(titleWrapRef.current, 2.5, -4.5, 0.9);
          }
        }
      );

      return () => mm.revert();
    }, rootRef);

    return () => ctx.revert();
  }, [mode]);

  const open = () => project.url && window.open(project.url, "_blank", "noopener,noreferrer");

  return (
    <div ref={rootRef} className="relative">
      <div ref={stageRef} className="relative flex flex-col md:block md:h-screen md:min-h-[680px]">
        {/* Media. Offset and inset from the edges: framed like a screen in a
            dark room rather than bled to the viewport, because the frame is
            what says "this is the live site". The iris chapter puts it on the
            opposite side. */}
        <div
          className={`order-2 md:order-none relative md:absolute md:top-[37vh] md:bottom-[9vh] w-full md:w-auto ${
            flip ? "md:left-[4%] md:right-[38%]" : "md:left-[38%] md:right-[4%]"
          }`}
          style={{ aspectRatio: "16/9" }}
        >
          <div
            ref={frameRef}
            data-cursor
            // The label identifies what is under the cursor rather than
            // repeating the same two words on every frame on the page.
            data-cursor-label={host ? host.toUpperCase() : "NO PREVIEW"}
            onClick={open}
            className="relative w-full h-full overflow-hidden bg-[#131311] md:absolute md:inset-0"
          >
            {project.video && project.image ? (
              <LiveSitePreview
                src={project.video}
                poster={project.image}
                label={host}
                active={onStage}
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-3"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(240,237,230,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,237,230,0.03) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              >
                <div className="w-8 h-8 border border-[rgba(240,237,230,0.15)]" />
                <span className="font-mono text-[9px] text-[var(--color-muted)] tracking-[0.25em] uppercase">
                  No public preview
                </span>
              </div>
            )}
            <div
              ref={scrimRef}
              className="absolute inset-0 bg-[#0c0c0b] pointer-events-none"
              style={{ opacity: 0.88 }}
            />
          </div>

          {/* An accent edge drawing down the frame as it opens — the same
              hairline-and-light language as the conduit, on whichever side
              the frame is anchored from. */}
          <span
            ref={edgeRef}
            className={`hidden md:block absolute top-0 bottom-0 w-px origin-top bg-[var(--color-accent)] ${
              flip ? "-right-px" : "-left-px"
            }`}
            style={{ opacity: 0.75 }}
          />
        </div>

        {/* Type, overlapping the frame's inner edge. */}
        <div
          className={`order-1 md:order-none relative md:absolute md:inset-x-0 md:top-[13vh] z-20 pointer-events-none mb-8 md:mb-0 ${PAD} ${
            flip ? "md:text-right" : ""
          }`}
        >
          <div
            ref={kickerRef}
            className={`relative flex items-center gap-4 mb-4 ${flip ? "md:flex-row-reverse" : ""}`}
          >
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--color-ember)]">
              {num}
            </span>
            <span className="h-px w-8 bg-[rgba(240,237,230,0.25)]" />
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[var(--color-muted)]">
              {project.category}
            </span>
          </div>
          {/* The wrapper carries the scroll-driven drift; the heading itself
              carries the beam wipe. Keeping them on separate elements means
              the two never fight over the same transform. */}
          <div ref={titleWrapRef} className="relative">
            <h3
              ref={titleRef}
              className="display display-etched relative"
              style={{ fontSize: "clamp(52px, 12.5vw, 168px)" }}
            >
              {project.title}
            </h3>
          </div>
        </div>

        {/* Detail column, low and narrow so the type keeps the weight. */}
        <div
          ref={metaRef}
          className={`order-3 md:order-none relative md:absolute md:inset-x-0 md:top-[37vh] z-20 mt-8 md:mt-0 ${PAD}`}
        >
          <div
            className={`max-w-[22rem] md:max-w-[30%] ${flip ? "md:ml-auto md:text-right" : ""}`}
          >
            <p className="font-body text-[var(--color-muted)] text-sm leading-relaxed mb-5">
              {project.description}
            </p>
            <div className={`flex flex-wrap gap-2 mb-6 ${flip ? "md:justify-end" : ""}`}>
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[9px] tracking-[0.2em] text-[var(--color-muted)] border border-[rgba(240,237,230,0.12)] px-2.5 py-1 uppercase"
                >
                  {tech}
                </span>
              ))}
            </div>
            {project.url && (
              <button
                onClick={open}
                className="group inline-flex items-center gap-3 border-b border-[rgba(240,237,230,0.2)] pb-2 hover:border-[var(--color-accent)] transition-colors duration-300"
              >
                <span className="font-mono text-[10px] tracking-[0.24em] text-[var(--color-fg)] uppercase">
                  {host}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Interfaces() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const cleanup = registerFieldSection(sectionRef.current, ENERGY.work);
    const ctx = gsap.context(() => {
      wipe(headRef.current);
      settle(ledeRef.current, 0.12);
    }, sectionRef);
    return () => {
      ctx.revert();
      cleanup();
    };
  }, []);

  const uiProjects = projects.filter((p) => p.type === "UI");

  return (
    <section ref={sectionRef} id="work" data-section className="relative py-24 md:py-32">
      {/* The lede sets beside the headline rather than under it. Every section
          on this page used to open on the identical axis — mark, headline,
          lede, all flush left in one column — which made six well-composed
          sections read as one template applied six times. */}
      <div className={`${PAD} ${SHELL} mb-16 md:mb-24`}>
        <SectionLabel index="02" label="Selected UI Work" />
        <div className="mt-8 grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-8 md:gap-16 items-end">
          <h2 ref={headRef} className="display" style={{ fontSize: "clamp(52px, 8vw, 132px)" }}>
            Interfaces
          </h2>
          <p
            ref={ledeRef}
            className="font-body text-[var(--color-muted)] text-base md:text-lg max-w-lg leading-relaxed md:pb-4"
          >
            A handful of frontend builds where interaction and motion mattered as much as the code.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-20 md:gap-0">
        {uiProjects.map((p, i) => (
          <Chapter key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
