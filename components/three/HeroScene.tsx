"use client";

import dynamic from "next/dynamic";
import { useIsDesktop } from "@/lib/hooks/useMedia";

const TraceNode = dynamic(
  () => import("./TraceNode").then((m) => m.TraceNode),
  { ssr: false },
);

/**
 * Desktop only — code-split so the three.js/fiber bundle never ships to
 * visitors who wouldn't see it anyway (small screens, where this is hidden).
 */
export function HeroScene() {
  const desktop = useIsDesktop();
  if (!desktop) return null;
  return <TraceNode />;
}
