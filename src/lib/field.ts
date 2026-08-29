// The field bus.
//
// One WebGL layer spans the whole page, and every section gets to say how
// much energy it wants running through it. That conversation happens here
// rather than through React state: the field reads these values once per
// animation frame, so a section changing the mood of the page costs zero
// re-renders.
//
// The energy curve *is* the site's dramatic structure. The hero is calm, the
// work sections run hot, the latency section drops the field to near-black
// so the number is the only thing left lit, and contact converges everything
// toward the middle of the screen.

/** The hero's energy. Calibrated so the shader's traffic thresholds land on
 *  exactly the values the hero shipped with — the opening frame is
 *  untouched, and every other level is expressed relative to it. */
export const HERO_ENERGY = 0.36;

export const ENERGY = {
  hero: HERO_ENERGY,
  work: 0.52,
  split: 0.44,
  products: 0.58,
  /** The blackout. Lights down, so 500ms → 50ms plays in a dark room. */
  blackout: 0.04,
  technical: 0.72,
  stack: 0.5,
  timeline: 0.28,
  /** Lit, but well under the engineering sections: this is the one screen
   *  where the field sits behind a single short message, and at full drive
   *  the gathered junctions read louder than the words in front of them. */
  contact: 0.62,
} as const;

/** Field colour ramp, kept next to the palette tokens in index.css.
 *  `deep` is the structure at rest, `hot` is the same structure carrying
 *  current. Both are linear-ish sRGB triples handed straight to the shader. */
export const ACCENT_DEEP: [number, number, number] = [0.44, 0.16, 0.05];
export const ACCENT_HOT: [number, number, number] = [1.0, 0.78, 0.46];

interface FieldState {
  /** Target values, written by sections. */
  energy: number;
  converge: number;
  /** 1 while the hero owns the viewport, easing to 0 past it. Gates the
   *  hero's original masking so its composition survives verbatim. */
  hero: number;
  /** Transient, decays every frame. Scroll motion injects current into the
   *  lattice — the visitor is the thing moving through the system. */
  surge: number;
  /** 0 → 1 over the first beat of the page. The field powers up *with* the
   *  headline instead of being fully lit before the first character has
   *  moved, so the opening frame shows the system starting rather than a
   *  finished background with type dropped on it. */
  intro: number;
  /** Document scroll progress, 0 → 1. Only the touch build reads it: with no
   *  pointer to follow, the lens rides the reader's position through the
   *  document instead of wandering on a sine wave that answers to nothing. */
  scroll: number;
}

const state: FieldState = {
  energy: HERO_ENERGY,
  converge: 0,
  hero: 1,
  surge: 0,
  intro: 0,
  scroll: 0,
};

export const fieldState = state;

export function setEnergy(v: number) {
  state.energy = v;
}

export function setConverge(v: number) {
  state.converge = v;
}

export function setHero(v: number) {
  state.hero = v;
}

export function setIntro(v: number) {
  state.intro = v;
}

/** Called from the smooth-scroll loop. Velocity is in px/frame; the cap
 *  keeps a flung scrollbar from whiting out the page. */
export function reportVelocity(velocity: number) {
  const v = Math.min(Math.abs(velocity) / 55, 1);
  if (v > state.surge) state.surge = v;
}

/** Called from the same loop. Document progress, clamped. */
export function reportScroll(progress: number) {
  state.scroll = Math.min(1, Math.max(0, progress));
}

/** Frame-rate independent decay of the surge, called by the field itself. */
export function decaySurge(dt: number) {
  state.surge *= Math.exp(-dt * 2.6);
}
