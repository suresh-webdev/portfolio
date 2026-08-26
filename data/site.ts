export const siteConfig = {
  name: "Suresh S",
  shortName: "Suresh",
  title: "Suresh S — Full Stack Engineer",
  description:
    "Full Stack Engineer (MERN + Python) owning production modules end-to-end — interfaces, APIs, services, data, and cloud infrastructure.",
  role: "Full Stack Engineer",
  discipline: "MERN + Python",
  location: "Bengaluru, IN",
  timezone: "Asia/Kolkata",
  /** Hero eyebrow clause — composed as "I'm Suresh — {intro}". Personal,
   *  not tied to a specific employer or role, so it stays true over time. */
  intro: "building products end to end, from Bengaluru",
  statement:
    "I own things end to end. Interface through infrastructure, one thread of responsibility.",
  /**
   * Split so the address never sits as one string in rendered HTML or a
   * static href — scrapers regex the DOM, not the JS bundle. Assembled
   * client-side on click, see components/motion/EmailAction.tsx.
   */
  emailUser: "sureshs.professional.career",
  emailDomain: "gmail.com",
  github: "https://github.com/suresh-webdev",
  linkedin: "https://www.linkedin.com/in/s-u-r-e-s-h/",
  resume: "/resume.pdf",
} as const;

export type SectionId =
  | "index"
  | "trace"
  | "work"
  | "trajectory"
  | "toolkit"
  | "contact";

export type SectionMeta = {
  id: SectionId;
  index: string;
  label: string;
  nav: string;
};

/** Ordered manifest — drives the trace rail, nav, and scroll observers. */
export const sections: SectionMeta[] = [
  { id: "index", index: "00", label: "Index", nav: "Top" },
  { id: "trace", index: "01", label: "The stack I own", nav: "Stack" },
  { id: "work", index: "02", label: "Selected work", nav: "Work" },
  { id: "trajectory", index: "03", label: "Trajectory", nav: "Path" },
  { id: "toolkit", index: "04", label: "Toolkit", nav: "Tools" },
  { id: "contact", index: "05", label: "Contact", nav: "Contact" },
];

export const socials = [
  { label: "LinkedIn", short: "IN", href: siteConfig.linkedin, external: true },
  { label: "GitHub", short: "GH", href: siteConfig.github, external: true },
] as const;
