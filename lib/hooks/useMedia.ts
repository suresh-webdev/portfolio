"use client";

import { useSyncExternalStore } from "react";

function makeStore(query: string) {
  return {
    subscribe(onChange: () => void) {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    get() {
      return window.matchMedia(query).matches;
    },
  };
}

/** SSR-safe media query. `serverValue` is what renders before hydration. */
export function useMediaQuery(query: string, serverValue = false) {
  const store = makeStore(query);
  return useSyncExternalStore(store.subscribe, store.get, () => serverValue);
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

/** Fine pointer + room to move: gates cursor, magnets, hover-preview, pinning. */
export function usePointerFine() {
  return useMediaQuery("(pointer: fine) and (min-width: 1024px)", false);
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)", false);
}
