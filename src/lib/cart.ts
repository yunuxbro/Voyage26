import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: number;
  name: string;
  priceCents: number;
  imageUrl: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const items = get().items;
        const existing = items.find((row) => row.productId === item.productId);
        if (existing) {
          set({
            items: items.map((row) =>
              row.productId === item.productId
                ? { ...row, qty: Math.min(row.qty + qty, 12) }
                : row,
            ),
          });
          return;
        }
        set({ items: [...items, { ...item, qty }] });
      },
      setQty: (productId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((row) => row.productId !== productId) });
          return;
        }
        set({
          items: get().items.map((row) =>
            row.productId === productId ? { ...row, qty: Math.min(qty, 12) } : row,
          ),
        });
      },
      remove: (productId) =>
        set({ items: get().items.filter((row) => row.productId !== productId) }),
      clear: () => set({ items: [] }),
    }),
    { name: "voyage26-cart" },
  ),
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, row) => sum + row.qty, 0);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, row) => sum + row.qty * row.priceCents, 0);
}
