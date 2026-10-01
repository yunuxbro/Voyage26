import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-Dw4aI9KJ.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatInr(cents) {
	const rupees = Math.round(cents) / 100;
	return `Rs. ${new Intl.NumberFormat("en-IN", {
		minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
		maximumFractionDigits: rupees % 1 === 0 ? 0 : 2
	}).format(rupees)}`;
}
function luhnOk(num) {
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
function last4(num) {
	return num.replace(/\D/g, "").slice(-4);
}
function makeRef(prefix) {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let body = "";
	for (let i = 0; i < 6; i += 1) body += alphabet[Math.floor(Math.random() * 32)];
	return `${prefix}-${body}`;
}
function makeQrCodeUrl(data, size = "220x220") {
	return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(data)}`;
}
function parseExpiry(value) {
	const m = value.trim().match(/^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/);
	if (!m) return null;
	const month = Number(m[1]);
	let year = Number(m[2]);
	if (year < 100) year += 2e3;
	if (month < 1 || month > 12) return null;
	return {
		month,
		year
	};
}
function expiryValid(value, now = /* @__PURE__ */ new Date()) {
	const parsed = parseExpiry(value);
	if (!parsed) return false;
	return new Date(parsed.year, parsed.month, 0, 23, 59, 59).getTime() >= now.getTime();
}
//#endregion
export { luhnOk as a, last4 as i, expiryValid as n, makeQrCodeUrl as o, formatInr as r, makeRef as s, cn as t };
