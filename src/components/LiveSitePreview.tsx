import { useEffect, useRef } from "react";

interface Props {
  src: string;
  poster: string;
  label: string;
  /** Owned by the chapter above, so only the project currently on stage
   *  decodes. Previously each preview ran its own wide ScrollTrigger window
   *  and several could decode at once on a tall viewport. */
  active: boolean;
}

// A real screen recording of the live site, playing inside a framed browser
// window — "here is the actual thing, running" rather than a cropped
// screenshot. The chrome sits in its own strip and never over the recording,
// because the captured page already has its own nav baked in.
export default function LiveSitePreview({ src, poster, label, active }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect an explicit data-saver preference: the poster frame is a
    // complete presentation on its own, and these recordings are the
    // heaviest thing on the page by an order of magnitude.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;

    if (!active) {
      video.pause();
      return;
    }

    // React's dev-only StrictMode double-mount can abort the video's initial
    // fetch, leaving it in a "no supported sources" state that a plain
    // play() cannot recover from — reload it first whenever that happens.
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      video.load();
    }
    video.play().catch(() => {});
  }, [active]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-[#131311]">
      <div className="flex-none flex items-center gap-2 px-3 py-2 bg-[#0f0f0d] border-b border-[rgba(240,237,230,0.08)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[rgba(240,237,230,0.18)]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[rgba(240,237,230,0.18)]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[rgba(240,237,230,0.18)]" />
        <span className="font-mono text-[9px] text-[var(--color-muted)] tracking-wide ml-2 truncate">
          {label}
        </span>
        <span
          className="ml-auto w-1.5 h-1.5 rounded-full transition-colors duration-500"
          style={{ background: active ? "var(--color-accent)" : "rgba(240,237,230,0.14)" }}
        />
      </div>
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover object-top"
        >
          <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
          <source src={src} type="video/mp4" />
        </video>
        {/* The recording is dropped onto the same lattice as everything else,
            so it reads as sitting inside the field rather than pasted over
            it. Barely visible, and that is the point. */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(12,12,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(12,12,11,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </div>
  );
}
