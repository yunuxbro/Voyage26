import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full rounded-[10px] bg-ink-2 px-3.5 text-sm text-parchment shadow-[0_0_0_1px_rgb(201_164_76_/_0.22)] outline-none transition-[box-shadow] duration-150 placeholder:text-muted/70 focus:shadow-[0_0_0_1px_rgb(201_164_76_/_0.7)]";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldClass, "h-auto min-h-28 py-3", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, className)} {...props}>
      {children}
    </select>
  );
}
