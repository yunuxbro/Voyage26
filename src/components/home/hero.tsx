import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import type { SiteSettings } from "@/lib/server/mongo-voyage";
import { Countdown } from "@/components/home/countdown";
import { CompassRose, SeaWaves } from "@/components/pirate/ornament";
import { Button } from "@/components/ui/button";

export function Hero({ site }: { site: SiteSettings }) {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <div className="hero-sea absolute inset-0" />
      <div className="fog-sheet" />
      <div className="fog-drift" />
      <div className="vignette" />
      <SeaWaves />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-4 pb-24 pt-10 text-center">
        <div className="stagger-in">
          <p className="text-[0.72rem] tracking-[0.32em] text-gold uppercase drop-shadow-lg">
            AIESEC in IIT presents
          </p>
          <h1 className="gold-title font-display mt-4 text-display leading-[0.95] tracking-display uppercase drop-shadow-2xl">
            Voyage
            <span className="mt-1 block text-[0.55em] tracking-[0.22em] text-parchment drop-shadow-lg">
              '26
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gold-2 sm:text-lg drop-shadow-2xl" style={{ textShadow: '0 0 4px rgba(0, 0, 0, 1), 0 4px 12px rgba(0, 0, 0, 0.95), 0 8px 20px rgba(0, 0, 0, 0.8)' }}>
            {site.tagline}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gold-2 sm:text-base drop-shadow-2xl" style={{ textShadow: '0 0 4px rgba(0, 0, 0, 1), 0 4px 12px rgba(0, 0, 0, 0.95), 0 8px 20px rgba(0, 0, 0, 0.8)' }}>
            {site.description}
          </p>
          <div className="mt-8 flex justify-center">
            <Countdown iso={site.event_starts_at} />
          </div>
          <p className="mt-4 text-xs tracking-[0.2em] text-parchment uppercase drop-shadow-md">
            {site.venue}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="min-w-44">
                Register
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="min-w-44">
                Ship's store
              </Button>
            </Link>
          </div>
        </div>
        <a
          href="#log"
          className="mt-12 inline-flex flex-col items-center gap-1 text-[0.65rem] tracking-[0.28em] text-gold/70 uppercase"
        >
          Descend
          <ChevronDown className="size-4" />
        </a>
      </div>

      <CompassRose className="compass-spin pointer-events-none absolute right-6 bottom-28 hidden size-16 opacity-70 md:block" />
    </section>
  );
}
