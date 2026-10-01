import { cn } from "@/lib/utils";

export function CompassRose({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("text-gold", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
      <path d="M32 4 L36 32 L32 60 L28 32 Z" fill="currentColor" opacity="0.95" />
      <path d="M4 32 L32 28 L60 32 L32 36 Z" fill="currentColor" opacity="0.55" />
      <circle cx="32" cy="32" r="3" fill="currentColor" />
    </svg>
  );
}

export function RopeDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center gap-3 text-gold/40", className)}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
      <CompassRose className="size-4" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
}

export function Lantern({ className }: { className?: string }) {
  return (
    <span className={cn("lantern inline-flex", className)} aria-hidden="true">
      <svg viewBox="0 0 24 48" className="h-12 w-6 text-gold">
        <line x1="12" y1="0" x2="12" y2="8" stroke="currentColor" strokeWidth="1" />
        <rect
          x="5"
          y="8"
          width="14"
          height="18"
          rx="2"
          fill="#1c1712"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <rect x="7.5" y="11" width="9" height="12" fill="#e6c87a" opacity="0.85" />
        <path d="M5 26 L12 34 L19 26" fill="#1c1712" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  );
}

export function SeaWaves() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden">
      <svg
        className="wave-band absolute bottom-0 h-28 w-[200%]"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="rgb(12 10 8 / 0.55)"
          d="M0 70 Q 180 30 360 70 T 720 70 T 1080 70 T 1440 70 V120 H0 Z"
        />
        <path
          fill="rgb(12 10 8 / 0.85)"
          d="M0 88 Q 180 50 360 88 T 720 88 T 1080 88 T 1440 88 V120 H0 Z"
        />
        <path
          fill="#0c0a08"
          d="M0 102 Q 180 78 360 102 T 720 102 T 1080 102 T 1440 102 V120 H0 Z"
        />
      </svg>
    </div>
  );
}
