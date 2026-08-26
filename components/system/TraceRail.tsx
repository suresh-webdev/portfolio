"use client";

import { useScrollState } from "./ScrollState";

/**
 * A thin top-edge progress hairline — the nav already lists sections with
 * an active-state highlight, so this doesn't repeat that; it just tracks
 * raw scroll position across the whole document.
 */
export function TraceRail() {
  const { progress } = useScrollState();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-px bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-ember transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
