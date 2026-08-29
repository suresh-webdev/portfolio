import { useEffect, useRef } from "react";
import { parallaxY } from "../lib/animations";

type Place = "tr" | "tl" | "br" | "bleed-r" | "bleed-l";

interface Props {
  value: string;
  place?: Place;
  /** Larger numerals for sections that need a compositional counterweight. */
  scale?: number;
}

const PLACEMENT: Record<Place, string> = {
  tr: "top-10 right-6 md:top-14 md:right-12",
  tl: "top-10 left-6 md:top-14 md:left-24",
  br: "bottom-10 right-6 md:bottom-16 md:right-12",
  // Deliberately hanging off the viewport edge. A watermark that is fully
  // contained reads as a label; one that is cropped reads as scenery.
  "bleed-r": "top-1/4 -right-[8%] md:-right-[5%]",
  "bleed-l": "top-1/4 -left-[10%] md:-left-[4%]",
};

// The index numeral, carried by every major section. It used to sit in the
// identical top-right corner every time, which turned the one compositional
// flourish on the page into a repeating stamp. It now takes a placement,
// drifts against the scroll, and is cropped by the viewport in two places.
//
// It also used to be invisible. A solid fill at 3.5% opacity composites to
// roughly #141413 on this ground — eight levels out of 255 from the
// background, laid over a lattice drawn at the same alpha — so the page's
// only compositional counterweight, and its only parallax, were both
// effectively not being rendered. It is now an outline at hairline weight,
// which reads as drafting structure rather than as a smudge and holds up
// against the field's traffic passing behind it.
export default function GhostNumeral({ value, place = "tr", scale = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Now that the numeral is actually visible, the drift is worth more than
    // the ±14% it was set to when nothing could be seen moving.
    parallaxY(ref.current, 20 * scale, 1);
  }, [scale]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute display display-ghost pointer-events-none select-none ${PLACEMENT[place]}`}
      style={{
        fontSize: `clamp(${110 * scale}px, ${16 * scale}vw, ${240 * scale}px)`,
        lineHeight: 0.8,
      }}
    >
      {value}
    </div>
  );
}
