"use client";

import { useEffect, useRef, useState } from "react";
import { usePointerFine, useReducedMotion } from "@/lib/hooks/useMedia";

type CursorState = "default" | "link" | "view";

/**
 * A single ring that reshapes by context — collapses to a dot over links,
 * opens into a labelled lens over media. Difference blend so it reads on
 * both the ink and bone regions without any per-section logic.
 */
export function Cursor() {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [caption, setCaption] = useState("");

  const enabled = fine && !reduced;

  useEffect(() => {
    document.body.dataset.cursor = enabled ? "custom" : "native";
    return () => {
      delete document.body.dataset.cursor;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let visible = false;

    const render = () => {
      // Trailing lerp — the ring follows rather than sticks to the pointer.
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      root.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;

      if (!visible) {
        visible = true;
        root.style.opacity = "1";
      }

      const target = e.target as HTMLElement | null;
      const hit = target?.closest<HTMLElement>("[data-cursor]");
      const mode = hit?.dataset.cursor;

      if (mode === "view") {
        setState("view");
        setCaption(hit?.dataset.cursorLabel ?? "View");
      } else if (
        mode === "link" ||
        target?.closest("a, button, [role='button']")
      ) {
        setState("link");
        setCaption("");
      } else {
        setState("default");
        setCaption("");
      }
    };

    const onLeave = () => {
      visible = false;
      root.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className="cursor-root"
      data-state={state}
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      <div className="cursor-ring">
        <span className="cursor-caption">{caption}</span>
      </div>
    </div>
  );
}
