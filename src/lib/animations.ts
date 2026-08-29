import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function splitChars(element: Element | null): HTMLSpanElement[] {
  if (!element) return [];
  const text = element.textContent || "";
  const chars = text.split("").map((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? " " : char;
    span.style.display = "inline-block";
    // Without this, a span whose sole content is a single space collapses to
    // 0 width — it is simultaneously the leading and trailing whitespace of
    // its own line box — silently swallowing every word gap in the headline.
    span.style.whiteSpace = "pre";
    return span;
  });
  element.textContent = "";
  chars.forEach((span) => element.appendChild(span));
  return chars;
}

export function revealChars(element: Element | null, delay = 0) {
  if (!element) return;
  const chars = splitChars(element);

  gsap.fromTo(
    chars,
    { y: "110%", opacity: 0 },
    {
      y: "0%",
      opacity: 1,
      duration: 0.7,
      stagger: 0.04,
      ease: "power3.out",
      delay,
    }
  );
}

export function maskReveal(element: Element | null, delay = 0) {
  if (!element) return;
  gsap.fromTo(
    element,
    { clipPath: "inset(0 100% 0 0)", opacity: 0 },
    {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      duration: 1.1,
      ease: "power3.inOut",
      delay,
    }
  );
}

export function fadeUp(element: Element | null, delay = 0) {
  if (!element) return;
  gsap.fromTo(
    element,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      delay,
    }
  );
}

export function scrollReveal(elements: NodeListOf<Element> | Element[], options: ScrollTrigger.Vars = {}) {
  elements.forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
          ...options,
        },
        delay: i * 0.07,
      }
    );
  });
}

export function horizontalText(element: Element | null, fromX: number) {
  if (!element) return;
  gsap.fromTo(
    element,
    { x: fromX },
    {
      x: -fromX,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    }
  );
}

export function parallaxY(element: Element | null, distance: number) {
  if (!element) return;
  gsap.fromTo(
    element,
    { y: -distance },
    {
      y: distance,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    }
  );
}

// Purposeful magnetic pull for primary CTAs — nudges the element toward the
// cursor within a capped radius, snapping back on leave. No-op on touch
// devices and when the visitor prefers reduced motion.
export function attachMagnetic(el: HTMLElement | null, strength = 0.4, maxOffset = 16) {
  if (!el) return () => {};
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  if (prefersReduced || isTouch) return () => {};

  const quickX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
  const quickY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

  const onMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    quickX(Math.max(-maxOffset, Math.min(maxOffset, relX * strength)));
    quickY(Math.max(-maxOffset, Math.min(maxOffset, relY * strength)));
  };
  const onLeave = () => {
    quickX(0);
    quickY(0);
  };

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);

  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}
