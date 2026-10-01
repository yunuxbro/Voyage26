import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number; past: boolean };

function split(target: Date, now: Date): Parts {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    past: false,
  };
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[4.5rem] rounded-[16px] bg-ink/55 px-3 py-3 shadow-[0_0_0_1px_rgb(201_164_76_/_0.28)] sm:min-w-[5.5rem] sm:px-4 sm:py-4">
      <div className="font-display text-3xl text-gold tabular-nums sm:text-4xl">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[0.65rem] tracking-[0.22em] text-muted uppercase">{label}</div>
    </div>
  );
}

export function Countdown({ iso }: { iso: string }) {
  const target = new Date(iso);
  const [parts, setParts] = useState<Parts>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    past: false,
  });

  useEffect(() => {
    const tick = () => setParts(split(target, new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (Number.isNaN(target.getTime())) return null;

  if (parts.past) {
    return (
      <p className="font-display tracking-[0.18em] text-gold">The fleet is in harbour.</p>
    );
  }

  return (
    <div>
      <p className="mb-3 text-[0.7rem] tracking-[0.28em] text-gold/80 uppercase">
        First gun in
      </p>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <Cell value={parts.days} label="Days" />
        <Cell value={parts.hours} label="Hours" />
        <Cell value={parts.minutes} label="Minutes" />
        <Cell value={parts.seconds} label="Seconds" />
      </div>
    </div>
  );
}
