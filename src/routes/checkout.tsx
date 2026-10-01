import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { placeOrder } from "@/lib/server/mongo-voyage";
import { cartTotal, useCart } from "@/lib/cart";
import { formatInr } from "@/lib/utils";
import { CardFields, type CardState } from "@/components/pay/card-fields";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
  });
  const [card, setCard] = useState<CardState>({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const total = cartTotal(items);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    setBusy(true);
    try {
      const result = await placeOrder({
        data: {
          ...form,
          cardNumber: card.cardNumber,
          cardExpiry: card.cardExpiry,
          cardCvc: card.cardCvc,
          items: items.map((item) => ({ productId: item.productId, qty: item.qty })),
        },
      });
      clear();
      toast.success("Order placed; payment is pending verification.");
      await navigate({ to: "/order/$id", params: { id: result.publicId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-parchment">The hold is empty</h1>
        <p className="mt-3 text-sm text-muted">Visit the store before you pay harbour dues.</p>
        <Link to="/shop" className="mt-6 inline-block">
          <Button>Ship's store</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_20rem]">
      <div>
        <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">Harbour pay</p>
        <h1 className="font-display mt-2 text-display-sm text-parchment">Checkout</h1>
        <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerName">Full name</Label>
              <Input
                id="customerName"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.addressLine}
              onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                required
              />
            </div>
          </div>
          <CardFields value={card} onChange={setCard} />
          <Button type="submit" size="lg" disabled={busy}>
            {busy ? "Clearing the harbour…" : `Pay ${formatInr(total)}`}
          </Button>
        </form>
      </div>
      <aside className="h-fit rounded-[24px] bg-wood p-5 shadow-[0_0_0_1px_rgb(201_164_76_/_0.2)]">
        <p className="font-display text-gold">Manifest</p>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3 text-sm">
              <span className="text-parchment">
                {item.name} × {item.qty}
              </span>
              <span className="text-gold tabular-nums">
                {formatInr(item.priceCents * item.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-gold/20 pt-4 text-sm">
          <span className="text-muted">Prize</span>
          <span className="text-gold tabular-nums">{formatInr(total)}</span>
        </div>
      </aside>
    </div>
  );
}
