export type ExperienceItem = {
  id: string;
  from: string;
  to: string;
  duration: string;
  company: string;
  role: string;
  stack: string;
  current?: boolean;
  points: string[];
};

/** Reverse-chronological; rendered newest-first. */
export const experience: ExperienceItem[] = [
  {
    id: "fullstack",
    from: "Jan 2026",
    to: "Present",
    duration: "Current",
    company: "TurboStart",
    role: "Junior Full Stack Engineer",
    stack: "MERN + Python",
    current: true,
    points: [
      "End-to-end delivery of 5 core modules for a fintech platform — UI, architecture, backend, deployment.",
      "Architected the Auditee AI backend from scratch: auth, file processing, data pipelines.",
      "RAG semantic search over 1,000+ documents with Qdrant vector similarity.",
      "Real-time multi-user collaborative editor with Yjs + Hocuspocus.",
      "Multi-tier services on Amazon EKS behind a segmented VPC, provisioned with Terraform.",
    ],
  },
  {
    id: "uiux-dev",
    from: "Jul 2025",
    to: "Dec 2025",
    duration: "6 months",
    company: "TurboStart",
    role: "UI/UX Developer",
    stack: "Next.js · GSAP · Framer",
    points: [
      "Animation-intensive, production-grade interfaces in Next.js, Framer and GSAP.",
      "Adaptive components consuming JSON APIs — 30% faster page loads via animation and caching work.",
      "Integrated internal and third-party APIs, working with product and design in an Agile loop.",
    ],
  },
  {
    id: "intern",
    from: "May 2025",
    to: "Jul 2025",
    duration: "3 months",
    company: "TurboStart",
    role: "UI/UX Developer Intern",
    stack: "JavaScript · CSS",
    points: [
      "Responsive web interfaces and landing pages across devices.",
      "Interactive animations and reusable UI components inside an Agile/Scrum workflow.",
    ],
  },
];
