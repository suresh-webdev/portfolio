"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type AssetSlotProps = {
  /** Drop a file in /public and pass its path — the placeholder disappears. */
  src?: string;
  alt: string;
  /** Shown in the placeholder frame so the slot reads as intentional. */
  caption: string;
  spec?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * A reserved space for artwork that has not arrived yet.
 * Renders as a considered technical frame rather than a broken image —
 * the layout is identical whether the asset is present or not.
 */
export function AssetSlot({
  src,
  alt,
  caption,
  spec,
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 40vw",
}: AssetSlotProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-raised",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div className="absolute inset-0">
          {/* corner registration marks */}
          <span className="absolute left-3 top-3 h-3 w-3 border-l border-t border-(--surface-fg-28)" />
          <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-(--surface-fg-28)" />
          <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-(--surface-fg-28)" />
          <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-(--surface-fg-28)" />

          <span
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent 0 9px, var(--surface-shape) 9px 10px)",
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center">
            <span className="t-label text-(--surface-fg-45)">{caption}</span>
            {spec && (
              <span className="t-mono text-[0.625rem] text-(--surface-fg-28)">
                {spec}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
