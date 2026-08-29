import { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerFieldSection,
  settle,
  wipe,
  prefersReducedMotion,
} from "../lib/animations";
import { ENERGY } from "../lib/field";
import { PAD, SHELL } from "../lib/layout";
import SectionLabel from "./SectionLabel";
import GhostNumeral from "./GhostNumeral";

// ENGINEERING — three systems, running.
//
// These three panels were the biggest missed opportunity on the old page:
// static diagrams of a retrieval ranking, a CRDT merge and a deployment
// stack. A still picture of a mechanism is strictly worse than a sentence
// about it, and the convergent-state panel in particular drew three peer
// connectors that visibly failed to converge — the diagram was arguing
// against its own caption.
//
// Each panel is now the mechanism actually running: a query sweeping a corpus
// and the ranking resolving behind it, three peers typing into a replica that
// merges, and a stack lighting from code down to the metal on the scrollbar.
// They are the only interactive objects in this section, and they loop only
// while on screen.

/**
 * Instrument header for the three mechanisms.
 *
 * These used to be boxes: a border, a translucent surface and a blurred
 * backdrop, three of them stacked down the page in an alternating grid. The
 * rest of this site had spent considerable effort getting rid of exactly that
 * — "the bordered panels are gone: the words are the structure now" in the
 * split section, "a three-column grid of bordered cards… the most anonymous
 * block on the page" in the lattice — and then shipped it in the one section
 * whose whole job is to look engineered.
 *
 * The drawings inside were never the problem. So the chrome is gone and they
 * now sit directly on the field, on the same lattice as everything else, with
 * nothing but a ruled caption over them — the way the lattice section does it.
 */
function Panel({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-4 pb-3 mb-7 border-b border-[rgba(240,237,230,0.09)]">
        <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-[var(--color-ember)] whitespace-nowrap">
          {title}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-[rgba(240,237,230,0.14)] to-transparent" />
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--color-muted)] whitespace-nowrap">
          {meta}
        </span>
      </div>
      {children}
    </div>
  );
}

/** Pause a looping timeline whenever its panel is off screen. */
function useViewportLoop(
  ref: React.RefObject<HTMLElement | null>,
  build: () => gsap.core.Timeline | null
) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = ref.current;
    if (!root) return;
    let tl: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      tl = build();
      if (!tl) return;
      tl.pause();
      ScrollTrigger.create({
        trigger: root,
        start: "top 92%",
        end: "bottom 8%",
        onToggle: (self) => (self.isActive ? tl?.play() : tl?.pause()),
      });
    }, root);
    return () => {
      tl?.kill();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const RESULTS = [0.94, 0.87, 0.81, 0.73];
const DOCS = [64, 92, 74, 108, 82, 96];

function RetrievalPanel() {
  const ref = useRef<HTMLDivElement>(null);

  useViewportLoop(ref, () => {
    const root = ref.current;
    if (!root) return null;
    const scan = root.querySelector<HTMLElement>(".scan");
    const docs = root.querySelectorAll<HTMLElement>(".doc");
    const bars = root.querySelectorAll<HTMLElement>(".bar");
    const scores = root.querySelectorAll<HTMLElement>(".score");

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

    // A query sweeping the corpus.
    tl.fromTo(scan, { yPercent: -10, opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
      .to(scan, { yPercent: 560, duration: 1.5, ease: "power1.inOut" }, 0)
      .to(scan, { opacity: 0, duration: 0.25 }, 1.4)
      .fromTo(
        docs,
        { borderColor: "rgba(240,237,230,0.16)" },
        {
          borderColor: "var(--color-accent)",
          duration: 0.18,
          stagger: 0.24,
          yoyo: true,
          repeat: 1,
        },
        0.14
      );

    // The ranking resolving behind it.
    RESULTS.forEach((value, i) => {
      const proxy = { v: 0 };
      tl.fromTo(
        bars[i],
        { scaleX: 0 },
        { scaleX: value, duration: 0.55, ease: "power3.out" },
        0.95 + i * 0.11
      ).to(
        proxy,
        {
          v: value,
          duration: 0.55,
          ease: "power3.out",
          onUpdate: () => {
            scores[i].textContent = proxy.v.toFixed(2);
          },
        },
        0.95 + i * 0.11
      );
    });

    // Reset for the next query.
    tl.to(bars, { scaleX: 0, duration: 0.3, ease: "power2.in" }, "+=1.4").to(
      scores,
      {
        duration: 0.3,
        onStart: () => scores.forEach((s) => (s.textContent = "0.00")),
      },
      "<"
    );

    return tl;
  });

  return (
    <div ref={ref}>
      <Panel title="Vector space" meta="Qdrant">
        <div className="grid grid-cols-[1fr_auto_1.15fr] gap-4 md:gap-6 items-center">
          {/* Corpus */}
          <div className="relative flex flex-col gap-2.5 py-1">
            {DOCS.map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="doc block w-2 h-2 border border-[rgba(240,237,230,0.16)]" />
                <span
                  className="block h-px bg-[rgba(240,237,230,0.12)]"
                  style={{ width: w }}
                />
              </div>
            ))}
            {/* The query itself. */}
            <span
              className="scan absolute left-0 right-0 top-0 h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
                boxShadow: "0 0 10px rgba(255,157,60,0.5)",
              }}
            />
          </div>

          <span className="font-mono text-[10px] text-[var(--color-muted)]">→</span>

          {/* Ranking */}
          <div className="flex flex-col gap-2.5">
            {RESULTS.map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="score font-mono text-[9px] text-[var(--color-accent)] w-8 tabular-nums">
                  0.00
                </span>
                <span className="relative block h-px flex-1 bg-[rgba(240,237,230,0.08)]">
                  <span className="bar absolute inset-y-0 left-0 w-full origin-left block bg-[var(--color-accent)]" />
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[rgba(240,237,230,0.07)]">
          <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--color-muted)]">
            1,000+ DOCUMENTS
          </span>
          <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--color-muted)]">
            TOP-K 4
          </span>
        </div>
      </Panel>
    </div>
  );
}

const PEERS = [
  { id: "A", text: "ship " },
  { id: "B", text: "it " },
  { id: "C", text: "together" },
];
const MERGED = "ship it together";

function ConvergencePanel() {
  const ref = useRef<HTMLDivElement>(null);

  useViewportLoop(ref, () => {
    const root = ref.current;
    if (!root) return null;
    const buffers = root.querySelectorAll<HTMLElement>(".buffer");
    const flows = root.querySelectorAll<SVGPathElement>(".flow");
    const merged = root.querySelector<HTMLElement>(".merged");
    const shared = root.querySelector<HTMLElement>(".shared");

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6 });
    const mergeProxy = { n: 0 };

    // Three peers typing concurrently into their own replica.
    PEERS.forEach((peer, i) => {
      const proxy = { n: 0 };
      tl.to(
        proxy,
        {
          n: peer.text.length,
          duration: 0.55,
          ease: "none",
          onUpdate: () => {
            buffers[i].textContent = peer.text.slice(0, Math.ceil(proxy.n));
          },
        },
        i * 0.22
      );
    });

    // Their edits travelling to the shared replica along wires that actually
    // arrive at a junction — the old diagram's connectors stopped in mid-air.
    tl.fromTo(
      flows,
      { strokeDashoffset: 120 },
      { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", stagger: 0.08 },
      0.9
    )
      .fromTo(
        shared,
        { borderColor: "rgba(255,157,60,0.25)" },
        { borderColor: "var(--color-accent)", duration: 0.3 },
        1.45
      )
      .to(
        mergeProxy,
        {
          n: MERGED.length,
          duration: 0.5,
          ease: "none",
          onUpdate: () => {
            if (merged) merged.textContent = MERGED.slice(0, Math.ceil(mergeProxy.n));
          },
        },
        1.5
      )
      // Convergence: every replica now reads the same thing.
      .add(() => {
        buffers.forEach((b) => (b.textContent = MERGED));
      }, 2.15)
      .to(buffers, { color: "var(--color-accent)", duration: 0.3 }, 2.15)
      .add(() => {
        mergeProxy.n = 0;
        buffers.forEach((b) => {
          b.textContent = "";
          b.style.color = "";
        });
        if (merged) merged.textContent = "";
      }, "+=1.5");

    return tl;
  });

  return (
    <div ref={ref}>
      <Panel title="Convergent state" meta="Yjs">
        <div className="grid grid-cols-3 gap-3">
          {PEERS.map((p) => (
            <div key={p.id} className="flex flex-col items-center gap-3">
              <span className="w-9 h-9 border border-[rgba(240,237,230,0.16)] flex items-center justify-center font-mono text-[9px] text-[var(--color-muted)]">
                {p.id}
              </span>
              <span className="buffer block h-4 w-full text-center font-mono text-[9px] text-[var(--color-fg)] truncate transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Wires that converge on a junction and carry the merge down into the
            shared replica. */}
        <svg viewBox="0 0 300 54" className="w-full h-[54px]" aria-hidden="true">
          <g fill="none" strokeWidth="1" stroke="rgba(240,237,230,0.14)">
            <path d="M50 0 L50 22 L150 22" />
            <path d="M150 0 L150 22" />
            <path d="M250 0 L250 22 L150 22" />
            <path d="M150 22 L150 54" />
          </g>
          <g
            fill="none"
            strokeWidth="1"
            stroke="var(--color-accent)"
            strokeDasharray="120"
          >
            <path className="flow" d="M50 0 L50 22 L150 22 L150 54" />
            <path className="flow" d="M150 0 L150 54" />
            <path className="flow" d="M250 0 L250 22 L150 22 L150 54" />
          </g>
          <circle cx="150" cy="22" r="2" fill="var(--color-accent)" />
        </svg>

        <div className="shared border px-5 py-3 flex items-center justify-between gap-4" style={{ borderColor: "rgba(255,157,60,0.25)" }}>
          <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[var(--color-muted)]">
            Shared state
          </span>
          <span className="merged font-mono text-[10px] text-[var(--color-accent)] truncate" />
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[rgba(240,237,230,0.07)]">
          <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--color-muted)]">CRDT</span>
          <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--color-muted)]">
            HOCUSPOCUS
          </span>
        </div>
      </Panel>
    </div>
  );
}

const LAYERS = ["APPLICATION", "SERVICES", "EKS", "VPC", "AWS"];

function StackPanel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = ref.current?.querySelectorAll<HTMLElement>(".layer");
      const current = ref.current?.querySelector<HTMLElement>(".current") ?? null;
      if (!rows?.length || !current) return;

      if (prefersReducedMotion()) {
        gsap.set(rows, { opacity: 1, borderColor: "rgba(240,237,230,0.16)" });
        return;
      }

      // Scrubbed rather than looped: this panel is about descent, so the
      // scrollbar is the natural thing to drive it.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 78%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });

      tl.fromTo(
        rows,
        { xPercent: -3, opacity: 0.25 },
        { xPercent: 0, opacity: 1, duration: 0.4, stagger: 0.22, ease: "power2.out" },
        0
      ).fromTo(current, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 1.3 }, 0);
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref}>
      <Panel title="Production stack" meta="Terraform">
        <div className="relative flex flex-col gap-1.5">
          {/* Current descending from code to metal. */}
          <span
            className="current absolute left-[-14px] top-0 bottom-0 w-px origin-top"
            style={{
              background: "linear-gradient(to bottom, var(--color-accent), rgba(255,157,60,0.1))",
            }}
          />
          {LAYERS.map((layer, i) => (
            <div
              key={layer}
              className="layer py-3 px-4 border border-[rgba(240,237,230,0.1)] text-center"
              style={{
                background: `rgba(240,237,230,${0.012 + i * 0.011})`,
                marginLeft: `${i * 14}px`,
              }}
            >
              <span
                className="font-mono text-[9px] tracking-[0.26em] uppercase"
                style={{
                  color:
                    i === 0 ? "var(--color-fg)" : i === LAYERS.length - 1 ? "var(--color-accent)" : "var(--color-muted)",
                }}
              >
                {layer}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-[rgba(240,237,230,0.07)]">
          <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--color-muted)]">
            ~60% LESS MANUAL CONFIGURATION
          </span>
        </div>
      </Panel>
    </div>
  );
}

function Feature({
  index,
  title,
  description,
  tech,
  visual,
  flip,
}: {
  index: string;
  title: string;
  description: string;
  tech: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const visRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      wipe(titleRef.current);
      settle(copyRef.current, 0.1);
      settle(visRef.current, 0.16);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 md:gap-16 lg:gap-24 items-center py-16 md:py-24 border-t border-[rgba(240,237,230,0.07)]"
    >
      <div className={flip ? "md:order-2" : ""} ref={copyRef}>
        <span className="font-mono text-[9px] text-[var(--color-ember)] tracking-[0.3em] uppercase block mb-6">
          {index}
        </span>
        <h3
          ref={titleRef}
          className="display display-etched mb-6"
          style={{ fontSize: "clamp(28px, 3.6vw, 52px)", lineHeight: 0.92 }}
        >
          {title}
        </h3>
        <p className="font-body text-[var(--color-muted)] text-sm leading-relaxed mb-8 max-w-md">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[9px] tracking-[0.2em] text-[var(--color-ember)] border border-[rgba(204,106,48,0.32)] px-2.5 py-1 uppercase"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className={flip ? "md:order-1" : ""} ref={visRef}>
        {visual}
      </div>
    </div>
  );
}

export default function TechnicalFeatures() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cleanup = registerFieldSection(sectionRef.current, ENERGY.technical);
    return cleanup;
  }, []);

  return (
    <section ref={sectionRef} id="systems" data-section className="relative py-8 md:py-16">
      <GhostNumeral value="06" place="tl" />
      <div className={`relative ${PAD} ${SHELL}`}>
        <SectionLabel index="06" label="Systems in production" />

        <div className="mt-12">
          <Feature
            index="06 / 01 — RAG & Semantic Search"
            title="Searching 1,000+ documents"
            description="Built a RAG-based semantic search system using vector similarity with Qdrant, returning ranked matches across more than 1,000 documents to improve retrieval relevance."
            tech={["RAG", "QDRANT", "VECTOR SEARCH"]}
            visual={<RetrievalPanel />}
          />
          <Feature
            index="06 / 02 — Real-Time Collaboration"
            title="Real-time, multi-user editing"
            description="Implemented real-time multi-user collaborative editing using CRDT-backed replicated state with Yjs and Hocuspocus, enabling conflict-free convergence across concurrent sessions."
            tech={["YJS", "HOCUSPOCUS", "CRDT"]}
            visual={<ConvergencePanel />}
            flip
          />
          <Feature
            index="06 / 03 — Infrastructure"
            title="From code to production"
            description="Deployed distributed, multi-tier services to Amazon EKS behind a segmented VPC and codified infrastructure using Terraform, reducing manual configuration by approximately 60%."
            tech={["AWS", "EKS", "KUBERNETES", "TERRAFORM", "VPC", "CI/CD"]}
            visual={<StackPanel />}
          />
        </div>
      </div>
    </section>
  );
}
