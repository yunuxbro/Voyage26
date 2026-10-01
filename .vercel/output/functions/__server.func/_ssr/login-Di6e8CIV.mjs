import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-BFO8oNK4.mjs";
import { t as GROK_PROVIDERS } from "./server-Dz7CktS8.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { N as useCurrentUserState, d as CompassRose, s as Button } from "./router-BRS1F0Tu.mjs";
import { n as Label, t as Input } from "./field-VT8cIc4L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Di6e8CIV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!isPending && user) navigate({ to: "/admin" });
	async function onEmail(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "up") {
				const { error } = await authClient.signUp.email({
					email,
					password,
					name: name.trim() || email.split("@")[0] || "Captain"
				});
				if (error) throw new Error(error.message ?? "Could not sign up.");
			} else {
				const { error } = await authClient.signIn.email({
					email,
					password
				});
				if (error) throw new Error(error.message ?? "Could not sign in.");
			}
			toast.success("Welcome aboard.");
			await navigate({ to: "/admin" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Sign-in failed.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid min-h-[80dvh] max-w-md place-items-center px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full rounded-[24px] bg-wood p-6 shadow-[0_0_0_1px_rgb(201_164_76_/_0.25)] sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompassRose, { className: "mx-auto size-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-4 text-center text-2xl text-gold",
					children: mode === "in" ? "Sign in" : "Create an account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-sm text-muted",
					children: "Officers of the fleet use this hatch. Delegates register on the public berth."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 grid gap-3",
						onSubmit: onEmail,
						children: [
							mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								value: name,
								onChange: (e) => setName(e.target.value),
								autoComplete: "name"
							})] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								autoComplete: "email",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								autoComplete: mode === "up" ? "new-password" : "current-password",
								minLength: 8,
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "mt-2 w-full",
								disabled: busy,
								children: busy ? "Holding…" : mode === "in" ? "Sign in" : "Sign up"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-3 w-full text-center text-sm text-gold hover:text-gold-2",
						onClick: () => setMode(mode === "in" ? "up" : "in"),
						children: mode === "in" ? "Need an account? Sign up" : "Already have an account? Sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-5 flex items-center gap-3 text-[0.65rem] tracking-[0.2em] text-muted uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-gold/20" }),
							"Or",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-gold/20" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "w-full",
							onClick: () => signIn(p.providerId, { callbackURL: "/admin" }),
							children: ["Continue with ", p.label]
						}, p.providerId))
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-center text-xs text-muted",
					children: [
						"Looking for a berth?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: "text-gold",
							children: "Register as a delegate"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { Login as component };
