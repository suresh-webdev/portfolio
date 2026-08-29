import { useEffect, useRef } from "react";
import { gsap } from "../lib/animations";

function FeatureBlock({
  index,
  title,
  description,
  tech,
  visual,
}: {
  index: string;
  title: string;
  description: string;
  tech: string[];
  visual: React.ReactNode;
}) {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none reverse" },
      }
    );
  }, []);

  return (
    <div
      ref={blockRef}
      className="border-t border-[rgba(240,237,230,0.1)] py-16 grid md:grid-cols-2 gap-12 items-center"
    >
      <div>
        <span className="font-mono text-[9px] text-[#38bdf8] tracking-[0.3em] block mb-6">{index}</span>
        <h3
          className="font-display font-black uppercase text-[#f0ede6] mb-6"
          style={{ fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 0.95, letterSpacing: "-0.01em" }}
        >
          {title}
        </h3>
        <p className="font-body text-[#6b6860] text-sm leading-relaxed mb-8 max-w-md">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[9px] tracking-[0.2em] text-[#38bdf8] border border-[rgba(56, 189, 248,0.25)] px-2.5 py-1 uppercase"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div>{visual}</div>
    </div>
  );
}

function RAGVisual() {
  return (
    <div className="flex flex-col gap-3 p-8 border border-[rgba(240,237,230,0.06)]">
      <span className="font-mono text-[9px] text-[#6b6860] tracking-widest uppercase mb-2">Vector Space</span>
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 border border-[rgba(240,237,230,0.2)]" />
              <div
                className="h-px bg-[rgba(240,237,230,0.1)]"
                style={{ width: `${40 + i * 15}px` }}
              />
            </div>
          ))}
        </div>
        <span className="font-mono text-[#6b6860] text-[10px]">→</span>
        <div className="flex flex-col gap-1">
          {["0.94", "0.87", "0.81", "0.73"].map((score, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-[#38bdf8]">{score}</span>
              <div
                className="h-px bg-[#38bdf8]"
                style={{ width: `${parseFloat(score) * 60}px`, opacity: parseFloat(score) }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 border-t border-[rgba(240,237,230,0.06)] pt-3">
        <span className="font-mono text-[8px] text-[#6b6860] tracking-widest">1,000+ DOCUMENTS</span>
        <span className="font-mono text-[8px] text-[#6b6860] tracking-widest">QDRANT</span>
      </div>
    </div>
  );
}

function CRDTVisual() {
  return (
    <div className="p-8 border border-[rgba(240,237,230,0.06)]">
      <span className="font-mono text-[9px] text-[#6b6860] tracking-widest uppercase block mb-6">
        Convergent State
      </span>
      <div className="flex items-center justify-between gap-4">
        {["USER A", "USER B", "USER C"].map((user, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border border-[rgba(240,237,230,0.15)] flex items-center justify-center">
              <span className="font-mono text-[8px] text-[#6b6860]">{String.fromCharCode(65 + i)}</span>
            </div>
            <div className="w-px h-6 bg-[rgba(240,237,230,0.1)]" />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <div className="border border-[#38bdf8] px-6 py-3">
          <span className="font-mono text-[9px] text-[#38bdf8] tracking-widest">SHARED STATE</span>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <span className="font-mono text-[8px] text-[#6b6860]">YJS</span>
        <span className="font-mono text-[8px] text-[#6b6860]">CRDT</span>
        <span className="font-mono text-[8px] text-[#6b6860]">HOCUSPOCUS</span>
      </div>
    </div>
  );
}

function InfraVisual() {
  const layers = ["APPLICATION", "SERVICES", "EKS", "VPC", "AWS"];

  return (
    <div className="p-8 border border-[rgba(240,237,230,0.06)]">
      <span className="font-mono text-[9px] text-[#6b6860] tracking-widest uppercase block mb-6">
        Production Stack
      </span>
      <div className="flex flex-col gap-1">
        {layers.map((layer, i) => (
          <div key={layer} className="flex items-center gap-4">
            <div
              className="py-3 px-4 border border-[rgba(240,237,230,0.1)] flex-1 text-center"
              style={{
                background: `rgba(240,237,230,${0.01 + i * 0.01})`,
                marginLeft: `${i * 12}px`,
              }}
            >
              <span
                className="font-mono text-[9px] tracking-[0.25em] uppercase"
                style={{ color: i === 0 ? "#f0ede6" : i === 4 ? "#38bdf8" : "#6b6860" }}
              >
                {layer}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-[rgba(240,237,230,0.06)] pt-3">
        <span className="font-mono text-[8px] text-[#6b6860] tracking-widest">~60% LESS MANUAL CONFIGURATION</span>
      </div>
    </div>
  );
}

export default function TechnicalFeatures() {
  return (
    <section className="py-16 px-8 md:px-12 border-t border-[rgba(240,237,230,0.06)]">
      <div className="max-w-7xl mx-auto">
        <FeatureBlock
          index="06 / RAG & Semantic Search"
          title="SEARCHING THROUGH 1,000+ DOCUMENTS"
          description="Built a RAG-based semantic search system using vector similarity with Qdrant, returning ranked matches across more than 1,000 documents to improve retrieval relevance."
          tech={["RAG", "QDRANT", "VECTOR SEARCH"]}
          visual={<RAGVisual />}
        />

        <FeatureBlock
          index="07 / Real-Time Collaboration"
          title="REAL-TIME, MULTI-USER COLLABORATION"
          description="Implemented real-time multi-user collaborative editing using CRDT-backed replicated state with Yjs and Hocuspocus, enabling conflict-free convergence across concurrent sessions."
          tech={["YJS", "HOCUSPOCUS", "CRDT"]}
          visual={<CRDTVisual />}
        />

        <FeatureBlock
          index="08 / Infrastructure"
          title="FROM CODE TO PRODUCTION"
          description="Deployed distributed, multi-tier services to Amazon EKS behind a segmented VPC and codified infrastructure using Terraform, reducing manual configuration by approximately 60%."
          tech={["AWS", "EKS", "KUBERNETES", "TERRAFORM", "VPC", "CI/CD"]}
          visual={<InfraVisual />}
        />
      </div>
    </section>
  );
}
