import { useEffect, useRef } from "react";
import { ScrollTrigger } from "../lib/animations";

interface Props {
  src: string;
  poster: string;
  label: string;
}

// A real screen recording of the live site, playing inside a framed browser
// window once its card actually reaches the viewport — reads as "here's the
// actual site in motion" instead of a cropped stock photo or a simulated
// scroll over a screenshot.
export default function LiveSitePreview({ src, poster, label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    // React's dev-only StrictMode double-mount can abort the video's initial
    // fetch, leaving it in a "no supported sources" state that a plain
    // play() can't recover from — reload it first whenever that happens.
    const tryPlay = () => {
      if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        video.load();
      }
      video.play().catch(() => {});
    };

    triggerRef.current = ScrollTrigger.create({
      trigger: container,
      start: "top 90%",
      end: "bottom 10%",
      onEnter: tryPlay,
      onEnterBack: tryPlay,
      onLeave: () => video.pause(),
      onLeaveBack: () => video.pause(),
    });

    return () => {
      triggerRef.current?.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col w-full h-full overflow-hidden bg-[#1a1a18]">
      {/* Chrome sits in its own strip, never over the recording itself —
          the captured page already has its own real nav baked in. */}
      <div className="flex-none flex items-center gap-2 px-3 py-2 bg-[#141412] border-b border-[rgba(240,237,230,0.08)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[rgba(240,237,230,0.18)]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[rgba(240,237,230,0.18)]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[rgba(240,237,230,0.18)]" />
        <span className="font-mono text-[9px] text-[#6b6860] tracking-wide ml-2 truncate">{label}</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover object-top"
        >
          <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
