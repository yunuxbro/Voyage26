import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-BBjsoOtd.mjs";
import { H as require_react, S as require_jsx_runtime, _ as createRootRoute, d as HeadContent, g as createFileRoute, h as lazyRouteComponent, m as Outlet, p as createRouter, u as Scripts, v as Link, x as useRouter, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BCxQLEMm.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as formatInr, t as cn } from "./utils-Dw4aI9KJ.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut, t as authClient } from "./client-BFO8oNK4.mjs";
import { a as hasGateSessionMarker, n as auth, r as authConfigured } from "./server-Dz7CktS8.mjs";
import { a as Menu, i as ShoppingBag, r as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-current-user-CcJxK_DG.js
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/mongo-voyage-gM8ua25x.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var delegateOptions = [
	"Register only",
	"Delegate Pack",
	"T-shirt Only",
	"Mouse Pad Only",
	"Delegate Pack + Mouse Pad",
	"T-shirt + Mouse Pad"
];
var getSite = createServerFn({ method: "GET" }).handler(createSsrRpc("6c06d451357dfa6f72ceec795f4424d91a4f7b3fe7dcefea9cafa360146f2ef9"));
var listProducts = createServerFn({ method: "GET" }).handler(createSsrRpc("0a9ac6b274bc8b6b9adc6340aedf7ed1c384867219dcf4cfa5c86b1698634799"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fa1e4f4cd4f02404ba2c07c6828f479a4a886fe4b56126f4bcfd3fbb4b921057"));
createServerFn({ method: "GET" }).handler(createSsrRpc("d460408bef3c152451a3d50c769721d3065610a2af782513ab6cd347745d3830"));
createServerFn({ method: "GET" }).handler(createSsrRpc("a8db7b14c2c35866ccc2ec26e8def748c21be45d588e605c56911b1a1b1e4a4b"));
var getHomeData = createServerFn({ method: "GET" }).handler(createSsrRpc("20b4ee8f8cebfc40d17997ed81d2cfc5319a6d7b9fdaa17bc086467fe0f1ebd1"));
var verifyAdminAccess = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("97376eaa5784a8547320e6859c662828b37202db0d10cf358f0165be20d20e66"));
var getRegistrationPaymentSettings = createServerFn({ method: "GET" }).handler(createSsrRpc("3c379fec7960823c7310c781367d252cd065e1f53baf8c31426c94ccf35e3639"));
var registerDelegate = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("0653e6a6bc6079452d57fe3f25bf701e755cc8c5d798da2a0614307cada87c66"));
var getTicketStatus = createServerFn({ method: "GET" }).validator((ticketToken) => ticketToken).handler(createSsrRpc("427c40e3b15ae6572aba88708e873c4e50e3c36ba5e5c54d996e352cef94dcae"));
var getAdminTicketDetails = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((ticketToken) => ticketToken).handler(createSsrRpc("fcf951145d2f1d9382bcd09de3d80aa05f80ae12562bad47362420257ad0b9ed"));
var getPaymentSlip = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((registrationId) => registrationId).handler(createSsrRpc("0ff81844e0704859e9621b2b0cae08eabd8d9ce536d089cb2b0b23cfc400cfc9"));
var reviewRegistration = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("474f7344978ac8295b1620a581fe0afaadbeeac88f809e1483c7e41349ac3173"));
var checkInRegistration = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((ticketToken) => ticketToken).handler(createSsrRpc("95f5aa05c5dafa3828b8c120130b6281f5dd1c3baa201ca2f5ed6934719e3290"));
var updateRegistrationPaymentSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("331e75bca9d8397889cda0756f03418fa0c220507906e79ee7664da9a8812fcd"));
var exportRegistrations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a31d34fa51bc926d068734e855c2945f6eb111a06b87b153b7e0d737bfe902c8"));
var placeOrder = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("aff0ec6285e1786d19d81797ce9acc8ed04a749f5202376e3cf43a96ff689381"));
var getOrder = createServerFn({ method: "GET" }).validator((publicId) => publicId).handler(createSsrRpc("a512e257c36408b418bd65ffb2dd897017754d99c8eeb189b5623ab9b703b565"));
var adminDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("14cd3f2e2265f39f8167389b9b965f33dcc0f9fb30d487693952f96512ce2a13"));
var updateSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("414da096959b4d6fffc3f79185d4d2001136ebd38bcddd79be5376b15c906d34"));
var upsertProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("108bdc466141fa561f459f2cd226a17e9e86d7553e13b7a4c344f22e23349d03"));
var deleteProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("a0c311d3101ea6f5e2059505198a863b51c3c0665984bc37f9c154ebc96551ad"));
var upsertGallery = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("b42484896d657c80918c89210cb22e8a957c8dc8ba2bfe31dd8e3188a29ab1ad"));
var deleteGallery = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("be2b059a85bdee7b8b3165c1ac5f88a48b3edcebf710234cef3f7d2a2334b293"));
var upsertSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("e411bc3b011389244ecd832cda1d4cda494819d00cad19d210b1b29859333d00"));
var deleteSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("20a9c01ff01f25ea3ce79ae7b7a5975110312258341e5d0621abc908c1aa52dd"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BRS1F0Tu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function CompassRose({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 64 64",
		className: cn("text-gold", className),
		fill: "none",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "29",
				stroke: "currentColor",
				strokeWidth: "1.2",
				opacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "22",
				stroke: "currentColor",
				strokeWidth: "0.7",
				opacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M32 4 L36 32 L32 60 L28 32 Z",
				fill: "currentColor",
				opacity: "0.95"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M4 32 L32 28 L60 32 L32 36 Z",
				fill: "currentColor",
				opacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "3",
				fill: "currentColor"
			})
		]
	});
}
function RopeDivider({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-3 text-gold/40", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompassRose, { className: "size-4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" })
		]
	});
}
function Lantern({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("lantern inline-flex", className),
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 48",
			className: "h-12 w-6 text-gold",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "12",
					y1: "0",
					x2: "12",
					y2: "8",
					stroke: "currentColor",
					strokeWidth: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "5",
					y: "8",
					width: "14",
					height: "18",
					rx: "2",
					fill: "#1c1712",
					stroke: "currentColor",
					strokeWidth: "1.2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "7.5",
					y: "11",
					width: "9",
					height: "12",
					fill: "#e6c87a",
					opacity: "0.85"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M5 26 L12 34 L19 26",
					fill: "#1c1712",
					stroke: "currentColor",
					strokeWidth: "1"
				})
			]
		})
	});
}
function SeaWaves() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			className: "wave-band absolute bottom-0 h-28 w-[200%]",
			viewBox: "0 0 1440 120",
			preserveAspectRatio: "none",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "rgb(12 10 8 / 0.55)",
					d: "M0 70 Q 180 30 360 70 T 720 70 T 1080 70 T 1440 70 V120 H0 Z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "rgb(12 10 8 / 0.85)",
					d: "M0 88 Q 180 50 360 88 T 720 88 T 1080 88 T 1440 88 V120 H0 Z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#0c0a08",
					d: "M0 102 Q 180 78 360 102 T 720 102 T 1080 102 T 1440 102 V120 H0 Z"
				})
			]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-gold/20 bg-ink-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-12 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RopeDivider, { className: "mb-8" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompassRose, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display tracking-[0.18em]",
								children: "VOYAGE '26"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xs text-sm leading-relaxed text-muted",
							children: "A leadership development programme by AIESEC in IIT. Inspired by the golden age of Caribbean privateers."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.7rem] tracking-[0.22em] text-gold uppercase",
							children: "Charts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2 text-sm text-parchment/80",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/register",
									className: "hover:text-gold",
									children: "Delegate registration"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/shop",
									className: "hover:text-gold",
									children: "Ship's store"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "hover:text-gold",
									children: "Sign in"
								}) })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.7rem] tracking-[0.22em] text-gold uppercase",
							children: "The harbour"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: [
								"AIESEC in IIT",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Main Campus Grounds",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"30 October 2026"
							]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 text-xs tracking-wide text-muted/80",
					children: "Voyage '26 is an original programme world. It is not affiliated with any motion picture studio."
				})
			]
		})
	});
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var useCart = create()(persist((set, get) => ({
	items: [],
	add: (item, qty = 1) => {
		const items = get().items;
		if (items.find((row) => row.productId === item.productId)) {
			set({ items: items.map((row) => row.productId === item.productId ? {
				...row,
				qty: Math.min(row.qty + qty, 12)
			} : row) });
			return;
		}
		set({ items: [...items, {
			...item,
			qty
		}] });
	},
	setQty: (productId, qty) => {
		if (qty <= 0) {
			set({ items: get().items.filter((row) => row.productId !== productId) });
			return;
		}
		set({ items: get().items.map((row) => row.productId === productId ? {
			...row,
			qty: Math.min(qty, 12)
		} : row) });
	},
	remove: (productId) => set({ items: get().items.filter((row) => row.productId !== productId) }),
	clear: () => set({ items: [] })
}), { name: "voyage26-cart" }));
function cartCount(items) {
	return items.reduce((sum, row) => sum + row.qty, 0);
}
function cartTotal(items) {
	return items.reduce((sum, row) => sum + row.qty * row.priceCents, 0);
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-serif tracking-wide transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-50", {
	variants: {
		variant: {
			gold: "bg-gold text-ink shadow-[0_0_0_1px_rgb(201_164_76_/_0.5)] hover:bg-gold-2",
			outline: "bg-transparent text-gold shadow-[0_0_0_1px_rgb(201_164_76_/_0.45)] hover:bg-gold/10",
			ghost: "bg-transparent text-parchment hover:text-gold",
			wine: "bg-wine text-parchment shadow-[0_0_0_1px_rgb(122_46_36_/_0.5)] hover:brightness-110"
		},
		size: {
			sm: "h-10 rounded-[10px] px-3.5 text-sm",
			md: "h-11 rounded-[12px] px-5 text-sm",
			lg: "h-12 rounded-[14px] px-6 text-base"
		}
	},
	defaultVariants: {
		variant: "gold",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var links = [
	{
		to: "/",
		label: "The Voyage"
	},
	{
		to: "/register",
		label: "Register"
	},
	{
		to: "/shop",
		label: "Shop"
	}
];
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-28 animate-pulse rounded-full bg-gold/15" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			size: "sm",
			children: "Sign in"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin",
			className: "text-sm tracking-wide text-gold/90 transition-colors duration-150 hover:text-gold-2",
			children: "Quartermaster"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "[&_span]:text-parchment [&_button]:text-gold",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
		})]
	});
}
function Navbar({ onOpenCart }) {
	const count = cartCount(useCart((s) => s.items));
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 border-b border-gold/20 bg-ink/80 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5 text-gold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lantern, { className: "hidden sm:inline-flex" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompassRose, { className: "compass-spin size-8" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-lg tracking-[0.18em] sm:text-xl",
							children: ["VOYAGE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-parchment",
								children: "'26"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-7 md:flex",
					children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: link.to,
						className: "text-sm tracking-[0.16em] text-parchment/80 uppercase transition-colors duration-150 hover:text-gold",
						activeProps: { className: "text-gold" },
						children: link.label
					}, link.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 sm:gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onOpenCart,
							className: "relative grid size-11 place-items-center text-gold",
							"aria-label": "Open the hold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-medium text-ink tabular-nums",
								children: count
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden md:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center text-gold md:hidden",
							"aria-label": open ? "Close menu" : "Open menu",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("md:hidden overflow-hidden border-t border-gold/15 bg-ink-2 transition-[max-height,opacity] duration-200 ease-out", open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1 px-4 py-4",
				children: [
					links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: link.to,
						onClick: () => setOpen(false),
						className: "rounded-[12px] px-3 py-3 text-sm tracking-[0.16em] text-parchment uppercase",
						children: link.label
					}, link.to)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 border-t border-gold/15 px-3 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-1 w-full",
						onClick: () => {
							setOpen(false);
							onOpenCart();
						},
						children: "Open the hold"
					})
				]
			})
		})]
	});
}
function ScrollRoot() {
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		let scrollFrame = 0;
		let mouseFrame = 0;
		const applyScroll = () => {
			const y = window.scrollY;
			const max = Math.max(1, root.scrollHeight - window.innerHeight);
			root.style.setProperty("--scrolly", String(y));
			root.style.setProperty("--scroll", String(y / max));
		};
		const applyMouse = (clientX, clientY) => {
			const x = clientX / window.innerWidth * 100;
			const y = clientY / window.innerHeight * 100;
			root.style.setProperty("--mouseX", String(x));
			root.style.setProperty("--mouseY", String(y));
		};
		const onScroll = () => {
			if (scrollFrame) return;
			scrollFrame = window.requestAnimationFrame(() => {
				scrollFrame = 0;
				applyScroll();
			});
		};
		const onMouseMove = (e) => {
			if (mouseFrame) return;
			mouseFrame = window.requestAnimationFrame(() => {
				mouseFrame = 0;
				applyMouse(e.clientX, e.clientY);
			});
		};
		applyScroll();
		applyMouse(window.innerWidth / 2, window.innerHeight / 2);
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("mousemove", onMouseMove, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("resize", onScroll);
			if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
			if (mouseFrame) window.cancelAnimationFrame(mouseFrame);
		};
	}, []);
	return null;
}
function CartDrawer({ open, onClose }) {
	const items = useCart((s) => s.items);
	const setQty = useCart((s) => s.setQty);
	const remove = useCart((s) => s.remove);
	const total = cartTotal(items);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("fixed inset-0 z-50", open ? "pointer-events-auto" : "pointer-events-none"),
		"aria-hidden": !open,
		inert: !open,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close the hold",
			className: cn("absolute inset-0 bg-ink/70 transition-opacity duration-200", open ? "opacity-100" : "opacity-0"),
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: cn("absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-wood shadow-[0_0_0_1px_rgb(201_164_76_/_0.25)] transition-transform duration-200 ease-out", open ? "translate-x-0" : "translate-x-full"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-gold/20 px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display tracking-[0.18em] text-gold",
						children: "The Hold"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "grid size-11 place-items-center text-gold",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto px-5 py-4",
					children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pt-8 text-center text-sm text-muted",
						children: "The hold is empty. Visit the ship's store and take what you need for the crossing."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-4",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.imageUrl,
								alt: "",
								className: "framed size-20 rounded-[10px] object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm text-parchment",
										children: item.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-gold tabular-nums",
										children: formatInr(item.priceCents)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "grid size-8 place-items-center rounded-[8px] text-gold shadow-[0_0_0_1px_rgb(201_164_76_/_0.3)]",
												onClick: () => setQty(item.productId, item.qty - 1),
												"aria-label": "Decrease",
												children: "−"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-6 text-center text-sm tabular-nums",
												children: item.qty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "grid size-8 place-items-center rounded-[8px] text-gold shadow-[0_0_0_1px_rgb(201_164_76_/_0.3)]",
												onClick: () => setQty(item.productId, item.qty + 1),
												"aria-label": "Increase",
												children: "+"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "ml-auto text-xs text-muted hover:text-gold",
												onClick: () => remove(item.productId),
												children: "Remove"
											})
										]
									})
								]
							})]
						}, item.productId))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-gold/20 p-5 pb-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Prize"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gold tabular-nums",
							children: formatInr(total)
						})]
					}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						disabled: true,
						children: "Proceed to harbour pay"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/checkout",
						onClick: onClose,
						className: "block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							children: "Proceed to harbour pay"
						})
					})]
				})
			]
		})]
	});
}
function SiteShell({ children }) {
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh bg-ink text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollRoot, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "film-grain" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, { onOpenCart: () => setCartOpen(true) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {
				open: cartOpen,
				onClose: () => setCartOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				toastOptions: { style: {
					background: "#1c1712",
					color: "#e8dcc4",
					border: "1px solid rgba(201,164,76,0.3)",
					fontFamily: "Cinzel, serif"
				} }
			})
		]
	});
}
var styles_default = "/assets/styles-C9zo4y65.css";
var APP_NAME = "Voyage '26";
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Voyage '26 — a leadership development programme by AIESEC in IIT. Chart your course. Command your crew."
			},
			{
				name: "theme-color",
				content: "#0c0a08"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-ink text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$7 = () => import("./routes-Bz_g8pBR.mjs");
var Route$8 = createFileRoute("/")({
	loader: () => getHomeData(),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin-thE2n_OD.mjs");
var Route$7 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./checkout-CYsGcirL.mjs");
var Route$6 = createFileRoute("/checkout")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./login-Di6e8CIV.mjs");
var Route$5 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./register-DQJbrr4w.mjs");
var Route$4 = createFileRoute("/register")({
	loader: async () => {
		const [site, paymentSettings] = await Promise.all([getSite(), getRegistrationPaymentSettings()]);
		return {
			site,
			paymentSettings
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./shop-DtZIC4Er.mjs");
var Route$3 = createFileRoute("/shop")({
	loader: () => listProducts(),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./order._id-BvtUeU4m.mjs");
var Route$2 = createFileRoute("/order/$id")({
	loader: ({ params }) => getOrder({ data: params.id }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./ticket._token-D7FVds3t.mjs");
var Route$1 = createFileRoute("/ticket/$token")({
	loader: ({ params }) => getTicketStatus({ data: params.token }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
async function handleAuth(request) {
	if (authConfigured && !process.env.MONGODB_URI?.trim()) return new Response("Authentication storage is not configured.", { status: 503 });
	return auth.handler(request);
}
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => handleAuth(request),
	POST: ({ request }) => handleAuth(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$8.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$9
	}),
	AdminRoute: Route$7.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$9
	}),
	CheckoutRoute: Route$6.update({
		id: "/checkout",
		path: "/checkout",
		getParentRoute: () => Route$9
	}),
	LoginRoute: Route$5.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$9
	}),
	RegisterRoute: Route$4.update({
		id: "/register",
		path: "/register",
		getParentRoute: () => Route$9
	}),
	ShopRoute: Route$3.update({
		id: "/shop",
		path: "/shop",
		getParentRoute: () => Route$9
	}),
	OrderIdRoute: Route$2.update({
		id: "/order/$id",
		path: "/order/$id",
		getParentRoute: () => Route$9
	}),
	TicketTokenRoute: Route$1.update({
		id: "/ticket/$token",
		path: "/ticket/$token",
		getParentRoute: () => Route$9
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$9
	})
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { upsertProduct as A, getPaymentSlip as C, updateRegistrationPaymentSettings as D, reviewRegistration as E, verifyAdminAccess as M, useCurrentUserState as N, updateSettings as O, getAdminTicketDetails as S, registerDelegate as T, delegateOptions as _, Route$4 as a, deleteSession as b, cartTotal as c, CompassRose as d, RopeDivider as f, createSsrRpc as g, checkInRegistration as h, Route$3 as i, upsertSession as j, upsertGallery as k, useCart as l, adminDashboard as m, Route$1 as n, Route$8 as o, SeaWaves as p, Route$2 as r, Button as s, router_exports as t, RedirectToSignIn as u, deleteGallery as v, placeOrder as w, exportRegistrations as x, deleteProduct as y };
