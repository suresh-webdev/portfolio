import { CircleOutline, RoundedFill } from "./primitives";

/**
 * Light/ivory surface — the conclusion. One large ring bleeding off the
 * top-right (mirrors Hero's opening ring, closing the visual loop), one
 * solid ink block for a final punctuation mark.
 */
export function ContactBackdrop() {
  return (
    <div className="shape-layer">
      <CircleOutline
        strokeWidth={1}
        className="-right-[26vw] -top-[26vw] h-[54vw] w-[54vw] text-shape-strong sm:block"
      />
      <RoundedFill
        radius={12}
        className="hidden text-ink lg:block lg:bottom-[10vw] lg:left-[6vw] lg:h-16 lg:w-16 lg:rotate-6"
      />
    </div>
  );
}
