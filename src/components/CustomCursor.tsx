import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/animations";

// Anything that responds to a click needs cursor feedback, not just the cards
// that opt in with data-cursor. With `cursor: none` set globally, an element
// without a state here has *no* hover affordance at all.
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, [data-cursor]';

type CursorState = "default" | "link" | "labeled";

// A ring that scales with intent: small at rest, opening over a control, and
// wide enough to carry a label over a project card.
//
// The labeled state was 104px — the largest, most expressive thing on the
// site, spent on four elements that all said very nearly the same word. It is
// smaller now, and the labels it carries actually identify what is under it,
// so the scale matches the promise.
const SIZE: Record<CursorState, number> = {
  default: 36,
  link: 54,
  labeled: 92,
};

// How hard the reticle chases the pointer. At 0.18 the ring trailed the dot
// by 40–60px on a fast sweep — far enough that they read as two unrelated
// objects with a latency bug between them rather than as one cursor with a
// little weight. Tight enough now to stay a single object, loose enough to
// still have life in it.
const CHASE = 0.29;

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DUR = "320ms";

export default function CustomCursor() {
  const frameRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [isTouch] = useState(() => window.matchMedia("(hover: none)").matches);

  useEffect(() => {
    if (isTouch) return;

    const frame = frameRef.current;
    const dot = dotRef.current;
    if (!frame || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;
    let seeded = false;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!seeded) {
        curX = mouseX;
        curY = mouseY;
        seeded = true;
        setVisible(true);
      }
    };

    document.addEventListener("mousemove", move, { passive: true });

    const ticker = gsap.ticker.add(() => {
      // The reticle trails slightly for life; the dot is exact, so the thing
      // you actually aim with never lags behind the pointer.
      curX += (mouseX - curX) * CHASE;
      curY += (mouseY - curY) * CHASE;
      gsap.set(frame, { x: curX, y: curY });
      gsap.set(dot, { x: mouseX, y: mouseY });
    });

    // Delegation rather than per-element listeners: one pair of handlers
    // covers every interactive node, including anything rendered later.
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      if (!target) return;
      const explicit = target.closest("[data-cursor]") as HTMLElement | null;
      if (explicit) {
        setLabel(explicit.dataset.cursorLabel || "VIEW →");
        setState("labeled");
      } else {
        setLabel("");
        setState("link");
      }
    };

    const onOut = (e: MouseEvent) => {
      const from = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE);
      const to = (e.relatedTarget as HTMLElement | null)?.closest?.(INTERACTIVE);
      // Moving between two children of the same control shouldn't flicker.
      if (from && from === to) return;
      if (to) return;
      setState("default");
      setLabel("");
    };

    const onLeaveWindow = () => setVisible(false);
    // Only reveal once a real pointer position is known. `mouseenter` can fire
    // before any `mousemove` — the pointer already sitting inside the window on
    // load, or coming back from another tab — and showing the reticle then
    // painted it at the viewport origin for a frame before it flew to the
    // cursor. Seeding always happens in `move`, so gate on it.
    const onEnterWindow = () => {
      if (seeded) setVisible(true);
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      gsap.ticker.remove(ticker);
    };
  }, [isTouch]);

  if (isTouch) return null;

  const size = SIZE[state];
  const accented = state !== "default";

  return (
    <>
      <div
        ref={frameRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
      >
        {/* Sizing the ring directly beats scaling a fixed box: the label can
            then be set at a real 9px instead of a sub-pixel size rescued by a
            transform, which blurred on every non-integer scale factor. */}
        <div
          className="rounded-full border flex items-center justify-center"
          style={{
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            borderColor: accented ? "#ff9d3c" : "#f0ede6",
            background: accented ? "rgba(255,157,60,0.10)" : "transparent",
            // The resting ring used to invert what was under it with
            // `mix-blend-mode: difference`. Over flat ground that was fine;
            // crossing an etched headline — itself a #fffdf8 → #9b968b ramp —
            // it produced a muddy grey band whose colour shifted as it
            // travelled the gradient, which is the opposite of what a cursor
            // should do.
            //
            // A fixed light stroke with a dark halo ringed just outside it
            // survives every background on the page without changing colour:
            // on the dark ground the halo is invisible, and over the pale
            // headline it is what keeps the stroke readable.
            boxShadow: accented ? "none" : "0 0 0 1px rgba(12,12,11,0.5)",
            transition: `width ${DUR} ${EASE}, height ${DUR} ${EASE}, margin ${DUR} ${EASE}, border-color 300ms ease, background 300ms ease, box-shadow 300ms ease`,
          }}
        >
          <span
            className="font-mono text-[9px] text-[#ff9d3c] tracking-[0.15em] uppercase whitespace-nowrap"
            style={{
              opacity: state === "labeled" && label ? 1 : 0,
              transition: "opacity 200ms ease",
            }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* The dot is the pointer: it is the only part of this cursor that sits
          exactly where the click will land.

          It used to be hidden the moment the ring accented at all, which meant
          that over every link on the page — small targets, precisely where
          aiming matters — there was a 54px ring and nothing to aim with. It
          now survives the link state, tightening slightly instead of
          disappearing.

          It still stands down for the labeled state, and only that one: there
          the ring is carrying centred text, so a 6px dot in the middle of it
          lands on top of the label and reads as a defect rather than a
          pointer — and the targets that state belongs to are whole project
          frames, where there is nothing to aim at precisely anyway. */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-[#ff9d3c]"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          opacity: visible && state !== "labeled" ? 1 : 0,
          // The independent `scale` property, not a transform — GSAP owns
          // this element's `transform` for positioning, and React rewriting
          // it on re-render would drop the dot to the origin for a frame.
          scale: state === "link" ? "0.66" : "1",
          boxShadow: "0 0 0 1px rgba(12,12,11,0.45)",
          transition: "opacity 200ms ease, scale 300ms ease",
        }}
      />
    </>
  );
}
