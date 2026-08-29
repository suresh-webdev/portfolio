export interface SkillGroup {
  category: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    category: "LANGUAGES",
    items: ["JavaScript (ES6+)", "Python", "C#", "SQL"],
  },
  {
    category: "BACKEND & APIS",
    items: [
      "Node.js",
      "Express.js",
      "REST API Design",
      "Microservices",
      "Authentication & Authorization",
      "Third-party & Internal API Integration",
      "Background Jobs",
      "Yjs / Hocuspocus",
    ],
  },
  {
    category: "RELIABILITY & PERFORMANCE",
    items: [
      "Latency Optimization",
      "Query Optimization",
      "Indexing",
      "Caching",
      "Performance Profiling",
      "Monitoring",
      "Production Support",
    ],
  },
  {
    category: "DATABASES",
    items: ["MongoDB", "MySQL", "SQL Server", "Relational Schema Design", "Qdrant"],
  },
  {
    category: "CLOUD & INFRASTRUCTURE",
    items: ["AWS", "Amazon EKS", "Kubernetes", "Terraform", "VPC Architecture", "CI/CD", "Git"],
  },
  {
    category: "FRONTEND",
    items: [
      "React.js",
      "Redux",
      "Next.js",
      "Reusable Component Libraries",
      "DOM Manipulation",
      "GSAP",
      "Tailwind CSS",
    ],
  },
  {
    category: "TESTING",
    items: ["Vitest", "Unit Testing", "Integration Testing", "Functional Testing"],
  },
];
