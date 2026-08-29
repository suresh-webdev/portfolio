import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerFieldSection, splitWords, WEIGHT } from "../lib/animations";
import { ENERGY, fieldState, setIntro } from "../lib/field";
import { siteConfig } from "../data/siteConfig";
import { PAD } from "../lib/layout";

// The hero is unchanged in composition — it is the quality benchmark the rest
// of the page was rebuilt to meet, so its type, spacing, masking and timing
// are exactly as they were. What changed underneath it:
//
//  1. The field it sits on is no longer its own canvas; it is the page's,
//     and the hero simply asks for the calm energy level it always ran at.
//  2. The intro waits for the display face. Barlow Condensed Black at 200px
//     arriving mid-timeline reflowed every character span while they were in
//     motion — a visible shudder on the single most important animation here.
//  3. Characters are split by word, so the name can never break mid-word.
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const stmtRef = useRef<HTMLParagraphElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanupField = registerFieldSection(sectionRef.current, ENERGY.hero, { hero: 1 });

    const parts = [
      nameRef.current,
      roleRef.current,
      stmtRef.current,
      stackRef.current,
      scrollRef.current,
      lineRef.current,
    ];

    if (prefersReduced) {
      // The intro timeline is what normally clears these, so reveal them
      // directly instead of leaving the hero permanently invisible — and it
      // is also what normally ramps the field up, so land that at full drive
      // here rather than leaving the page on a dark canvas.
      setIntro(1);
      gsap.set(parts, { visibility: "visible" });
      return cleanupField;
    }

    let tl: gsap.core.Timeline | null = null;
    let tickTl: gsap.core.Timeline | null = null;
    let st: ScrollTrigger | null = null;
    let cancelled = false;

    const play = () => {
      if (cancelled) return;
      const name = nameRef.current;
      if (!name) {
        // The field's boot ramp is driven from the timeline below, so bailing
        // out here without it would leave the whole page on an unlit canvas.
        // Failing to animate is acceptable; failing to render is not.
        setIntro(1);
        return;
      }

      const chars = splitWords(name);

      tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.set(parts, { visibility: "visible" })
        // The field powers up with the name rather than being fully lit
        // before it. The lattice resolves first and the current starts
        // flowing about halfway through the rise, so the opening frame shows
        // the system starting — which is the page's whole argument, and it
        // used to be over before anyone had looked at it.
        .fromTo(
          fieldState,
          { intro: 0 },
          { intro: 1, duration: 1.9, ease: "power2.inOut" },
          0
        )
        // Signature weight. This is the slowest, heaviest entrance on the
        // site and one of only three that split to characters at all.
        .fromTo(
          chars,
          { yPercent: 118 },
          { yPercent: 0, duration: WEIGHT.signature.duration, stagger: WEIGHT.signature.stagger, ease: "expo.out" },
          0.15
        )
        .fromTo(roleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.95)
        .fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.out" }, 1.05)
        .fromTo(stmtRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 1.15)
        .fromTo(stackRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.35)
        .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.75);

      // The scroll tick, as a GSAP loop rather than a CSS keyframe so it can
      // actually be stopped once the hero leaves the viewport. It was the one
      // thing on the page still running while off screen.
      if (tickRef.current) {
        tickTl = gsap
          .timeline({ repeat: -1, paused: true })
          .fromTo(
            tickRef.current,
            { yPercent: -100 },
            { yPercent: 300, duration: 2, ease: "power1.inOut" }
          );
        st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? tickTl?.play() : tickTl?.pause()),
        });
      }
    };

    // The hero is held invisible until the display face resolves, because
    // Barlow Condensed Black arriving at 200px mid-timeline reflows every
    // character span while it is in motion.
    //
    // That gate used to race a 1200ms timeout, and on a cold load it really
    // could take most of that: the faces came from Google Fonts, so the first
    // glyph was behind DNS, TLS, a stylesheet round-trip and a second hop to
    // another origin. The worst case was over a second of nothing at all —
    // the first impression being an empty dark rectangle.
    //
    // The faces are now self-hosted and preloaded from the document itself
    // (see index.html), so they are in flight before this component exists
    // and resolve in tens of milliseconds. The race is kept only as a
    // backstop against a font that fails outright, and 400ms is now a
    // pathological ceiling rather than a plausible wait.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts) {
      Promise.race([fonts.ready, new Promise((r) => setTimeout(r, 400))]).then(play);
    } else {
      play();
    }

    return () => {
      cancelled = true;
      tl?.kill();
      tickTl?.kill();
      st?.kill();
      cleanupField();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section
      className={`relative min-h-screen flex flex-col justify-end pb-20 overflow-hidden ${PAD}`}
    >
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "55vh",
          background: "linear-gradient(rgba(255,157,60,0.07) 0%, rgba(255,157,60,0) 80%)",
        }}
      />

      <div className="relative z-10 max-w-7xl">
        {/* Overflowing name */}
        <h1
          ref={nameRef}
          className="display invisible mb-2"
          style={{ fontSize: "clamp(72px, 14vw, 200px)", lineHeight: 0.9, letterSpacing: "-0.02em" }}
        >
          {siteConfig.name}
        </h1>

        {/* Role */}
        <div ref={roleRef} className="invisible flex items-center gap-4 mb-6 mt-4">
          <span className="font-mono text-[11px] text-[var(--color-ember)] tracking-[0.3em] uppercase">
            {siteConfig.role}
          </span>
        </div>

        {/* Divider */}
        <div
          ref={lineRef}
          className="invisible h-px bg-[var(--color-fg)] mb-8 origin-left"
          style={{ opacity: 0.12, maxWidth: "40vw" }}
        />

        {/* Statement.
            `text-wrap: balance` rather than a hand-tuned max-width. Left to
            wrap normally this line filled its measure and dropped a single
            word onto the second line — a widow directly under the name, in
            the most looked-at block on the site. Balancing evens the two
            lines at any viewport instead of breaking at one width, and on
            this sentence it happens to break at the conjunction, so the
            line-split lands on the same two-part claim the rest of the page
            is built around. */}
        <p
          ref={stmtRef}
          className="invisible font-body text-[var(--color-muted)] text-lg md:text-xl max-w-xl leading-relaxed mb-8 text-balance"
        >
          {siteConfig.tagline}
        </p>

        {/* Stack */}
        <div ref={stackRef} className="invisible flex flex-wrap gap-3">
          {siteConfig.stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] border border-[rgba(240,237,230,0.12)] px-3 py-1.5 uppercase"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="invisible absolute bottom-8 right-6 md:right-12 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-[var(--color-muted)] uppercase rotate-90 origin-right mb-4">
          Scroll
        </span>
        <div className="w-px h-12 bg-[var(--color-faint)] relative overflow-hidden">
          <div
            ref={tickRef}
            className="absolute top-0 left-0 w-full bg-[var(--color-accent)]"
            style={{ height: "40%" }}
          />
        </div>
      </div>
    </section>
  );
}
