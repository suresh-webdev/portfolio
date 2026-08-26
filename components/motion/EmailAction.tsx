"use client";

import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

type EmailActionProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Renders no address anywhere — not as text, not as a static href.
 * The mailto: link is assembled only at the moment of the click, so a
 * scraper reading the delivered HTML never sees a harvestable pattern.
 */
export function EmailAction({ className, children }: EmailActionProps) {
  return (
    <button
      type="button"
      data-cursor="link"
      onClick={() => {
        window.location.href = `mailto:${siteConfig.emailUser}@${siteConfig.emailDomain}`;
      }}
      className={cn("text-left", className)}
    >
      {children}
    </button>
  );
}
