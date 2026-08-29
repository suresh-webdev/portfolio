import { siteConfig } from "../data/siteConfig";
import { PAD, SHELL } from "../lib/layout";
import { IconMail, IconLinkedIn, IconGithub } from "./icons";

export default function Footer() {
  return (
    <footer className={`relative z-10 py-12 border-t border-[rgba(240,237,230,0.07)] ${PAD}`}>
      <div className={`${SHELL} flex flex-col md:flex-row items-start md:items-end justify-between gap-8`}>
        <div>
          <span className="display text-sm tracking-[0.18em] block mb-2">{siteConfig.name}</span>
          <span className="font-mono text-[9px] text-[var(--color-muted)] tracking-[0.2em] uppercase">
            Full-Stack Engineer · Interactive UI
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors duration-300"
          >
            <IconGithub className="w-4 h-4" />
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors duration-300"
          >
            <IconLinkedIn className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            aria-label="Email"
            className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors duration-300"
          >
            <IconMail className="w-4 h-4" />
          </a>
        </div>

        <span className="font-mono text-[9px] text-[var(--color-muted)] tracking-[0.15em]">
          © {new Date().getFullYear()} {siteConfig.name}
        </span>
      </div>
    </footer>
  );
}
