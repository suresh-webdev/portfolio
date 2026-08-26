import { DotGrid, CircleOutline, Line } from "./primitives";

/**
 * Charcoal surface — a dense dot matrix top-right, a single horizontal
 * marker line, and a small ring bottom-left.
 */
export function ToolkitBackdrop() {
  return (
    <div className="shape-layer">
      <DotGrid
        cols={7}
        rows={5}
        className="-right-6 -top-6 h-40 w-56 text-shape lg:h-48 lg:w-64"
      />
      <Line
        strokeWidth={1}
        className="hidden w-full text-shape lg:block lg:bottom-[30%]"
      />
      <CircleOutline
        strokeWidth={1}
        className="-bottom-[14vw] -left-[14vw] h-[30vw] w-[30vw] text-shape sm:block"
      />
    </div>
  );
}
