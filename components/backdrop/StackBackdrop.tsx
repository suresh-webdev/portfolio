import { CircleOutline, RoundedFill, RoundedOutline } from "./primitives";

/**
 * Light/ivory surface — the editorial "about" register. A large soft-gray
 * block bleeding off the right edge, one small solid ink block for
 * punctuation, a thin ring extending past the bottom-left corner.
 */
export function StackBackdrop() {
  return (
    <div className="shape-layer">
      <RoundedFill
        radius={16}
        className="-right-[20vw] top-[8vw] h-[60vw] w-[46vw] text-gray-light/40 md:-right-[14vw] md:top-[4vw] md:h-[42vw] md:w-[30vw]"
      />
      <RoundedFill
        radius={10}
        className="hidden text-ink lg:block lg:bottom-[14vw] lg:right-[18vw] lg:h-14 lg:w-14 lg:rotate-12"
      />
      <CircleOutline
        strokeWidth={1}
        className="-bottom-[22vw] -left-[22vw] hidden h-[48vw] w-[48vw] text-shape-strong sm:block"
      />
      <RoundedOutline
        radius={20}
        strokeWidth={1}
        className="hidden text-shape-strong xl:block xl:-top-[6vw] xl:left-[36vw] xl:h-[14vw] xl:w-[20vw] xl:-rotate-3"
      />
    </div>
  );
}
