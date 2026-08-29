interface Props {
  value: string;
}

// The oversized index numeral from Hero, extracted so every major section can
// carry the same watermark — a single recurring device that ties the scroll
// together instead of Hero using it once and every later section falling
// back to a small mono label alone.
export default function GhostNumeral({ value }: Props) {
  return (
    <div
      className="absolute top-16 md:top-20 right-8 md:right-12 font-display font-black uppercase text-[#f0ede6] pointer-events-none select-none"
      style={{ fontSize: "clamp(100px, 16vw, 220px)", opacity: 0.03, lineHeight: 1 }}
    >
      {value}
    </div>
  );
}
