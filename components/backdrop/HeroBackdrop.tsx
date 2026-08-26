import { CircleOutline, RoundedOutline, DotGrid } from "./primitives";

/**
 * Dark surface. One oversized circle bleeding off the top-right, a second
 * smaller ring low-left, a faint dot grid to ground the lower corner.
 * Everything sits well under the typography in contrast.
 */
export function HeroBackdrop() {
  return (
    <div className="shape-layer">
      <CircleOutline
        strokeWidth={1}
        className="-right-[28vw] -top-[38vw] h-[85vw] w-[85vw] text-shape sm:-right-[22vw] sm:-top-[30vw] sm:h-[70vw] sm:w-[70vw] lg:-right-[16vw] lg:-top-[24vw] lg:h-[52vw] lg:w-[52vw]"
      />
      <CircleOutline
        strokeWidth={1}
        className="hidden text-shape md:block md:-bottom-[18vw] md:-left-[14vw] md:h-[38vw] md:w-[38vw]"
      />
      <RoundedOutline
        radius={22}
        strokeWidth={1}
        className="hidden text-ember-24 lg:block lg:-bottom-[10vw] lg:right-[6vw] lg:h-[16vw] lg:w-[13vw] lg:rotate-6"
      />
      <DotGrid
        cols={5}
        rows={5}
        className="hidden text-shape-strong lg:block lg:bottom-10 lg:left-[4vw] lg:h-24 lg:w-24"
      />
    </div>
  );
}
