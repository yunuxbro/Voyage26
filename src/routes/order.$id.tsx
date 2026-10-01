import { createFileRoute, Link } from "@tanstack/react-router";
import { getOrder } from "@/lib/server/mongo-voyage";
import { formatInr } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order/$id")({
  loader: ({ params }) => getOrder({ data: params.id }),
  component: OrderPage,
});

function OrderPage() {
  const data = Route.useLoaderData();
  if (!data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-parchment">No such prize</h1>
        <p className="mt-3 text-sm text-muted">That order is not in the log.</p>
      </div>
    );
  }
  const { order, items } = data;
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">Taken</p>
      <h1 className="font-display mt-2 text-3xl text-parchment">Order received</h1>
      <p className="mt-2 font-display tracking-[0.16em] text-gold">{order.public_id}</p>
      <p className="mt-4 text-sm text-muted">
        Amount {formatInr(order.amount_cents)} · payment {order.payment_status} · ref {order.payment_ref}
      </p>
      <ul className="mt-8 space-y-3 rounded-[20px] bg-wood p-5 shadow-[0_0_0_1px_rgb(201_164_76_/_0.2)]">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.qty}
            </span>
            <span className="text-gold tabular-nums">
              {formatInr(item.unit_price_cents * item.qty)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">
        {order.customer_name} · {order.address_line}, {order.city} {order.pincode}
      </p>
      <Link to="/shop" className="mt-8 inline-block">
        <Button variant="outline">Return to the store</Button>
      </Link>
    </div>
  );
}
