import { useEffect, useRef, useState } from "react";
import { gsap, splitWords } from "../lib/animations";
import { scrollToId, scrollToTop } from "../lib/scroll";
import { siteConfig } from "../data/siteConfig";

const navLinks = [
  { label: "Work", href: "work", no: "02" },
  { label: "Products", href: "engineering", no: "04" },
  { label: "Systems", href: "systems", no: "06" },
  { label: "Contact", href: "contact", no: "09" },
];

// Navigation stays deliberately quiet. The conduit down the left gutter
// already carries progress, the current section and a target per section, so
// a second, louder wayfinding element here would be redundant furniture.
// What it does own: the wordmark, four jumps, and the panel on small screens.
export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 1.7 }
    );

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The panel's links arrive as the same character rise used for headlines,
  // so opening the menu belongs to the same site as scrolling it.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !menuOpen) return;
    const ctx = gsap.context(() => {
      panel.querySelectorAll<HTMLElement>(".panel-link").forEach((link, i) => {
        const chars = splitWords(link);
        gsap.fromTo(
          chars,
          { yPercent: 118 },
          { yPercent: 0, duration: 0.7, ease: "expo.out", stagger: 0.02, delay: 0.08 + i * 0.06 }
        );
      });
    }, panel);
    return () => ctx.revert();
  }, [menuOpen]);

  // A locked page behind an open full-screen panel: without this the body
  // keeps scrolling under it.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const go = (href: string) => {
    setMenuOpen(false);
    // Let the panel finish closing before the page moves.
    setTimeout(() => scrollToId(href), menuOpen ? 240 : 0);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[60] px-6 md:pl-28 md:pr-12 py-4 md:py-5 flex items-center justify-between transition-[background,border-color,backdrop-filter] duration-500"
        style={{
          background: scrolled && !menuOpen ? "rgba(12,12,11,0.82)" : "transparent",
          borderBottom: `1px solid ${
            scrolled && !menuOpen ? "rgba(240,237,230,0.07)" : "transparent"
          }`,
          backdropFilter: scrolled && !menuOpen ? "blur(14px)" : "none",
        }}
      >
        <button
          onClick={scrollToTop}
          className="display text-sm tracking-[0.22em] hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          {siteConfig.name}
        </button>

        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => go(link.href)}
              className="group relative font-mono text-[10px] tracking-[0.24em] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors duration-300 uppercase py-1"
            >
              {link.label}
              <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] bg-[var(--color-accent)]" />
            </button>
          ))}
        </div>

        <button
          className="md:hidden relative -mr-2 flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="menu-panel"
        >
          <span
            className="w-6 h-px bg-[var(--color-fg)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }}
          />
          <span
            className="w-6 h-px bg-[var(--color-fg)] transition-opacity duration-200"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="w-6 h-px bg-[var(--color-fg)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }}
          />
        </button>
      </nav>

      <div
        ref={panelRef}
        id="menu-panel"
        className="fixed inset-0 z-[55] bg-[#0c0c0b] flex flex-col justify-end gap-3 px-6 pt-20 pb-16 md:hidden transition-opacity duration-400"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        aria-hidden={!menuOpen}
      >
        {navLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => go(link.href)}
            className="flex items-baseline gap-5 text-left py-2"
            tabIndex={menuOpen ? 0 : -1}
          >
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--color-ember)]">
              {link.no}
            </span>
            <span className="panel-link display text-5xl">{link.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
