import { useEffect, useRef } from "react";
import { gsap, registerFieldSection, settle, settleGroup, wipe, ENTER } from "../lib/animations";
import { ENERGY } from "../lib/field";
import { skills } from "../data/skills";
import { PAD, SHELL } from "../lib/layout";
import SectionLabel from "./SectionLabel";

// THE STACK — the lattice, made literal.
//
// This was a three-column grid of bordered cards with a list inside each: the
// most anonymous block on the page, and the one that had least to do with the
// rest of it. It is now the page's own lattice, full-bleed and edge-to-edge,
// with every capability occupying a cell.
//
// Hovering a cell flares its junction and runs a line across its top edge —
// the same head-and-line drawing the field uses for traffic and the conduit
// uses for position. The section's whole interaction is that one gesture,
// repeated across forty cells, so it reads as a surface responding rather
// than as forty separate hover states.
//
// Deliberately full-bleed: it is the one section that abandons the page's
// left gutter, which breaks the vertical rhythm exactly once, near the end.

type Cell =
  | { kind: "head"; label: string }
  | { kind: "item"; label: string }
  | { kind: "fill" };

// Every group is padded out to a whole number of rows.
//
// Without this the last row of each category simply stopped wherever the item
// count ran out, so a section whose entire premise is "the lattice, made
// literal" had a ragged right edge with the borders ending mid-air in four
// places out of six. Six is divisible by the column count at every breakpoint
// (6 / 3 / 2), so padding to a multiple of six squares the grid on all of
// them.
const COLS = 6;

const CELLS: Cell[] = skills.flatMap((g) => {
  const pad = (COLS - (g.items.length % COLS)) % COLS;
  return [
    { kind: "head" as const, label: g.category },
    ...g.items.map((i) => ({ kind: "item" as const, label: i })),
    ...Array.from({ length: pad }, () => ({ kind: "fill" as const })),
  ];
});

export default function TheStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const latticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanupField = registerFieldSection(sectionRef.current, ENERGY.stack);
    const ctx = gsap.context(() => {
      wipe(headRef.current);
      settle(ledeRef.current, 0.1);
      if (latticeRef.current) {
        // "from edges" so the lattice assembles inward rather than wiping
        // top-to-bottom like every other list on the page.
        settleGroup(latticeRef.current.querySelectorAll(".cell"), {
          stagger: 0.012,
          from: "edges",
          y: 14,
          start: ENTER,
        });
      }
    }, sectionRef);
    return () => {
      ctx.revert();
      cleanupField();
    };
  }, []);

  return (
    // The page's one tonal event.
    //
    // Eleven sections all sat on #0c0c0b, and --color-surface was seven levels
    // away from it — effectively a single value from top to bottom, which is
    // exactly why a long dark site starts to feel like a tunnel. The only
    // luminance change anywhere was the blackout, and that goes *darker*.
    //
    // This section lifts onto a raised ground with a hairline at each edge, so
    // the lattice reads as a physical panel set into the page rather than more
    // of the same darkness — and, not incidentally, it gives the blackout two
    // sections earlier something to have been dark relative to.
    <section
      ref={sectionRef}
      id="stack"
      data-section
      className="relative py-24 md:py-32 bg-[var(--color-raised)] border-y border-[rgba(240,237,230,0.07)]"
    >
      {/* Right-aligned. This is the one section that leaves the container and
          bleeds off the right edge, so its header sets against the same edge
          the lattice runs off — the axis flip and the full bleed are the same
          gesture rather than two unrelated exceptions. */}
      <div className={`relative ${PAD} ${SHELL} mb-14 md:mb-20 md:text-right`}>
        {/* Pushed to the right edge rather than internally reversed: the
            label's own `align="right"` flips its running order, which reads
            correctly only when it is actually sitting against an edge — and on
            a phone this header is not. Justifying the row instead keeps the
            mark reading index → rule → label everywhere. */}
        <div className="md:flex md:justify-end">
          <SectionLabel index="07" label="Capabilities" />
        </div>
        <h2 ref={headRef} className="display mt-8 mb-6" style={{ fontSize: "clamp(52px, 8vw, 132px)" }}>
          The Stack
        </h2>
        <p
          ref={ledeRef}
          className="font-body text-[var(--color-muted)] text-base md:text-lg max-w-md leading-relaxed md:ml-auto"
        >
          Forty-odd cells on the same lattice everything else here is drawn on.
        </p>
      </div>

      {/* Bleeds off the right edge and ignores the page's right margin — the
          one section that leaves the container. It still clears the conduit
          gutter on the left, because running type under the rail would cost
          legibility for nothing. */}
      <div
        ref={latticeRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-t border-l border-[rgba(240,237,230,0.07)] md:ml-24"
      >
        {CELLS.map((cell, i) =>
          cell.kind === "fill" ? (
            // An empty cell of the lattice. It is ruled like every other cell
            // and holds nothing — which is the point: the grid is the subject
            // here, so it has to close.
            <div
              key={`fill-${i}`}
              className="cell border-b border-r border-[rgba(240,237,230,0.07)] min-h-[68px] md:min-h-[92px]"
              aria-hidden="true"
            />
          ) : cell.kind === "head" ? (
            // Category headers span the whole row rather than taking a cell.
            // Scattered through the flow they landed in whatever column the
            // count left them in, and the grouping became unreadable.
            <div
              key={`head-${cell.label}`}
              className="cell col-span-2 sm:col-span-3 lg:col-span-6 border-b border-r border-[rgba(240,237,230,0.07)] px-5 md:px-6 py-4 flex items-center gap-4"
            >
              <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-[var(--color-ember)] whitespace-nowrap">
                {cell.label}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-[rgba(204,106,48,0.4)] to-transparent" />
            </div>
          ) : (
            <div
              key={`item-${cell.label}-${i}`}
              className="cell group relative border-b border-r border-[rgba(240,237,230,0.07)] px-5 py-5 md:px-6 md:py-8 min-h-[68px] md:min-h-[92px] flex items-center md:items-end overflow-hidden"
            >
              {/* Junction flare, exactly where the lattice crosses. */}
              <span
                className="absolute top-0 left-0 w-[3px] h-[3px] -translate-x-px -translate-y-px bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: "0 0 8px 1px rgba(255,157,60,0.6)" }}
              />
              {/* Current running the cell's top edge. */}
              <span className="absolute top-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[550ms] ease-out bg-gradient-to-r from-[var(--color-accent)] to-transparent" />
              <span className="font-body text-sm text-[var(--color-fg)] opacity-70 group-hover:opacity-100 transition-opacity duration-300 leading-snug">
                {cell.label}
              </span>
            </div>
          )
        )}
      </div>
    </section>
  );
}
