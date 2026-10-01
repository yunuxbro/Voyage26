import { Link } from "@tanstack/react-router";
import { CompassRose, RopeDivider } from "@/components/pirate/ornament";

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <RopeDivider className="mb-8" />
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-gold">
              <CompassRose className="size-6" />
              <p className="font-display tracking-[0.18em]">VOYAGE '26</p>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              A leadership development programme by AIESEC in IIT. Inspired by the
              golden age of Caribbean privateers.
            </p>
          </div>
          <div>
            <p className="text-[0.7rem] tracking-[0.22em] text-gold uppercase">Charts</p>
            <ul className="mt-3 space-y-2 text-sm text-parchment/80">
              <li>
                <Link to="/register" className="hover:text-gold">
                  Delegate registration
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-gold">
                  Ship's store
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[0.7rem] tracking-[0.22em] text-gold uppercase">The harbour</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              AIESEC in IIT
              <br />
              Main Campus Grounds
              <br />
              30 October 2026
            </p>
          </div>
        </div>
        <p className="mt-10 text-xs tracking-wide text-muted/80">
          Voyage '26 is an original programme world. It is not affiliated with any
          motion picture studio.
        </p>
      </div>
    </footer>
  );
}
