import { siteConfig } from "../data/siteConfig";

export default function Footer() {
  return (
    <footer className="px-8 md:px-12 py-10 border-t border-[rgba(240,237,230,0.06)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="font-display font-bold text-[#f0ede6] text-sm tracking-[0.15em] uppercase block mb-1">
            {siteConfig.name}
          </span>
          <span className="font-mono text-[9px] text-[#6b6860] tracking-[0.2em]">
            Backend Engineer · Full-Stack Engineering · Interactive UI
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[9px] text-[#6b6860] tracking-[0.2em] hover:text-[#f0ede6] transition-colors duration-300 uppercase"
          >
            GitHub
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[9px] text-[#6b6860] tracking-[0.2em] hover:text-[#f0ede6] transition-colors duration-300 uppercase"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-mono text-[9px] text-[#6b6860] tracking-[0.2em] hover:text-[#f0ede6] transition-colors duration-300 uppercase"
          >
            Email
          </a>
        </div>

        <span className="font-mono text-[8px] text-[#6b6860] tracking-[0.15em] opacity-50">
          © {new Date().getFullYear()} Suresh S
        </span>
      </div>
    </footer>
  );
}
