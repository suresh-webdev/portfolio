export type ProjectType = "UI" | "PRODUCT";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  url?: string;
  image?: string;
  video?: string;
  type: ProjectType;
}

export const projects: Project[] = [
  {
    id: "the-realm",
    title: "THE REALM",
    category: "Interactive Web Experience",
    description:
      "Frontend and interaction work on a real estate concierge platform — animation and visual execution were the focus.",
    technologies: ["NEXT.JS", "GSAP", "FRONTEND", "INTERACTION"],
    url: "https://therealm.in/",
    image: "/projects/the-realm-live.jpg",
    video: "/projects/the-realm-video.mp4",
    type: "UI",
  },
  {
    id: "climaty-ai",
    title: "CLIMATY AI",
    category: "AI / Interactive Interface",
    description:
      "Built the interface layer for this AI climate product — interaction design and frontend implementation, mostly.",
    technologies: ["REACT", "NEXT.JS", "GSAP", "AI"],
    url: "https://climaty.ai/",
    image: "/projects/climaty-ai-live.jpg",
    video: "/projects/climaty-ai-video.mp4",
    type: "UI",
  },
  {
    id: "kai",
    title: "KAI",
    category: "AI Chatbot for Education",
    description:
      "An AI chatbot for education admissions teams. My part was the interaction layer and visual execution, not the AI underneath.",
    technologies: ["REACT", "GSAP", "FRONTEND", "AI"],
    url: "https://kai.ken42.com/",
    image: "/projects/kai-live.jpg",
    video: "/projects/kai-video.mp4",
    type: "UI",
  },
  {
    id: "auditee-ai",
    title: "AUDITEE AI",
    category: "AI Ad Auditing Platform",
    description:
      "Built the backend of an internal AI ad-auditing tool from the ground up: authentication and authorization, file processing and data pipelines. Ran in production for approximately 20 operations users before the project was wound down due to budget.",
    technologies: ["NODE.JS", "APIS", "AUTHENTICATION", "DATA PIPELINES", "AI"],
    type: "PRODUCT",
  },
  {
    id: "finnulate",
    title: "FINNULATE AI",
    category: "Fintech Compliance Platform",
    description:
      "End-to-end ownership of five core production modules on Finnulate AI, a fintech compliance platform: API contracts, data models, backend implementation, deployment, production support, and React interfaces.",
    technologies: ["NODE.JS", "PYTHON", "EXPRESS.JS", "FASTAPI", "MONGODB", "NEO4J", "AWS", "REACT"],
    type: "PRODUCT",
  },
];
