import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "./lib/animations";
import AmbientBackground from "./components/system/AmbientBackground";
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

export default function App() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;

    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => {
        lenis!.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      ScrollTrigger.refresh();
    }

    return () => {
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#0c0c0b" }}>
      <AmbientBackground />
      <CustomCursor />
      <Navigation />
      <main>
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
