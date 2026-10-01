import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatInr(cents: number): string {
  const rupees = Math.round(cents) / 100;
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees);
  return `Rs. ${formatted}`;
}

export function luhnOk(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function last4(num: string): string {
  const digits = num.replace(/\D/g, "");
  return digits.slice(-4);
}

export function makeRef(prefix: string): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  for (let i = 0; i < 6; i += 1) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${body}`;
}

export function makeQrCodeUrl(data: string, size = "220x220"): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(data)}`;
}

export function parseExpiry(value: string): { month: number; year: number } | null {
  const m = value.trim().match(/^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/);
  if (!m) return null;
  const month = Number(m[1]);
  let year = Number(m[2]);
  if (year < 100) year += 2000;
  if (month < 1 || month > 12) return null;
  return { month, year };
}

export function expiryValid(value: string, now = new Date()): boolean {
  const parsed = parseExpiry(value);
  if (!parsed) return false;
  const end = new Date(parsed.year, parsed.month, 0, 23, 59, 59);
  return end.getTime() >= now.getTime();
}
