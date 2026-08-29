import { useEffect, useRef } from "react";
import { drawRule, settle } from "../lib/animations";

interface Props {
  index: string;
  label: string;
  /** Aligns the mark to the right edge for sections that flip their axis. */
  align?: "left" | "right";
}

// The section mark. Its rule draws itself on entry — the same gesture the
// conduit makes, at section scale, so arriving at a section rhymes with
// passing a junction on the rail.
export default function SectionLabel({ index, label, align = "left" }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    settle(rowRef.current);
    drawRule(ruleRef.current);
  }, []);

  return (
    <div
      ref={rowRef}
      className={`flex items-center gap-4 ${align === "right" ? "flex-row-reverse" : ""}`}
    >
      {/* Ember, not the hot accent. The index is a permanent structural mark;
          it never responds to anything, so it has no business wearing the
          colour that means "this is live". */}
      <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--color-ember)]">{index}</span>
      <span
        ref={ruleRef}
        className={`h-px w-10 bg-[rgba(240,237,230,0.28)] ${align === "right" ? "origin-right" : "origin-left"}`}
      />
      <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-[var(--color-muted)]">
        {label}
      </span>
    </div>
  );
}
