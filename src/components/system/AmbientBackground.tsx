// A fixed, full-viewport ambient layer: the faint grid Hero used to own alone,
// now shared across every section so the page doesn't fall back to flat black
// once the grid scrolls out of Hero.
export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(240,237,230,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,237,230,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
