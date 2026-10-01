import { createHmac, timingSafeEqual } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const ADMIN_COOKIE = "voyage_admin";
const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

function getAdminCode(): string {
  const code = process.env.VOYAGE_ADMIN_CODE?.trim();
  if (!code) {
    throw new Error("Admin access is not configured. Set VOYAGE_ADMIN_CODE on the server.");
  }
  return code;
}

function sign(value: string, code: string): string {
  return createHmac("sha256", code).update(value).digest("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

export function verifyAdminCode(codeAttempt: string): void {
  const code = getAdminCode();
  if (!safeEqual(codeAttempt.trim(), code)) throw new Error("Invalid security code.");

  const expiresAt = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS);
  setCookie(ADMIN_COOKIE, `${expiresAt}.${sign(expiresAt, code)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
}

export function requireAdminSession(): void {
  const code = getAdminCode();
  const [expiresAt, signature, extra] = (getCookie(ADMIN_COOKIE) ?? "").split(".");
  if (!expiresAt || !signature || extra || Number(expiresAt) <= Date.now() / 1000) {
    throw new Error("Admin access required.");
  }
  if (!safeEqual(signature, sign(expiresAt, code))) {
    throw new Error("Admin access required.");
  }
}