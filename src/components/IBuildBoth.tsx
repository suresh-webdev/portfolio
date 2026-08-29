import { useEffect, useRef } from "react";
import { gsap, registerFieldSection, splitWords } from "../lib/animations";
import { ENERGY } from "../lib/field";
import { PAD } from "../lib/layout";
import GhostNumeral from "./GhostNumeral";

// I BUILD BOTH — the one section on the page where the motion *is* the
// argument.
//
// It used to be a centred headline over two bordered boxes that slid in from
// opposite sides: the claim was in the copy and the animation was decoration
// on top of it. Now the two words start occupying exactly the same space,
// stacked on the same baseline, and the scroll pulls them apart. The claim is
// made by the layout before a single line of copy is read — these were one
// thing, and separating them is something you do, not something you are told.
//
// The line "I BUILD BOTH." only resolves in the gap the separation opens.

export default function IBuildBoth() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const claimRef = useRef<HTMLParagraphElement>(null);
  const ruleLRef = useRef<HTMLSpanElement>(null);
  const ruleRRef = useRef<HTMLSpanElement>(null);
  const copyARef = useRef<HTMLDivElement>(null);
  const copyBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanupField = registerFieldSection(sectionRef.current, ENERGY.split);

    const ctx = gsap.context(() => {
      const claimChars = splitWords(claimRef.current);
      const mm = gsap.matchMedia();

      mm.add(
        { wide: "(min-width: 768px)", motion: "(prefers-reduced-motion: no-preference)" },
        (c) => {
          const { wide, motion } = c.conditions as Record<string, boolean>;
          const targets = [aRef.current, bRef.current];

          if (!motion) {
            // Reduced motion: land everything on its final values.
            gsap.set(targets, { yPercent: 0, opacity: 1 });
            gsap.set([copyARef.current, copyBRef.current], { y: 0, opacity: 1 });
            gsap.set([ruleLRef.current, ruleRRef.current], { scaleX: 1 });
            return;
          }

          if (!wide) {
            // The phone used to get a fade: the two words simply appeared,
            // stacked, and the section's entire argument — that these are one
            // thing until something separates them — was reduced to a claim in
            // a mono caption. Most of the traffic to a portfolio arrives on a
            // phone, so that was the majority experience of the best idea on
            // the page.
            //
            // It is now the same mechanism. The separation is driven by the
            // scrollbar exactly as it is on desktop; what it does *not* do is
            // pin, because a pin on a small screen eats the entire viewport
            // for the duration. The words start stacked on one baseline and
            // are pulled apart as the section crosses the viewport — no pin,
            // no held page, same argument.
            //
            // The travel is *measured*, not guessed at as a percentage of the
            // word's own height. A fixed yPercent moved each word by a
            // fraction of its line box, which at phone sizes closed maybe 40px
            // of a 190px gap: the pair drifted slightly instead of coming
            // apart, and the whole point was lost. `offsetTop` is layout
            // geometry and transforms do not affect it, so this reads the real
            // distance between the two words and closes exactly that — which
            // puts them genuinely on top of one another at the start.
            const gap = () => {
              const a = aRef.current;
              const b = bRef.current;
              return a && b ? b.offsetTop - a.offsetTop : 0;
            };

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: stageRef.current,
                start: "top 85%",
                end: "center 38%",
                scrub: 0.6,
                // The distance depends on the display face having loaded and
                // on the viewport width, so re-measure rather than baking in
                // whatever it was at first paint.
                invalidateOnRefresh: true,
              },
            });

            tl.fromTo(
              bRef.current,
              { y: () => -gap(), opacity: 0.5 },
              { y: 0, opacity: 1, ease: "power2.inOut", duration: 0.6 },
              0
            )
              // The claim only exists once there is a gap for it to exist in.
              .fromTo(
                claimRef.current,
                { opacity: 0 },
                { opacity: 1, ease: "none", duration: 0.2 },
                0.34
              )
              .fromTo(
                claimChars,
                { yPercent: 118 },
                { yPercent: 0, ease: "expo.out", duration: 0.3, stagger: 0.016 },
                0.4
              )
              .fromTo(
                [copyARef.current, copyBRef.current],
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, ease: "power2.out", duration: 0.25, stagger: 0.06 },
                0.5
              );

            gsap.set([ruleLRef.current, ruleRRef.current], { scaleX: 1 });
            return;
          }

          // 110% of a screen height was longer than the idea needed: the two
          // words had finished separating and the claim had fully resolved
          // well before the pin released, so the last third of it was the page
          // simply refusing to move. Shortened to the length of the gesture
          // itself.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=75%",
              pin: stageRef.current,
              scrub: 0.55,
              anticipatePin: 1,
            },
          });

          tl.fromTo(
            aRef.current,
            { yPercent: 0, xPercent: 0 },
            { yPercent: -62, xPercent: -9, ease: "power2.inOut", duration: 0.6 },
            0
          )
            .fromTo(
              bRef.current,
              { yPercent: 0, xPercent: 0 },
              { yPercent: 62, xPercent: 9, ease: "power2.inOut", duration: 0.6 },
              0
            )
            .fromTo(
              [ruleLRef.current, ruleRRef.current],
              { scaleX: 0 },
              { scaleX: 1, ease: "power2.out", duration: 0.25 },
              0.32
            )
            .fromTo(
              claimChars,
              { yPercent: 118 },
              { yPercent: 0, ease: "expo.out", duration: 0.22, stagger: 0.012 },
              0.44
            )
            .fromTo(
              [copyARef.current, copyBRef.current],
              { y: 26, opacity: 0 },
              { y: 0, opacity: 1, ease: "power2.out", duration: 0.22, stagger: 0.06 },
              0.55
            );
        }
      );

      return () => mm.revert();
    }, sectionRef);

    return () => {
      ctx.revert();
      cleanupField();
    };
  }, []);

  return (
    <section ref={sectionRef} id="both" data-section className="relative">
      <div
        ref={stageRef}
        className="relative md:h-screen md:min-h-[640px] flex flex-col justify-center py-24 md:py-0 overflow-hidden"
      >
        <GhostNumeral value="03" place="bleed-l" scale={1.15} />

        <div className={`relative w-full ${PAD}`}>
          {/* On desktop the two words share one box. An invisible copy of the
              type gives that box its height, so both halves can sit absolutely
              on the same baseline without a hard-coded line height — and GSAP
              owns their transforms outright, with no utility-class transform
              to fight over. */}
          <div className="relative">
            <h2
              aria-hidden="true"
              className="display invisible hidden md:block text-center leading-[0.82]"
              style={{ fontSize: "clamp(44px, 12vw, 190px)" }}
            >
              Interfaces
            </h2>

            {/* Solid — the half everybody sees. */}
            <div
              ref={aRef}
              className="relative md:absolute md:inset-0 z-20 flex items-center justify-center"
            >
              <h2
                className="display display-etched text-center leading-[0.82]"
                style={{ fontSize: "clamp(44px, 12vw, 190px)" }}
              >
                Interfaces
              </h2>
            </div>

            {/* The claim, resolving in the gap the separation opens.
                It sits between the two words in the document rather than
                after them: on desktop all three are absolutely positioned on
                the same box so DOM order is irrelevant, but in the phone's
                stacked flow this is what puts the claim *in* the gap the
                separation opens instead of underneath the pair — which is the
                whole point of it. */}
            <div className="relative md:absolute md:inset-0 z-30 flex items-center justify-center gap-5 md:gap-8 my-8 md:my-0">
              <span
                ref={ruleLRef}
                className="hidden md:block h-px flex-1 max-w-[20vw] origin-right bg-gradient-to-l from-[rgba(240,237,230,0.22)] to-transparent"
              />
              <p
                ref={claimRef}
                className="font-mono text-[11px] md:text-[13px] tracking-[0.34em] uppercase text-[var(--color-accent)] whitespace-nowrap"
              >
                I build both.
              </p>
              <span
                ref={ruleRRef}
                className="hidden md:block h-px flex-1 max-w-[20vw] origin-left bg-gradient-to-r from-[rgba(240,237,230,0.22)] to-transparent"
              />
            </div>

            {/* Outlined — the half nobody demos. Same box, same baseline: at
                rest these two are one object. */}
            <div
              ref={bRef}
              className="relative md:absolute md:inset-0 z-10 flex items-center justify-center"
            >
              <h2
                className="display display-outline text-center leading-[0.82]"
                style={{ fontSize: "clamp(44px, 12vw, 190px)" }}
              >
                Systems
              </h2>
            </div>
          </div>
        </div>

        {/* Supporting copy, tucked under each half rather than boxed. The
            bordered panels are gone: the words are the structure now. */}
        <div
          className={`relative md:absolute md:inset-x-0 md:bottom-[9vh] grid md:grid-cols-2 gap-10 md:gap-8 mt-12 md:mt-0 ${PAD}`}
        >
          <div ref={copyARef} className="max-w-sm">
            <span className="font-mono text-[9px] text-[var(--color-ember)] tracking-[0.3em] uppercase block mb-3">
              01 / Interfaces
            </span>
            <p className="font-body text-[var(--color-muted)] text-sm leading-relaxed">
              Frontend work that has to hold up in production — responsive interfaces wired to real
              APIs, with motion and visual polish kept inside real performance budgets.
            </p>
          </div>
          <div ref={copyBRef} className="max-w-sm md:justify-self-end md:text-right">
            <span className="font-mono text-[9px] text-[var(--color-ember)] tracking-[0.3em] uppercase block mb-3">
              02 / Systems
            </span>
            <p className="font-body text-[var(--color-muted)] text-sm leading-relaxed">
              The backend side — APIs, services, data and infrastructure — owned end-to-end from
              data model through deployment, then kept running after that.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
