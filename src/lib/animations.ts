import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setConverge, setEnergy, setHero } from "./field";

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

// The reduced-motion block in index.css only neutralises CSS animations and
// transitions — GSAP drives everything from JS, so without this every scroll
// reveal on the page still animated for visitors who asked us not to.
// Collapsing the global timeline lets each tween land on its final values
// immediately, so content still ends up styled correctly, just not in motion.
// Scrub-linked tweens read their progress straight from ScrollTrigger and are
// unaffected here, so those are gated at their call sites instead.
if (prefersReducedMotion()) {
  gsap.globalTimeline.timeScale(1000);
}

export { gsap, ScrollTrigger };

// ── Trigger grammar ──────────────────────────────────────────────────────
// Everything used to fire at `top 95%` — by which point the element is
// already on screen, so the reveal read as a slow page rather than as
// choreography. Motion now starts as the element crosses into the lower
// third and finishes as it settles into the reading zone. Entrances also no
// longer reverse: content vanishing on the way back up felt unstable.
export const ENTER = "top 82%";

const once = (trigger: Element, start = ENTER): ScrollTrigger.Vars => ({
  trigger,
  start,
  once: true,
});

// ── Typography as material ───────────────────────────────────────────────

/**
 * Split an element into per-character spans, grouped by word.
 *
 * The previous version split straight to characters, which let the browser
 * break a line *inside* a word — "LET'S BUILD" could wrap as "LET'S BUIL /
 * D" at display sizes. Words are now their own inline-block boxes, so
 * breaking still happens at spaces, and each word box clips its own line so
 * characters can rise out of a mask without a wrapper div per headline.
 */
export function splitWords(element: Element | null): HTMLSpanElement[] {
  if (!element) return [];
  const source = element.textContent || "";
  const words = source.split(/(\s+)/);
  element.textContent = "";

  const chars: HTMLSpanElement[] = [];

  words.forEach((word) => {
    if (!word) return;
    if (/^\s+$/.test(word)) {
      element.appendChild(document.createTextNode(" "));
      return;
    }
    const box = document.createElement("span");
    box.className = "sw";
    for (const ch of word) {
      const span = document.createElement("span");
      span.className = "sc";
      span.textContent = ch;
      box.appendChild(span);
      chars.push(span);
    }
    element.appendChild(box);
  });

  return chars;
}

// ── Weight ───────────────────────────────────────────────────────────────
// Every entrance on this page used to run at roughly the same duration and
// stagger, so a Feature subhead arrived with exactly as much ceremony as the
// name in the hero — and a page where everything is emphasised has no
// emphasis at all. Arrivals now come in three weights, and the tier is
// chosen by how important the thing actually is:
//
//   signature — the three moments that carry the page. Slow, heavy, split to
//               characters. Hero name, the "I build both" claim, the closing
//               headline. Nothing else gets this.
//   primary   — section headlines. A beam wipe: fast, wide, unsplit.
//   quiet     — supporting copy, lists, chips. Felt rather than watched.
//
export const WEIGHT = {
  signature: { duration: 1.15, stagger: 0.042 },
  normal: { duration: 0.9, stagger: 0.028 },
} as const;

/**
 * Characters rise out of their own mask. The signature headline entrance,
 * deliberately rationed — see WEIGHT above. Reserved for three headlines
 * site-wide; everything else uses `wipe`.
 */
export function charRise(
  chars: HTMLSpanElement[],
  opts: {
    delay?: number;
    stagger?: number;
    duration?: number;
    weight?: keyof typeof WEIGHT;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  if (!chars.length) return;
  const tier = WEIGHT[opts.weight ?? "normal"];
  return gsap.fromTo(
    chars,
    { yPercent: 118 },
    {
      yPercent: 0,
      duration: opts.duration ?? tier.duration,
      stagger: opts.stagger ?? tier.stagger,
      ease: "expo.out",
      delay: opts.delay ?? 0,
      scrollTrigger: opts.scrollTrigger,
    }
  );
}

/**
 * A headline arriving as a beam passing across it — the same left-to-right
 * gesture the conduit and the field's traffic make, at headline scale.
 *
 * This is now the default for section headlines. They used to be split to
 * characters like the hero, which meant eight headlines shared the one
 * entrance that should have belonged to two or three; the wipe is lighter,
 * quicker and leaves the character rise meaning something.
 */
export function wipe(
  element: Element | null,
  start = ENTER,
  /**
   * Trigger to measure against, when it must not be the element itself.
   * Inside a pinned stage the element's own position stops tracking the
   * scrollbar the moment the pin engages, so a headline in there has to be
   * fired from the unpinned section wrapper instead.
   */
  trigger?: Element | null
) {
  if (!element) return;
  if (prefersReducedMotion()) return;
  gsap.fromTo(
    element,
    { clipPath: "inset(0 100% 0 0)", xPercent: -1.5 },
    {
      clipPath: "inset(0 0% 0 0)",
      xPercent: 0,
      duration: 1.05,
      ease: "expo.out",
      scrollTrigger: once(trigger ?? element, start),
    }
  );
}

/**
 * The quiet default. Deliberately small: this is the entrance for supporting
 * copy, and it should be felt rather than watched. The loud entrances are
 * spent on the two or three moments per page that earn them.
 */
export function settle(element: Element | null, delay = 0, start = ENTER) {
  if (!element) return;
  gsap.fromTo(
    element,
    { y: 22, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: "power3.out",
      delay,
      scrollTrigger: once(element, start),
    }
  );
}

/** A group arriving as one gesture rather than as n separate reveals. */
export function settleGroup(
  elements: ArrayLike<Element>,
  opts: { stagger?: number; from?: "start" | "center" | "edges"; y?: number; start?: string } = {}
) {
  const list = Array.from(elements);
  if (!list.length) return;
  gsap.fromTo(
    list,
    { y: opts.y ?? 26, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: { each: opts.stagger ?? 0.055, from: opts.from ?? "start" },
      scrollTrigger: once(list[0], opts.start ?? ENTER),
    }
  );
}

/** A hairline drawing itself. Used where a rule separates two ideas. */
export function drawRule(element: Element | null, start = ENTER) {
  if (!element) return;
  gsap.fromTo(
    element,
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: once(element, start),
    }
  );
}

// ── Scroll-linked movement ───────────────────────────────────────────────
// Scrub values are deliberately short. Lenis already carries a tail; a long
// scrub on top of it reads as lag, not luxury.

export function parallaxY(element: Element | null, distance: number, scrub = 0.7) {
  if (!element || prefersReducedMotion()) return;
  gsap.fromTo(
    element,
    { yPercent: -distance },
    {
      yPercent: distance,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement ?? element,
        start: "top bottom",
        end: "bottom top",
        scrub,
      },
    }
  );
}

/** Horizontal drift, used for oversized type that should read as passing by. */
export function driftX(element: Element | null, from: number, to: number, scrub = 0.8) {
  if (!element || prefersReducedMotion()) return;
  gsap.fromTo(
    element,
    { xPercent: from },
    {
      xPercent: to,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement ?? element,
        start: "top bottom",
        end: "bottom top",
        scrub,
      },
    }
  );
}

// ── The field ────────────────────────────────────────────────────────────

/**
 * Hand a section's energy level to the field while it owns the viewport.
 * This is how the page gets a dramatic arc instead of a constant mood: the
 * shader behind everything runs calm, hot, dark or convergent depending on
 * what the visitor is currently reading.
 */
export function registerFieldSection(
  element: Element | null,
  energy: number,
  opts: { converge?: number; hero?: number } = {}
) {
  if (!element) return () => {};
  const apply = () => {
    setEnergy(energy);
    setConverge(opts.converge ?? 0);
    setHero(opts.hero ?? 0);
  };
  const st = ScrollTrigger.create({
    trigger: element,
    start: "top 55%",
    end: "bottom 45%",
    onEnter: apply,
    onEnterBack: apply,
  });
  return () => st.kill();
}

// ── Micro-interaction ────────────────────────────────────────────────────

// Purposeful magnetic pull for primary CTAs — nudges the element toward the
// cursor within a capped radius, snapping back on leave. No-op on touch
// devices and when the visitor prefers reduced motion. Used on exactly two
// elements site-wide; magnetism everywhere makes a page feel slippery.
export function attachMagnetic(el: HTMLElement | null, strength = 0.4, maxOffset = 16) {
  if (!el) return () => {};
  if (prefersReducedMotion() || isTouch()) return () => {};

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
