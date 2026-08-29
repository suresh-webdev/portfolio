import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "../../lib/animations";
import { scrollToId } from "../../lib/scroll";

// THE CONDUIT — the one object that travels the entire page.
//
// Every section used to draw its own little connecting line (Timeline had
// one, Products had a copy of it) and the page had a separate, invisible
// scroll position. Those are the same idea, so they are now one object: a
// single line running the full height of the viewport, carrying a pulse that
// sits exactly where you are in the document, with a junction for every
// section.
//
// It is deliberately the same drawing as the shader's traffic — a bright head
// with a tail behind it, riding a hairline — so the page's signature motion
// and its navigation are literally the same device. The tail flips to trail
// the direction of travel and lengthens with scroll speed.
//
// It is also load-bearing UX: progress, current section, and a click target
// per section. On a phone the same object rotates to a horizontal rail under
// the navigation rather than being dropped.

interface Section {
  id: string;
  /** The numeral the section itself prints, so the rail agrees with the page. */
  no: string;
  label: string;
}

const TAIL_PX = 150;

export default function Conduit({ sections }: { sections: Section[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const tailDownRef = useRef<HTMLDivElement>(null);
  const tailUpRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const mBarRef = useRef<HTMLDivElement>(null);
  const mHeadRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);

  const [marks, setMarks] = useState<number[]>([]);
  // Read by the ScrollTrigger callback so it sees current values without
  // being torn down and rebuilt on every re-measure.
  const marksRef = useRef<number[]>([]);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(-1);

  const activeLabel = sections[active]?.label ?? "";
  marksRef.current = marks;

  // Recomputed on refresh rather than every frame: section offsets only
  // change when layout does, and ScrollTrigger already tells us when.
  const measure = useMemo(
    () => () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const next = sections.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return 0;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return Math.min(1, Math.max(0, top / max));
      });
      setMarks(next);
    },
    [sections]
  );

  // The conduit draws itself in, once, on load.
  //
  // This is the site's most distinctive object and it used to arrive already
  // finished, which meant the one thing that separates this page from every
  // other dark portfolio was invisible until the visitor happened to scroll.
  // Now the rail draws down the gutter, the junctions resolve along it, and
  // the head drops into place — in step with the hero's headline, so the
  // opening frame states the whole idea: a line carrying current, with a stop
  // for every section.
  const introPlayed = useRef(false);

  useEffect(() => {
    // The junctions are rendered from measured offsets, so they do not exist
    // on the first commit — wait for the measure pass before drawing them in.
    if (introPlayed.current || !marks.length) return;
    if (prefersReducedMotion()) return;
    introPlayed.current = true;

    const ctx = gsap.context(() => {
      const junctions = railRef.current?.querySelectorAll(".conduit-junction") ?? [];
      const mMarks = barRef.current?.querySelectorAll(".conduit-mark") ?? [];
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        trackRef.current,
        { scaleY: 0 },
        { scaleY: 1, duration: 1.1, ease: "expo.out", transformOrigin: "top center" },
        0
      )
        .fromTo(
          mBarRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: "expo.out", transformOrigin: "left center" },
          0
        )
        .fromTo(
          junctions,
          { opacity: 0, x: -6 },
          { opacity: 1, x: 0, duration: 0.5, ease: "power2.out", stagger: 0.045 },
          0.4
        )
        // Same beat for the flat rail. Staggering the two lists as one would
        // have put the phone's marks behind nine invisible desktop steps.
        .fromTo(
          mMarks,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.045 },
          0.4
        )
        .fromTo(
          [headRef.current, mHeadRef.current],
          { opacity: 0, scale: 0.4 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
          0.8
        )
        .fromTo(readoutRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.95);
    });
    return () => {
      // Clearing the latch as well as reverting keeps React's dev-only
      // double-mount honest: without it the second mount sees the flag still
      // set, returns early, and the intro silently never runs in development.
      introPlayed.current = false;
      ctx.revert();
    };
  }, [marks.length]);

  useEffect(() => {
    const rail = railRef.current;
    const head = headRef.current;
    if (!rail || !head) return;

    measure();
    ScrollTrigger.addEventListener("refresh", measure);

    const quickY = gsap.quickTo(head, "y", { duration: 0.32, ease: "power3.out" });
    const quickMX = mHeadRef.current
      ? gsap.quickTo(mHeadRef.current, "x", { duration: 0.32, ease: "power3.out" })
      : null;

    let tailLen = 0;

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const p = self.progress;
        const railH = rail.clientHeight;
        const y = p * railH;

        quickY(y);
        if (quickMX && barRef.current) quickMX(p * barRef.current.clientWidth);

        // The tail is the visible read-out of scroll speed: still, it
        // collapses to nothing; flung, it streaks.
        const speed = Math.min(Math.abs(self.getVelocity()) / 2600, 1);
        tailLen += (speed - tailLen) * 0.2;

        const down = self.direction === 1;
        const dn = tailDownRef.current;
        const up = tailUpRef.current;
        if (dn && up) {
          gsap.set(dn, { y, scaleY: tailLen, opacity: down ? 1 : 0 });
          gsap.set(up, { y, scaleY: tailLen, opacity: down ? 0 : 1 });
        }

        // Nearest junction behind the head is the section you are in.
        let idx = 0;
        for (let i = 0; i < marksRef.current.length; i++) {
          if (p >= marksRef.current[i] - 0.02) idx = i;
        }
        setActive(idx);
      },
    });

    return () => {
      st.kill();
      ScrollTrigger.removeEventListener("refresh", measure);
    };
  }, [measure]);

  const goTo = (id: string) => scrollToId(id);

  return (
    <>
      {/* Desktop: vertical conduit in the left gutter. */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 z-40 w-12 pointer-events-none">
        <div ref={railRef} className="absolute left-6 top-24 bottom-24">
          {/* Track */}
          <div
            ref={trackRef}
            className="absolute inset-y-0 left-0 w-px bg-[rgba(240,237,230,0.09)]"
          />

          {/* Tails — same head-and-tail drawing as the pulses in the field. */}
          <div
            ref={tailDownRef}
            className="absolute left-0 w-px origin-bottom"
            style={{
              height: TAIL_PX,
              top: -TAIL_PX,
              background: "linear-gradient(to bottom, transparent, var(--color-accent))",
              opacity: 0,
            }}
          />
          <div
            ref={tailUpRef}
            className="absolute left-0 w-px origin-top"
            style={{
              height: TAIL_PX,
              top: 0,
              background: "linear-gradient(to top, transparent, var(--color-accent))",
              opacity: 0,
            }}
          />

          {/* Junctions */}
          {marks.map((m, i) => (
            <button
              key={sections[i].id}
              onClick={() => goTo(sections[i].id)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              aria-label={sections[i].label}
              className="conduit-junction absolute pointer-events-auto flex items-center gap-3 -translate-y-1/2 py-2 pr-3"
              style={{ top: `${m * 100}%`, left: -7 }}
            >
              <span
                className="block transition-all duration-300"
                style={{
                  width: i === active ? 9 : 5,
                  height: 1,
                  background:
                    i === active || i === hover ? "var(--color-accent)" : "rgba(240,237,230,0.28)",
                  marginLeft: i === active ? 3 : 5,
                }}
              />
              <span
                className="font-mono text-[9px] tracking-[0.22em] uppercase whitespace-nowrap transition-all duration-300"
                style={{
                  color: i === active ? "var(--color-fg)" : "var(--color-muted)",
                  opacity: i === hover ? 1 : 0,
                  transform: `translateX(${i === hover ? 0 : -6}px)`,
                }}
              >
                {sections[i].label}
              </span>
            </button>
          ))}

          {/* The head. */}
          <div ref={headRef} className="absolute left-0 top-0">
            <div
              className="absolute rounded-full"
              style={{
                width: 5,
                height: 5,
                left: -2,
                top: -2,
                background: "var(--color-accent)",
                boxShadow: "0 0 12px 2px rgba(255,157,60,0.55)",
              }}
            />
          </div>
        </div>

        {/* Live read-out of where you are, set on the rail like an instrument
            label rather than floating free. */}
        <div
          ref={readoutRef}
          className="absolute left-[18px] bottom-8 origin-bottom-left font-mono text-[9px] tracking-[0.28em] uppercase whitespace-nowrap"
          style={{ transform: "rotate(-90deg) translateX(0)", color: "var(--color-muted)" }}
        >
          <span style={{ color: "var(--color-accent)" }}>{sections[active]?.no}</span>
          <span className="opacity-40"> / </span>
          {activeLabel}
        </div>
      </div>

      {/* Mobile: the same object, laid flat under the navigation. */}
      <div className="md:hidden fixed top-[52px] left-0 right-0 z-40 h-px pointer-events-none">
        <div ref={barRef} className="relative h-px">
          {/* The track is its own element so the intro can scale it without
              also squashing the head and the marks parented to the rail. */}
          <div
            ref={mBarRef}
            className="absolute inset-0 origin-left bg-[rgba(240,237,230,0.09)]"
          />
          {marks.map((m, i) => (
            <span
              key={sections[i].id}
              className="conduit-mark absolute top-0 h-px transition-colors duration-300"
              style={{
                left: `${m * 100}%`,
                width: 6,
                background: i <= active ? "rgba(255,157,60,0.5)" : "rgba(240,237,230,0.22)",
              }}
            />
          ))}
          <div ref={mHeadRef} className="absolute top-0 left-0">
            <span
              className="absolute block"
              style={{
                width: 34,
                height: 1,
                left: -34,
                background: "linear-gradient(to right, transparent, var(--color-accent))",
              }}
            />
            <span
              className="absolute rounded-full"
              style={{
                width: 5,
                height: 5,
                left: -2.5,
                top: -2,
                background: "var(--color-accent)",
                boxShadow: "0 0 10px 2px rgba(255,157,60,0.7)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
