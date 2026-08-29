export type ProjectType = "UI" | "PRODUCT" | "ENGINEERING" | "EXPERIMENT";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  url?: string;
  image?: string;
  featured: boolean;
  type: ProjectType;
}

export const projects: Project[] = [
  {
    id: "the-realm",
    title: "THE REALM",
    category: "Interactive Web Experience",
    description:
      "Interactive digital experience with a strong focus on frontend execution, animation and visual interaction.",
    technologies: ["NEXT.JS", "GSAP", "FRONTEND", "INTERACTION"],
    url: "https://therealm.in/",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&auto=format",
    featured: true,
    type: "UI",
  },
  {
    id: "climaty-ai",
    title: "CLIMATY AI",
    category: "AI / Interactive Interface",
    description:
      "AI product experience with a strong focus on interface design, frontend implementation and interaction.",
    technologies: ["REACT", "NEXT.JS", "GSAP", "AI"],
    url: "https://climaty.ai/",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop&auto=format",
    featured: true,
    type: "UI",
  },
  {
    id: "auditee-ai",
    title: "AUDITEE AI",
    category: "AI Auditing Platform",
    description:
      "Built the backend of an internal AI auditing tool from the ground up — authentication and authorization, file processing and data pipelines. Ran in production for approximately 20 operations users before the project was wound down due to budget.",
    technologies: ["NODE.JS", "APIS", "AUTHENTICATION", "DATA PIPELINES", "AI"],
    featured: true,
    type: "PRODUCT",
  },
  {
    id: "fintech-platform",
    title: "FINTECH PLATFORM",
    category: "Backend / Product Engineering",
    description:
      "End-to-end ownership of five core production modules on a fintech platform — API contracts, data models, backend implementation, deployment, production support, and React interfaces.",
    technologies: ["NODE.JS", "REACT", "MONGODB", "AWS", "REST API"],
    featured: true,
    type: "PRODUCT",
  },
];
