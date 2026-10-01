import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { listProducts } from "@/lib/server/mongo-voyage";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop")({
  loader: () => listProducts(),
  component: ShopPage,
});

function ShopPage() {
  const products = Route.useLoaderData();
  const add = useCart((s) => s.add);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">Ship's store</p>
      <h1 className="font-display mt-2 text-display-sm text-parchment">
        Cargo for the crossing
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        Tees, compasses, journals — kit issued in the spirit of a privateer
        company. Harbour Pay at checkout. Stock is finite.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="flex flex-col overflow-hidden rounded-[24px] bg-wood shadow-[0_0_0_1px_rgb(201_164_76_/_0.18)]"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="framed h-64 w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-display text-xl text-parchment">{product.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-gold tabular-nums">{formatInr(product.price_cents)}</p>
                <p className="text-xs text-muted">{product.stock} in hold</p>
              </div>
              <Button
                className="mt-4 w-full"
                disabled={product.stock < 1}
                onClick={() => {
                  add({
                    productId: product.id,
                    name: product.name,
                    priceCents: product.price_cents,
                    imageUrl: product.image_url,
                  });
                  toast.success(`${product.name} added to the hold.`);
                }}
              >
                {product.stock < 1 ? "Sold out" : "Add to hold"}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
