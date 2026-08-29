export interface ExperienceEntry {
  period: string;
  role: string;
  company: string;
  description: string[];
  highlights?: string[];
}

export const experience: ExperienceEntry[] = [
  {
    period: "JAN 2026 — PRESENT",
    role: "Junior Full Stack Engineer",
    company: "TurboStart",
    description: [
      "Own end-to-end delivery of five core modules on a fintech platform — API contracts, data models, backend implementation, deployment and production support.",
    ],
    highlights: [
      "90% reduction in core API latency",
      "Amazon EKS + VPC + Terraform",
      "CRDT-based real-time collaboration",
      "RAG semantic search over 1,000+ documents",
      "Unit and integration testing with Vitest",
    ],
  },
  {
    period: "JUL 2025 — DEC 2025",
    role: "UI/UX Developer",
    company: "TurboStart",
    description: [
      "Integrated internal and third-party APIs into production applications, owning request/response contracts and error handling alongside product and design.",
      "Built adaptive reusable UI components consuming JSON APIs, reducing page load time by 30% through caching and render optimization across devices.",
      "Developed animation-intensive production-grade interfaces with Next.js, Framer and GSAP under real performance budgets.",
    ],
  },
  {
    period: "MAY 2025 — JUL 2025",
    role: "UI/UX Developer Intern",
    company: "TurboStart",
    description: [
      "Built responsive web interfaces, landing pages and reusable UI components within an Agile/Scrum workflow, delivering production-ready features on schedule.",
    ],
  },
];
