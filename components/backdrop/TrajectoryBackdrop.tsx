import { CircleOutline, Line, RoundedFill } from "./primitives";

/**
 * Light/ivory surface — timeline register. A long horizontal line echoing
 * the role list, an oversized circle "dial" bleeding off the right edge,
 * one small solid block for the same editorial punctuation as Stack.
 */
export function TrajectoryBackdrop() {
  return (
    <div className="shape-layer">
      <Line
        strokeWidth={1}
        className="left-0 top-[22%] hidden w-full text-shape-strong md:block"
      />
      <CircleOutline
        strokeWidth={1}
        className="-right-[24vw] -bottom-[24vw] h-[52vw] w-[52vw] text-shape-strong sm:block"
      />
      <RoundedFill
        radius={10}
        className="hidden text-ink lg:block lg:left-[8vw] lg:top-[8vw] lg:h-12 lg:w-12 lg:-rotate-6"
      />
      <Line
        vertical
        strokeWidth={1}
        className="hidden h-full text-shape lg:block lg:left-[12%]"
      />
    </div>
  );
}
