"use client";

import { useEffect } from "react";
import { siteConfig } from "@/data/site";

const SESSION_KEY = "trace:console";

/** For anyone who opens devtools before they open the CV. */
export function ConsoleEasterEgg() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // best-effort only
    }

    console.log(
      "%c TRACE %c one thread, interface → infrastructure ",
      "background:#ff4d19;color:#08080a;font-family:monospace;font-weight:700;padding:3px 8px;border-radius:3px 0 0 3px;",
      "background:#ede9e1;color:#08080a;font-family:monospace;padding:3px 8px;border-radius:0 3px 3px 0;",
    );
    console.log(
      `%cHi. Since you're here — ${siteConfig.name}, ${siteConfig.role}.\nGitHub: ${siteConfig.github}\nSource layout is on view — poke around.`,
      "font-family:monospace;font-size:11px;color:#8f8b81;",
    );
  }, []);

  return null;
}
