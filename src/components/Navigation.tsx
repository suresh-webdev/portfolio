import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/animations";
import { siteConfig } from "../data/siteConfig";

const navLinks = [
  { label: "WORK", href: "#work" },
  { label: "ENGINEERING", href: "#engineering" },
  { label: "ABOUT", href: "#about" },
  { label: "TIMELINE", href: "#timeline" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 1.8 }
    );

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-8 md:px-12 py-5 flex items-center justify-between transition-all duration-500"
        style={{
          background: scrolled ? "rgba(12,12,11,0.92)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(240,237,230,0.08)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-sm font-semibold tracking-[0.2em] text-[#f0ede6] uppercase"
        >
          {siteConfig.name}
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="font-mono text-[10px] tracking-[0.25em] text-[#6b6860] hover:text-[#f0ede6] transition-colors duration-300 uppercase"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="w-6 h-px bg-[#f0ede6] transition-all duration-300"
            style={{ transform: menuOpen ? "rotate(45deg) translateY(4px)" : "none" }}
          />
          <span
            className="w-6 h-px bg-[#f0ede6] transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="w-6 h-px bg-[#f0ede6] transition-all duration-300"
            style={{ transform: menuOpen ? "rotate(-45deg) translateY(-4px)" : "none" }}
          />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className="fixed inset-0 z-40 bg-[#0c0c0b] flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transform: menuOpen ? "translateY(0)" : "translateY(-20px)",
        }}
      >
        {navLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            className="font-display text-4xl font-bold tracking-widest text-[#f0ede6] uppercase hover:text-[#d4a843] transition-colors duration-300"
          >
            {link.label}
          </button>
        ))}
      </div>
    </>
  );
}
