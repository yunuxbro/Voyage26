import { Link } from "@tanstack/react-router";
import { Anchor, Compass, Flag, Users } from "lucide-react";
import type { EventSession, GalleryItem, Product, SiteSettings } from "@/lib/server/mongo-voyage";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/utils";
import { RopeDivider } from "@/components/pirate/ornament";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Compass,
    title: "Compass",
    copy: "Know your heading. Labs on self-leadership, values under fog, and the decisions you will still defend at dawn.",
  },
  {
    icon: Users,
    title: "Crew",
    copy: "Eight to a boat. You will lead people you did not choose — the only kind of leadership that counts.",
  },
  {
    icon: Flag,
    title: "Command",
    copy: "Give the order. Take the order. Rotate the wheel until rank feels like responsibility, not costume.",
  },
  {
    icon: Anchor,
    title: "Harbour",
    copy: "Leave with a commission, a crew you would sail with again, and a log of the day you actually changed.",
  },
];

export function About({ site }: { site: SiteSettings }) {
  const paragraphs = site.about_text.split(/\n\n+/);
  return (
    <section id="log" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <RopeDivider className="mb-10" />
      <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">Ship's log</p>
      <h2 className="font-display mt-2 max-w-2xl text-display-sm text-parchment">
        {site.event_title} is not a conference. It is a crossing.
      </h2>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 text-base leading-relaxed text-muted">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <aside className="rounded-[24px] bg-wood p-6 shadow-[0_0_0_1px_rgb(201_164_76_/_0.22)]">
          <p className="text-[0.7rem] tracking-[0.22em] text-gold uppercase">Port of call</p>
          <p className="mt-3 font-display text-xl text-parchment">{site.venue}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            One day. Five watches. Crews of eight. Commissioned by AIESEC in IIT
            for students who would rather take the wheel than watch the weather.
          </p>
          <Link to="/register" className="mt-6 inline-block">
            <Button>Take a berth</Button>
          </Link>
        </aside>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((item) => (
          <article
            key={item.title}
            className="rounded-[20px] bg-ink-2 p-5 shadow-[0_0_0_1px_rgb(201_164_76_/_0.16)]"
          >
            <item.icon className="size-5 text-gold" />
            <h3 className="mt-3 font-display text-lg text-gold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Schedule({ sessions }: { sessions: EventSession[] }) {
  return (
    <section className="bg-ink-2/80">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">The watches</p>
        <h2 className="font-display mt-2 text-display-sm text-parchment">
          A day written like a ship's log
        </h2>
        <ol className="mt-10 space-y-4">
          {sessions.map((session, index) => (
            <li
              key={session.id}
              className="grid gap-3 rounded-[20px] bg-wood px-5 py-5 shadow-[0_0_0_1px_rgb(201_164_76_/_0.16)] sm:grid-cols-[8rem_1fr]"
            >
              <div>
                <p className="text-[0.65rem] tracking-[0.2em] text-gold uppercase">
                  {String(index + 1).padStart(2, "0")} · {session.day_label}
                </p>
                <p className="mt-1 text-xs text-muted tabular-nums">{session.time_label}</p>
              </div>
              <div>
                <h3 className="font-display text-lg text-parchment">{session.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {session.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Gallery({ items }: { items: GalleryItem[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">Spyglass</p>
      <h2 className="font-display mt-2 text-display-sm text-parchment">
        From last year's crossing Voyage '25
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <figure
            key={item.id}
            className={
              i === 0
                ? "sm:col-span-2 lg:col-span-2 overflow-hidden rounded-[24px]"
                : "overflow-hidden rounded-[20px]"
            }
          >
            <img
              src={item.image_url}
              alt={item.caption}
              className="framed h-64 w-full object-cover sm:h-72"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

export function StoreTeaser({ products }: { products: Product[] }) {
  const add = useCart((s) => s.add);
  const featured = products.slice(0, 3);
  return (
    <section className="border-t border-gold/15 bg-wood">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">
              Ship's store
            </p>
            <h2 className="font-display mt-2 text-display-sm text-parchment">
              Kit for the crossing
            </h2>
          </div>
          <Link to="/shop">
            <Button variant="outline">All cargo</Button>
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {featured.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-[24px] bg-ink-2 shadow-[0_0_0_1px_rgb(201_164_76_/_0.18)]"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="framed h-56 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-display text-parchment">{product.name}</h3>
                <p className="mt-1 text-sm text-gold tabular-nums">
                  {formatInr(product.price_cents)}
                </p>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() =>
                    add({
                      productId: product.id,
                      name: product.name,
                      priceCents: product.price_cents,
                      imageUrl: product.image_url,
                    })
                  }
                >
                  Add to hold
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCall({ site }: { site: SiteSettings }) {
  return (
    <section className="relative overflow-hidden">
      <img
        src="/images/hero-galleon.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">
          All hands
        </p>
        <h2 className="font-display mt-3 text-display-sm text-parchment">
          Berths are finite. The tide is not waiting.
        </h2>
        <p className="mt-4 text-sm text-muted">{site.venue}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/register">
            <Button size="lg">Register as delegate</Button>
          </Link>
          <Link to="/shop">
            <Button size="lg" variant="outline">
              Browse the store
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
