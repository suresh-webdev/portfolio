import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./lib/animations";
import { reportScroll, reportVelocity } from "./lib/field";
import { setLenis } from "./lib/scroll";
import Field from "./components/system/Field";
import Conduit from "./components/system/Conduit";
import CustomCursor from "./components/CustomCursor";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Interfaces from "./components/Interfaces";
import IBuildBoth from "./components/IBuildBoth";
import Products from "./components/Products";
import PerformanceImpact from "./components/PerformanceImpact";
import TechnicalFeatures from "./components/TechnicalFeatures";
import TheStack from "./components/TheStack";
import Timeline from "./components/Timeline";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// The junctions on the conduit. Order matches the document, and the ids are
// the `data-section` anchors each section declares.
//
// The numbering is contiguous. It used to run 01–06 and then jump to 09,
// because the three systems inside section 06 had claimed 07 and 08 from the
// same sequence — so the rail, which is read as an index, showed a gap it
// could not explain. Those three are now sub-indices of their own section
// (06 / 01, 06 / 02, 06 / 03), the way the product cases already numbered
// themselves, and the top-level count runs clean.
const SECTIONS = [
  { id: "hero", no: "01", label: "Intro" },
  { id: "work", no: "02", label: "Interfaces" },
  { id: "both", no: "03", label: "I Build Both" },
  { id: "engineering", no: "04", label: "Products" },
  { id: "impact", no: "05", label: "Impact" },
  { id: "systems", no: "06", label: "Systems" },
  { id: "stack", no: "07", label: "Stack" },
  { id: "timeline", no: "08", label: "Timeline" },
  { id: "contact", no: "09", label: "Contact" },
];

export default function App() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    let lenis: Lenis | null = null;
    let onTick: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({
        // Shortened from 1.2. Lenis already carries a tail and the scrubbed
        // sections add their own; stacking three smoothing passes read as lag
        // rather than luxury, with parallax arriving visibly behind the
        // content it belongs to.
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      setLenis(lenis);

      lenis.on("scroll", (e: { velocity: number; progress: number }) => {
        ScrollTrigger.update();
        // Moving through the page is what powers the field.
        reportVelocity(e.velocity);
        // …and on touch, where there is no pointer, where you are in the
        // document is what aims its lens.
        reportScroll(e.progress);
      });

      // One clock. Driving Lenis from GSAP's ticker rather than a second
      // requestAnimationFrame loop keeps scroll, pins and scrubs on the same
      // frame instead of a frame apart.
      onTick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
    }

    // Lenis does not drive touch scrolling unless `syncTouch` is on, and it is
    // deliberately not — hijacking momentum scrolling on a phone is worse than
    // anything it buys. So the field's lens, which on touch follows document
    // position, needs the native event as its source there.
    const onNativeScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      reportScroll(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    onNativeScroll();

    // Pins and scrubs are measured from layout, and layout is not final until
    // the display face has swapped in. Refresh once it has.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("scroll", onNativeScroll);
      if (onTick) gsap.ticker.remove(onTick);
      setLenis(null);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0c0c0b]">
      <Field />
      <CustomCursor />
      <a href="#work" className="skip-link">
        Skip to work
      </a>
      <Navigation />
      <Conduit sections={SECTIONS} />
      <main id="content" className="relative z-10">
        <Hero />
        <Interfaces />
        <IBuildBoth />
        <Products />
        <PerformanceImpact />
        <TechnicalFeatures />
        <TheStack />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
