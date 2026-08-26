export type Project = {
  id: string;
  index: string;
  name: string;
  url: string;
  domain: string;
  year: string;
  discipline: string;
  category: string;
  status?: "current" | "case-study";
  statusLabel?: string;
  summary: string;
  contribution: string;
  tech: string[];
  /** 1440x900 screenshot in /public/projects — swap freely, aspect is fixed by CSS. */
  image: string;
  /** Optional pipeline shown as a flow strip in the expanded panel. */
  flow?: string[];
  /** The concrete problem, for projects with real case-study depth. */
  challenge?: string;
  /** The specific approach/trade-off taken to solve it. */
  approach?: string;
  /** Attributable, checkable outcomes — rendered as an "Impact" list. */
  metrics?: string[];
};

export const projects: Project[] = [
  {
    id: "finnulate",
    index: "01",
    name: "Finnulate",
    url: "https://finnulate.ai",
    domain: "finnulate.ai",
    year: "2026",
    discipline: "Full stack",
    category: "AI-native compliance platform",
    status: "current",
    statusLabel: "Current",
    summary:
      "A compliance operating system for regulated finance — regulatory change flows into obligations, obligations into owned tasks, tasks into evidence, evidence into audit-ready proof.",
    contribution:
      "Owning production modules end-to-end across MERN and Python: interfaces, service contracts, data models, and the cloud path they run on.",
    tech: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Python", "AWS", "Terraform"],
    image: "/projects/finnulate.jpg",
    flow: ["Regulatory change", "Obligations", "Tasks", "Evidence", "Audit-ready proof"],
    metrics: [
      "RAG semantic search over 1,000+ regulatory documents — Qdrant vector similarity",
      "Real-time collaborative evidence and task editing — Yjs + Hocuspocus, conflict-free",
      "Core API response times cut 500ms → 50ms under load via query optimization and caching",
      "Multi-tier services on Amazon EKS behind a segmented VPC, Terraform-provisioned — ~60% less manual environment setup",
    ],
  },
  {
    id: "auditee",
    index: "02",
    name: "Auditee AI",
    url: "https://auditee.ai",
    domain: "auditee.ai",
    year: "2026",
    discipline: "Backend architecture",
    category: "Audit intelligence",
    status: "case-study",
    statusLabel: "Case study",
    summary:
      "An audit platform built for continuous accountability — file ingestion through processing and analysis, out to a dashboard that surfaces results to its users.",
    contribution:
      "Architected the backend from the ground up: authentication, file processing, and the data pipelines feeding the results dashboard.",
    challenge:
      "Audit teams needed continuous accountability instead of periodic review — uploaded files had to move through processing and analysis to a results dashboard with no manual handoff in between, and no existing backend to build on.",
    approach:
      "Built the pipeline in three decoupled stages — OAuth-gated ingestion, a worker pool for processing and analysis, and a read-optimized store for the dashboard — so a new analysis stage could be added without touching ingestion or the dashboard layer.",
    tech: ["Next.js", "Node.js", "Express", "MongoDB", "OAuth", "Workers", "AWS"],
    image: "/projects/auditee.jpg",
    flow: ["Upload", "Process", "Analyze", "Audit", "Results"],
  },
  {
    id: "realm",
    index: "03",
    name: "Realm",
    url: "https://therealm.in",
    domain: "therealm.in",
    year: "2025",
    discipline: "Frontend engineering",
    category: "Luxury real estate · wealth",
    summary:
      "A concierge platform for high-value property portfolios — portfolio intelligence and risk monitoring wrapped in an experience that has to feel as considered as the assets it holds.",
    contribution:
      "Built the interactive frontend: scroll storytelling, GSAP motion systems, and responsive product surfaces that carry a luxury brand without costing performance.",
    tech: ["React", "Next.js", "TypeScript", "Tailwind", "GSAP"],
    image: "/projects/realm.jpg",
  },
  {
    id: "climaty",
    index: "04",
    name: "Climaty AI",
    url: "https://climaty.ai",
    domain: "climaty.ai",
    year: "2025",
    discipline: "Frontend engineering",
    category: "AdTech × sustainability",
    summary:
      "An agentic platform that measures campaign carbon, optimizes media performance, then offsets what's left — measure, optimize, offset, in one loop.",
    contribution:
      "Built motion-led product storytelling: scroll-driven sequences and live data surfaces wired to production APIs.",
    tech: ["React", "Next.js", "TypeScript", "GSAP", "REST APIs"],
    image: "/projects/climaty.jpg",
    flow: ["Measure", "Optimize", "Offset"],
    metrics: [
      "~30% faster page loads on JSON-API-driven components via animation and caching work",
    ],
  },
  {
    id: "kai",
    index: "05",
    name: "KAI",
    url: "https://kai.ken42.com",
    domain: "kai.ken42.com",
    year: "2025",
    discipline: "Frontend engineering",
    category: "AI × education",
    summary:
      "An agentic admissions and student-lifecycle assistant for institutions, answering across chat, voice and WhatsApp without dropping context between them.",
    contribution:
      "Shipped the animated product interfaces that explain agentic education AI while keeping interaction fast and accessible.",
    tech: ["React", "Next.js", "TypeScript", "Framer Motion", "GSAP"],
    image: "/projects/kai.jpg",
  },
];
