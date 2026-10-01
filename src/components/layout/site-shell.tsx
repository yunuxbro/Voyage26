import { type ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScrollRoot } from "@/components/layout/scroll-root";
import { CartDrawer } from "@/components/shop/cart-drawer";

export function SiteShell({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="relative min-h-dvh bg-ink text-fg">
      <ScrollRoot />
      <div className="film-grain" />
      <Navbar onOpenCart={() => setCartOpen(true)} />
      <main>{children}</main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "#1c1712",
            color: "#e8dcc4",
            border: "1px solid rgba(201,164,76,0.3)",
            fontFamily: "Cinzel, serif",
          },
        }}
      />
    </div>
  );
}
