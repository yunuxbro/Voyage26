import { Input, Label } from "@/components/ui/field";

export type CardState = {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
};

export function CardFields({
  value,
  onChange,
}: {
  value: CardState;
  onChange: (next: CardState) => void;
}) {
  const set = (patch: Partial<CardState>) => onChange({ ...value, ...patch });

  return (
    <div className="rounded-[20px] bg-ink-2 p-5 shadow-[0_0_0_1px_rgb(201_164_76_/_0.2)]">
      <p className="font-display text-gold">Harbour Pay</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Card details are checked in this harbour and never written into the log.
        Use any valid test card — 4242 4242 4242 4242 works.
      </p>
      <div className="mt-4 grid gap-4">
        <div>
          <Label htmlFor="cardName">Name on card</Label>
          <Input
            id="cardName"
            autoComplete="cc-name"
            value={value.cardName}
            onChange={(e) => set({ cardName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="cardNumber">Card number</Label>
          <Input
            id="cardNumber"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            value={value.cardNumber}
            onChange={(e) =>
              set({
                cardNumber: e.target.value.replace(/[^\d ]/g, "").slice(0, 23),
              })
            }
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="cardExpiry">Expiry</Label>
            <Input
              id="cardExpiry"
              placeholder="MM / YY"
              autoComplete="cc-exp"
              value={value.cardExpiry}
              onChange={(e) => set({ cardExpiry: e.target.value.slice(0, 7) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="cardCvc">CVC</Label>
            <Input
              id="cardCvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={value.cardCvc}
              onChange={(e) =>
                set({ cardCvc: e.target.value.replace(/\D/g, "").slice(0, 4) })
              }
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
