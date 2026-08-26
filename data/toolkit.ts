export type ToolGroup = {
  id: string;
  label: string;
  note: string;
  tech: string[];
};

export const toolkit: ToolGroup[] = [
  {
    id: "languages",
    label: "Languages",
    note: "Where the thinking happens",
    tech: ["JavaScript (ES6/ES7)", "TypeScript", "Python", "C#", "SQL"],
  },
  {
    id: "frontend",
    label: "Frontend",
    note: "Interface and motion",
    tech: [
      "React.js",
      "Next.js",
      "Redux",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
      "HTML5",
      "CSS3",
    ],
  },
  {
    id: "backend",
    label: "Backend & Data",
    note: "Contracts and storage",
    tech: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "Microservices",
      "MongoDB",
      "MySQL",
      "SQL Server",
      "Qdrant",
      "Yjs / Hocuspocus",
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    note: "Where it actually runs",
    tech: ["AWS", "Amazon EKS", "Terraform", "VPC Architecture", "Git", "CI/CD"],
  },
  {
    id: "practice",
    label: "Practice",
    note: "How it stays correct",
    tech: [
      "Performance Profiling",
      "Code Reviews",
      "Technical Documentation",
      "Agile / Scrum / Kanban",
    ],
  },
  {
    id: "ai",
    label: "AI",
    note: "Applied, not decorative",
    tech: ["RAG", "Vector Search", "AI-Assisted Development"],
  },
];
