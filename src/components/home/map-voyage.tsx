import { useEffect, useRef } from "react";

export function MapVoyage() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const view = window.innerHeight;
      const start = view * 0.85;
      const end = -rect.height * 0.15;
      const t = (start - rect.top) / (start - end);
      const progress = Math.min(1, Math.max(0, t));
      el.style.setProperty("--map-progress", String(progress));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-gold/15 bg-ink-2"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url(/images/gallery-map.jpg)",
          backgroundSize: "cover",
          backgroundPosition: `center calc(40% + (var(--scrolly, 0) * 0.04px))`,
        }}
      />
      <div className="absolute inset-0 bg-ink/55" />
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-center text-[0.7rem] tracking-[0.28em] text-gold uppercase">
          The crossing
        </p>
        <h2 className="font-display mt-2 text-center text-display-sm text-parchment">
          Four watches. One crew.
        </h2>
        <div className="relative mx-auto mt-10 h-56 max-w-3xl sm:h-72">
          <svg viewBox="0 0 120 90" className="h-full w-full text-gold/50" aria-hidden="true">
            <path
              d="M 8 72 C 28 18, 52 92, 78 36 S 108 8, 92 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeDasharray="2 2"
            />
            <circle cx="8" cy="72" r="1.6" fill="currentColor" />
            <circle cx="92" cy="60" r="1.6" fill="currentColor" />
          </svg>
          <div className="map-ship pointer-events-none absolute top-0 left-0 size-8">
            <svg viewBox="0 0 32 32" className="size-8 text-gold">
              <path d="M4 22 L16 8 L28 22 L16 18 Z" fill="currentColor" />
            </svg>
          </div>
          <p className="absolute bottom-2 left-0 text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Home port
          </p>
          <p className="absolute right-0 bottom-8 text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Treasure harbour
          </p>
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted">
          Scroll the chart. The flagship answers the helm — down the page to sail
          out, back up to return to port. Same as the old films: the sea never
          forgets which way you came.
        </p>
      </div>
    </section>
  );
}
