import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-serif tracking-wide transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        gold: "bg-gold text-ink shadow-[0_0_0_1px_rgb(201_164_76_/_0.5)] hover:bg-gold-2",
        outline:
          "bg-transparent text-gold shadow-[0_0_0_1px_rgb(201_164_76_/_0.45)] hover:bg-gold/10",
        ghost: "bg-transparent text-parchment hover:text-gold",
        wine: "bg-wine text-parchment shadow-[0_0_0_1px_rgb(122_46_36_/_0.5)] hover:brightness-110",
      },
      size: {
        sm: "h-10 rounded-[10px] px-3.5 text-sm",
        md: "h-11 rounded-[12px] px-5 text-sm",
        lg: "h-12 rounded-[14px] px-6 text-base",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
