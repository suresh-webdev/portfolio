import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/animations";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [isTouch] = useState(() => window.matchMedia("(hover: none)").matches);

  useEffect(() => {
    if (isTouch) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener("mousemove", move);

    const ticker = gsap.ticker.add(() => {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      gsap.set(cursor, { x: curX - 20, y: curY - 20 });
      gsap.set(dot, { x: mouseX - 3, y: mouseY - 3 });
    });

    const onEnterProject = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const lbl = target.dataset.cursorLabel || "VIEW →";
      setLabel(lbl);
      setExpanded(true);
    };
    const onLeaveProject = () => {
      setExpanded(false);
      setLabel("");
    };

    const projectEls = document.querySelectorAll("[data-cursor]");
    projectEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnterProject);
      el.addEventListener("mouseleave", onLeaveProject);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      gsap.ticker.remove(ticker);
      projectEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterProject);
        el.removeEventListener("mouseleave", onLeaveProject);
      });
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ width: 40, height: 40 }}
      >
        <div
          className="w-full h-full rounded-full border border-[#f0ede6] flex items-center justify-center transition-all duration-300"
          style={{
            transform: expanded ? "scale(3)" : "scale(1)",
            background: expanded ? "rgba(56, 189, 248,0.15)" : "transparent",
            borderColor: expanded ? "#38bdf8" : "#f0ede6",
          }}
        >
          {expanded && (
            <span
              className="text-[5px] font-mono text-[#38bdf8] tracking-widest font-medium whitespace-nowrap"
              style={{ fontSize: "4.5px" }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-[6px] h-[6px] rounded-full bg-[#38bdf8]"
      />
    </>
  );
}
