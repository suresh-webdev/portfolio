import { useEffect, useRef } from "react";
import { gsap, registerFieldSection, settle, settleGroup, ENTER } from "../lib/animations";
import { ENERGY } from "../lib/field";
import { metrics } from "../data/metrics";
import { PAD, SHELL } from "../lib/layout";
import SectionLabel from "./SectionLabel";
import GhostNumeral from "./GhostNumeral";

// THE BLACKOUT.
//
// Every other section on this page runs the field hot. This one puts it out.
// The moment you arrive, the lattice behind the page fades to almost nothing
// and the only lit thing left on screen is a number getting smaller — which
// is, precisely, what the section is about.
//
// The number is not a counter for the sake of having a counter. It is scrubbed
// to the scrollbar and the numeral *compresses horizontally as it counts*, so
// 500 becoming 50 is something you watch take up less room. The bar under it
// contracts to a tenth of its width on the same scrub. Latency is the one
// metric on this page that can be shown rather than asserted, so it is the one
// place a pin and a scrub are worth the scroll they cost.
//
// It is also the page's rest beat. Coming out of it, the field surging back up
// for the engineering section reads as a release.

export default function PerformanceImpact() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const numWrapRef = useRef<HTMLSpanElement>(null);
  const unitRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanupField = registerFieldSection(sectionRef.current, ENERGY.blackout);

    const ctx = gsap.context(() => {
      const counter = { v: 500 };
      const squeeze = { k: 1 };
      const paint = () => {
        if (numRef.current) numRef.current.textContent = String(Math.round(counter.v));
      };
      // Assigned by the media query below; the counter calls it after each
      // repaint so the unit follows a digit dropping off the number.
      let reflowUnit: (() => void) | null = null;
      paint();

      const mm = gsap.matchMedia();

      mm.add(
        { wide: "(min-width: 768px)", motion: "(prefers-reduced-motion: no-preference)" },
        (c) => {
          const { wide, motion } = c.conditions as Record<string, boolean>;

          // The unit has to ride the digits' shrinking right edge. Transforms
          // do not affect layout, so "ms" would otherwise sit where the
          // uncompressed number used to end, with a growing hole in front of
          // it — and squeezing it along with the digits distorted the
          // letterforms.
          //
          // `offsetWidth` is read live rather than cached, because it is the
          // *untransformed* width and it changes twice over: once as the
          // scaleX narrows the box, and again when 500 loses a digit and
          // becomes 50. A cached three-digit width over-corrected and shunted
          // "ms" back on top of the zero.
          const setSqueeze = (k: number) => {
            const digits = numWrapRef.current;
            if (!digits || !unitRef.current) return;
            gsap.set(digits, { scaleX: k });
            gsap.set(unitRef.current, { x: -digits.offsetWidth * (1 - k) });
          };

          if (!motion) {
            counter.v = 50;
            paint();
            setSqueeze(0.74);
            gsap.set(barRef.current, { scaleX: 0.1 });
            return;
          }

          // Desktop pins and hands the count to the scrollbar. A phone cannot
          // pin without eating the whole screen, and scrubbing *without* a pin
          // meant the number counted down while scrolling out of view — so the
          // small screen plays the same timeline once, on arrival, at real
          // durations. Same beat, different mechanism.
          const tl = gsap.timeline(
            wide
              ? {
                  scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    // Was 130%. The count, the squeeze and the bar all finish
                    // at 0.63 of the timeline and the copy has landed by 0.9,
                    // so the last stretch of that pin held the page still on a
                    // frame that had stopped changing. This is the third pin
                    // in a row on the way down the page; it earns its length
                    // or it gives it back.
                    end: "+=85%",
                    pin: stageRef.current,
                    scrub: 0.5,
                    anticipatePin: 1,
                  },
                }
              : {
                  scrollTrigger: { trigger: stageRef.current, start: "top 70%", once: true },
                }
          );
          // The scrubbed version's positions are fractions of a progress bar;
          // on a real clock they need stretching to read as motion.
          if (!wide) tl.timeScale(0.42);

          reflowUnit = () => setSqueeze(squeeze.k);

          tl.to(
            counter,
            {
              v: 50,
              ease: "power2.inOut",
              duration: 0.58,
              onUpdate: () => {
                paint();
                reflowUnit?.();
              },
            },
            0.05
          )
            // The numeral narrows as the number does. This is the whole idea.
            .fromTo(
              squeeze,
              { k: 1 },
              {
                // 0.45 crushed the letterforms — "50ms" read as a rendering
                // fault rather than a measurement. The narrowing only has to
                // be felt; the digit count and the bar carry the rest.
                k: 0.74,
                ease: "power2.inOut",
                duration: 0.58,
                onUpdate: () => setSqueeze(squeeze.k),
              },
              0.05
            )
            .fromTo(
              barRef.current,
              { scaleX: 1 },
              { scaleX: 0.1, ease: "power2.inOut", duration: 0.58 },
              0.05
            )
            // Arrival: the figure catches the light for a beat, then settles.
            .to(numRef.current, { color: "var(--color-accent)", duration: 0.06 }, 0.63)
            .to(numRef.current, { color: "var(--color-fg)", duration: 0.12 }, 0.72)
            .fromTo(
              capRef.current,
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, ease: "power2.out", duration: 0.14 },
              0.66
            )
            .fromTo(
              descRef.current,
              { y: 22, opacity: 0 },
              { y: 0, opacity: 1, ease: "power2.out", duration: 0.16 },
              0.74
            );
        }
      );

      settle(headRef.current, 0, ENTER);
      if (ledgerRef.current) {
        settleGroup(ledgerRef.current.querySelectorAll(".ledger-row"), { stagger: 0.07, y: 20 });
      }

      return () => mm.revert();
    }, sectionRef);

    return () => {
      ctx.revert();
      cleanupField();
    };
  }, []);

  return (
    <section ref={sectionRef} id="impact" data-section className="relative">
      <div
        ref={stageRef}
        className="relative md:h-screen md:min-h-[640px] flex flex-col justify-center py-24 md:py-0 overflow-hidden"
      >
        <GhostNumeral value="05" place="bleed-r" scale={1.2} />

        <div className={`relative ${PAD} ${SHELL}`}>
          <div ref={headRef}>
            {/* The section's accessible name. This screen carries a number and
                a caption but never a heading, so in the document outline its
                content hung off nothing and a screen reader announced an
                unnamed region. Visually the section mark below already says
                this. */}
            <h2 className="sr-only">Engineering impact</h2>
            <SectionLabel index="05" label="Engineering Impact" />
          </div>

          {/* The measurement. Left-aligned and origin-left so the contraction
              reads as the right edge coming in, the way a duration bar does. */}
          <div className="mt-10 md:mt-14">
            <span
              className="display inline-flex items-baseline"
              style={{
                fontSize: "clamp(78px, 19vw, 300px)",
                lineHeight: 0.82,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span ref={numWrapRef} className="inline-block origin-left">
                <span ref={numRef}>500</span>
              </span>
              <span
                ref={unitRef}
                className="inline-block text-[var(--color-accent)] ml-[0.06em]"
                style={{ fontSize: "0.3em" }}
              >
                ms
              </span>
            </span>
          </div>

          {/* Duration, drawn. */}
          <div className="relative mt-6 md:mt-8 h-px w-full max-w-3xl bg-[rgba(240,237,230,0.09)]">
            <span
              ref={barRef}
              className="absolute inset-y-0 left-0 w-full origin-left block"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,157,60,0.15), var(--color-accent))",
              }}
            />
          </div>

          <div ref={capRef} className="mt-5 flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-ember)]">
              Core API latency
            </span>
            <span className="h-px w-8 bg-[rgba(240,237,230,0.2)]" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-muted)]">
              −90%
            </span>
          </div>

          <p
            ref={descRef}
            className="font-body text-[var(--color-muted)] text-sm md:text-base max-w-lg leading-relaxed mt-8"
          >
            Reduced core REST API latency by 90% through query optimization, indexing and caching,
            validated with performance profiling under load.
          </p>
        </div>
      </div>

      {/* The rest of the numbers, as a ledger rather than a card grid. Six
          equal boxes gave six numbers equal weight and made none of them
          land; rows let the figure lead and the mechanism follow it. */}
      <div ref={ledgerRef} className={`relative ${PAD} ${SHELL} pb-24 md:pb-32`}>
        <div className="rule-fade mb-2" />
        {metrics.map((m) => (
          <div
            key={m.value}
            className="ledger-row group grid grid-cols-1 md:grid-cols-[minmax(0,12rem)_minmax(0,16rem)_1fr] gap-x-6 gap-y-2 md:items-baseline py-7 border-b border-[rgba(240,237,230,0.07)]"
          >
            <span
              className="display transition-colors duration-500 group-hover:text-[var(--color-accent)]"
              style={{ fontSize: "clamp(34px, 4.6vw, 62px)", lineHeight: 0.85 }}
            >
              {m.value}
            </span>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-fg)] opacity-80">
              {m.label}
            </span>
            {/* The mechanism, not just the outcome — this is the line that
                separates a measured result from a résumé number. */}
            <span className="font-body text-[13px] leading-relaxed text-[var(--color-muted)] md:text-right md:pl-8">
              {m.detail}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
