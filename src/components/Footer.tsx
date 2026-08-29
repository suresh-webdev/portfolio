import { siteConfig } from "../data/siteConfig";
import { IconMail, IconLinkedIn, IconGithub } from "./icons";

export default function Footer() {
  return (
    <footer className="px-8 md:px-12 py-10 border-t border-[rgba(240,237,230,0.06)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="font-display font-bold text-[#f0ede6] text-sm tracking-[0.15em] uppercase block mb-1">
            {siteConfig.name}
          </span>
          <span className="font-mono text-[9px] text-[#6b6860] tracking-[0.2em]">
            Full-Stack Engineer · Interactive UI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[#6b6860] hover:text-[#38bdf8] transition-colors duration-300"
          >
            <IconGithub className="w-4 h-4" />
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[#6b6860] hover:text-[#38bdf8] transition-colors duration-300"
          >
            <IconLinkedIn className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            aria-label="Email"
            className="text-[#6b6860] hover:text-[#38bdf8] transition-colors duration-300"
          >
            <IconMail className="w-4 h-4" />
          </a>
        </div>

        <span className="font-mono text-[8px] text-[#6b6860] tracking-[0.15em] opacity-50">
          © {new Date().getFullYear()} Suresh S
        </span>
      </div>
    </footer>
  );
}
