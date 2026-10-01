import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as formatInr } from "./utils-Dw4aI9KJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as cartTotal, l as useCart, s as Button, w as placeOrder } from "./router-BRS1F0Tu.mjs";
import { n as Label, t as Input } from "./field-VT8cIc4L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-CYsGcirL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CardFields({ value, onChange }) {
	const set = (patch) => onChange({
		...value,
		...patch
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[20px] bg-ink-2 p-5 shadow-[0_0_0_1px_rgb(201_164_76_/_0.2)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-gold",
				children: "Harbour Pay"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs leading-relaxed text-muted",
				children: "Card details are checked in this harbour and never written into the log. Use any valid test card — 4242 4242 4242 4242 works."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cardName",
						children: "Name on card"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cardName",
						autoComplete: "cc-name",
						value: value.cardName,
						onChange: (e) => set({ cardName: e.target.value }),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cardNumber",
						children: "Card number"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cardNumber",
						inputMode: "numeric",
						autoComplete: "cc-number",
						placeholder: "4242 4242 4242 4242",
						value: value.cardNumber,
						onChange: (e) => set({ cardNumber: e.target.value.replace(/[^\d ]/g, "").slice(0, 23) }),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cardExpiry",
							children: "Expiry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "cardExpiry",
							placeholder: "MM / YY",
							autoComplete: "cc-exp",
							value: value.cardExpiry,
							onChange: (e) => set({ cardExpiry: e.target.value.slice(0, 7) }),
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cardCvc",
							children: "CVC"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "cardCvc",
							inputMode: "numeric",
							autoComplete: "cc-csc",
							value: value.cardCvc,
							onChange: (e) => set({ cardCvc: e.target.value.replace(/\D/g, "").slice(0, 4) }),
							required: true
						})] })]
					})
				]
			})
		]
	});
}
function CheckoutPage() {
	const items = useCart((s) => s.items);
	const clear = useCart((s) => s.clear);
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		customerName: "",
		email: "",
		phone: "",
		addressLine: "",
		city: "",
		pincode: ""
	});
	const [card, setCard] = (0, import_react.useState)({
		cardName: "",
		cardNumber: "",
		cardExpiry: "",
		cardCvc: ""
	});
	const total = cartTotal(items);
	async function onSubmit(e) {
		e.preventDefault();
		if (!items.length) return;
		setBusy(true);
		try {
			const result = await placeOrder({ data: {
				...form,
				cardNumber: card.cardNumber,
				cardExpiry: card.cardExpiry,
				cardCvc: card.cardCvc,
				items: items.map((item) => ({
					productId: item.productId,
					qty: item.qty
				}))
			} });
			clear();
			toast.success("Order placed; payment is pending verification.");
			await navigate({
				to: "/order/$id",
				params: { id: result.publicId }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Payment failed.");
		} finally {
			setBusy(false);
		}
	}
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl text-parchment",
				children: "The hold is empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Visit the store before you pay harbour dues."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-6 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Ship's store" })
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_20rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
				children: "Harbour pay"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-display-sm text-parchment",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 grid gap-4",
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "customerName",
							children: "Full name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "customerName",
							value: form.customerName,
							onChange: (e) => setForm({
								...form,
								customerName: e.target.value
							}),
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							value: form.email,
							onChange: (e) => setForm({
								...form,
								email: e.target.value
							}),
							required: true
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "phone",
						children: "Phone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "phone",
						value: form.phone,
						onChange: (e) => setForm({
							...form,
							phone: e.target.value
						}),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "address",
						children: "Address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "address",
						value: form.addressLine,
						onChange: (e) => setForm({
							...form,
							addressLine: e.target.value
						}),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "city",
							children: "City"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "city",
							value: form.city,
							onChange: (e) => setForm({
								...form,
								city: e.target.value
							}),
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "pincode",
							children: "Pincode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "pincode",
							value: form.pincode,
							onChange: (e) => setForm({
								...form,
								pincode: e.target.value
							}),
							required: true
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFields, {
						value: card,
						onChange: setCard
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						disabled: busy,
						children: busy ? "Clearing the harbour…" : `Pay ${formatInr(total)}`
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "h-fit rounded-[24px] bg-wood p-5 shadow-[0_0_0_1px_rgb(201_164_76_/_0.2)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-gold",
					children: "Manifest"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-parchment",
							children: [
								item.name,
								" × ",
								item.qty
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gold tabular-nums",
							children: formatInr(item.priceCents * item.qty)
						})]
					}, item.productId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex justify-between border-t border-gold/20 pt-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Prize"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gold tabular-nums",
						children: formatInr(total)
					})]
				})
			]
		})]
	});
}
//#endregion
export { CheckoutPage as component };
