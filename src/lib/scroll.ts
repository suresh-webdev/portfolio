import type Lenis from "lenis";

// One programmatic scroll entry point. Smooth scrolling is driven by Lenis,
// so `scrollIntoView` would fight it: the browser and Lenis would both be
// animating the same scroll position. Everything that jumps the page — nav
// links, conduit junctions, the wordmark — goes through here instead.

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, { duration: 1.1 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.1 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
