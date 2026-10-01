import { c as setCookie$1, i as TSS_SERVER_FUNCTION, o as getCookie } from "./ssr.mjs";
import { createHmac, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-access.server-DNFrjnXp.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ADMIN_COOKIE = "voyage_admin";
var ADMIN_SESSION_SECONDS = 28800;
function getAdminCode() {
	const code = process.env.VOYAGE_ADMIN_CODE?.trim();
	if (!code) throw new Error("Admin access is not configured. Set VOYAGE_ADMIN_CODE on the server.");
	return code;
}
function sign(value, code) {
	return createHmac("sha256", code).update(value).digest("base64url");
}
function safeEqual(left, right) {
	const leftBytes = Buffer.from(left);
	const rightBytes = Buffer.from(right);
	return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}
function verifyAdminCode(codeAttempt) {
	const code = getAdminCode();
	if (!safeEqual(codeAttempt.trim(), code)) throw new Error("Invalid security code.");
	const expiresAt = String(Math.floor(Date.now() / 1e3) + ADMIN_SESSION_SECONDS);
	setCookie$1(ADMIN_COOKIE, `${expiresAt}.${sign(expiresAt, code)}`, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		path: "/",
		maxAge: ADMIN_SESSION_SECONDS
	});
}
function requireAdminSession() {
	const code = getAdminCode();
	const [expiresAt, signature, extra] = (getCookie(ADMIN_COOKIE) ?? "").split(".");
	if (!expiresAt || !signature || extra || Number(expiresAt) <= Date.now() / 1e3) throw new Error("Admin access required.");
	if (!safeEqual(signature, sign(expiresAt, code))) throw new Error("Admin access required.");
}
//#endregion
export { requireAdminSession as n, verifyAdminCode as r, createServerRpc as t };
