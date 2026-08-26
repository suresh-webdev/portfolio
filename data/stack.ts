export type StackLayer = {
  id: string;
  index: string;
  name: string;
  span: string;
  claim: string;
  detail: string;
  tech: string[];
};

/** The vertical slice — read top-down as a request descending the stack. */
export const stackLayers: StackLayer[] = [
  {
    id: "interface",
    index: "L1",
    name: "Interface",
    span: "client",
    claim: "Interfaces that hold up under motion.",
    detail:
      "Typed React and Next.js surfaces with animation systems that stay at 60fps — not decoration bolted on after the fact, but motion designed into the component layer from the start.",
    tech: ["React", "Next.js", "TypeScript", "Redux", "Tailwind", "GSAP", "Framer Motion"],
  },
  {
    id: "api",
    index: "L2",
    name: "API",
    span: "edge",
    claim: "Contracts that don't leak.",
    detail:
      "REST surfaces with auth, validation and error shapes decided before the first endpoint ships. Query optimization and caching took core response times from 500ms to 50ms under load.",
    tech: ["Node.js", "Express", "REST", "OAuth", "Caching"],
  },
  {
    id: "services",
    index: "L3",
    name: "Services",
    span: "compute",
    claim: "Work that happens off the request path.",
    detail:
      "Microservices and Python workers for file processing, document pipelines, and AI-assisted retrieval — plus conflict-free real-time collaboration over Yjs and Hocuspocus.",
    tech: ["Microservices", "Python", "Workers", "Yjs", "Hocuspocus", "RAG"],
  },
  {
    id: "data",
    index: "L4",
    name: "Data",
    span: "storage",
    claim: "Stores chosen for the query, not the résumé.",
    detail:
      "Document, relational and vector stores matched to real access patterns — including semantic search across 1,000+ documents with Qdrant vector similarity.",
    tech: ["MongoDB", "MySQL", "SQL Server", "Qdrant", "Vector Search"],
  },
  {
    id: "infra",
    index: "L5",
    name: "Infrastructure",
    span: "cloud",
    claim: "Deployment as part of the feature.",
    detail:
      "Distributed multi-tier services on Amazon EKS behind a segmented VPC, provisioned with Terraform — 60% less manual configuration, monitored across dev, test and production.",
    tech: ["AWS", "Amazon EKS", "Terraform", "VPC", "CI/CD", "Vitest"],
  },
];
