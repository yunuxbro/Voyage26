import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { cartTotal, useCart } from "@/lib/cart";
import { cn, formatInr } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const total = cartTotal(items);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
      inert={!open}
    >
      <button
        type="button"
        aria-label="Close the hold"
        className={cn(
          "absolute inset-0 bg-ink/70 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-wood shadow-[0_0_0_1px_rgb(201_164_76_/_0.25)] transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-gold/20 px-5 py-4">
          <h2 className="font-display tracking-[0.18em] text-gold">The Hold</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center text-gold"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="pt-8 text-center text-sm text-muted">
              The hold is empty. Visit the ship's store and take what you need for the
              crossing.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="framed size-20 rounded-[10px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-parchment">{item.name}</p>
                    <p className="mt-1 text-sm text-gold tabular-nums">
                      {formatInr(item.priceCents)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-[8px] text-gold shadow-[0_0_0_1px_rgb(201_164_76_/_0.3)]"
                        onClick={() => setQty(item.productId, item.qty - 1)}
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-[8px] text-gold shadow-[0_0_0_1px_rgb(201_164_76_/_0.3)]"
                        onClick={() => setQty(item.productId, item.qty + 1)}
                        aria-label="Increase"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-xs text-muted hover:text-gold"
                        onClick={() => remove(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-gold/20 p-5 pb-20">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-muted">Prize</span>
            <span className="text-gold tabular-nums">{formatInr(total)}</span>
          </div>
          {items.length === 0 ? (
            <Button className="w-full" disabled>
              Proceed to harbour pay
            </Button>
          ) : (
            <Link to="/checkout" onClick={onClose} className="block">
              <Button className="w-full">Proceed to harbour pay</Button>
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
