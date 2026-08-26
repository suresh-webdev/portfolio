import { cn } from "@/lib/utils";

/**
 * Shared building blocks for the per-section backdrops. Every backdrop
 * composes these by hand with specific placements — nothing here is
 * randomized or auto-generated. Colors default to currentColor so each
 * caller sets its own via a text-* utility on the wrapper.
 */

type ShapeProps = {
  className?: string;
};

/** A large stroked circle, meant to bleed past its own bounding box. */
export function CircleOutline({
  className,
  strokeWidth = 1,
}: ShapeProps & { strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("absolute", className)}
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="49"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A filled circle. */
export function CircleFill({ className }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("absolute", className)}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="50" fill="currentColor" />
    </svg>
  );
}

/** A rounded rectangle, stroked. */
export function RoundedOutline({
  className,
  radius = 18,
  strokeWidth = 1,
}: ShapeProps & { radius?: number; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("absolute", className)}
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="98"
        height="98"
        rx={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A filled rounded block. */
export function RoundedFill({
  className,
  radius = 18,
}: ShapeProps & { radius?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("absolute", className)}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="100" height="100" rx={radius} fill="currentColor" />
    </svg>
  );
}

/** A quarter/partial arc, for corner bleed treatments. */
export function Arc({
  className,
  strokeWidth = 1,
  dashed = false,
}: ShapeProps & { strokeWidth?: number; dashed?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("absolute", className)}
      aria-hidden="true"
    >
      <path
        d="M 2 50 A 48 48 0 0 1 98 50"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? "4 5" : undefined}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A single straight line, for long structural strokes. */
export function Line({
  className,
  strokeWidth = 1,
  vertical = false,
}: ShapeProps & { strokeWidth?: number; vertical?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("absolute", className)}
      aria-hidden="true"
    >
      {vertical ? (
        <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      ) : (
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  );
}

/** A sparse grid of dots — the "technical" texture for structured sections. */
export function DotGrid({
  className,
  cols = 6,
  rows = 4,
}: ShapeProps & { cols?: number; rows?: number }) {
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c / (cols - 1)) * 100;
      const y = (r / (rows - 1)) * 100;
      dots.push(<circle key={`${r}-${c}`} cx={x} cy={y} r="1.1" fill="currentColor" />);
    }
  }
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("absolute", className)}
      aria-hidden="true"
    >
      {dots}
    </svg>
  );
}

/** A small node-and-line cluster — a few connected points, hand-placed. */
export function NodeCluster({ className }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 200 120"
      className={cn("absolute", className)}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <line x1="10" y1="100" x2="70" y2="40" />
        <line x1="70" y1="40" x2="140" y2="60" />
        <line x1="140" y1="60" x2="190" y2="15" />
        <line x1="70" y1="40" x2="60" y2="110" />
      </g>
      <g fill="currentColor">
        <circle cx="10" cy="100" r="3" />
        <circle cx="70" cy="40" r="3.5" />
        <circle cx="140" cy="60" r="3" />
        <circle cx="190" cy="15" r="3" />
        <circle cx="60" cy="110" r="2.5" />
      </g>
    </svg>
  );
}
