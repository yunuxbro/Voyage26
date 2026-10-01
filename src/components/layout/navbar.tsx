import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cartCount, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { CompassRose, Lantern } from "@/components/pirate/ornament";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "The Voyage" },
  { to: "/register", label: "Register" },
  { to: "/shop", label: "Shop" },
] as const;

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-8 w-28 animate-pulse rounded-full bg-gold/15" />;
  }
  if (!user) {
    return (
      <Link to="/login">
        <Button variant="outline" size="sm">
          Sign in
        </Button>
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <Link
        to="/admin"
        className="text-sm tracking-wide text-gold/90 transition-colors duration-150 hover:text-gold-2"
      >
        Quartermaster
      </Link>
      <div className="[&_span]:text-parchment [&_button]:text-gold">
        <UserButton />
      </div>
    </div>
  );
}

export function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const items = useCart((s) => s.items);
  const count = cartCount(items);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-gold/20 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 text-gold">
          <Lantern className="hidden sm:inline-flex" />
          <CompassRose className="compass-spin size-8" />
          <span className="font-display text-lg tracking-[0.18em] sm:text-xl">
            VOYAGE <span className="text-parchment">'26</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm tracking-[0.16em] text-parchment/80 uppercase transition-colors duration-150 hover:text-gold"
              activeProps={{ className: "text-gold" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onOpenCart}
            className="relative grid size-11 place-items-center text-gold"
            aria-label="Open the hold"
          >
            <ShoppingBag className="size-5" />
            {count > 0 ? (
              <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-medium text-ink tabular-nums">
                {count}
              </span>
            ) : null}
          </button>
          <div className="hidden md:block">
            <AuthSlot />
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center text-gold md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-gold/15 bg-ink-2 transition-[max-height,opacity] duration-200 ease-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="rounded-[12px] px-3 py-3 text-sm tracking-[0.16em] text-parchment uppercase"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-gold/15 px-3 py-3">
            <AuthSlot />
          </div>
          <Button
            className="mt-1 w-full"
            onClick={() => {
              setOpen(false);
              onOpenCart();
            }}
          >
            Open the hold
          </Button>
        </div>
      </div>
    </header>
  );
}
