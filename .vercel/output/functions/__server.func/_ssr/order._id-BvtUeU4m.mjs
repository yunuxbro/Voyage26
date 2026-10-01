import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as formatInr } from "./utils-Dw4aI9KJ.mjs";
import { r as Route$2, s as Button } from "./router-BRS1F0Tu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._id-BvtUeU4m.js
var import_jsx_runtime = require_jsx_runtime();
function OrderPage() {
	const data = Route$2.useLoaderData();
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl text-parchment",
			children: "No such prize"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "That order is not in the log."
		})]
	});
	const { order, items } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
				children: "Taken"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-3xl text-parchment",
				children: "Order received"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display tracking-[0.16em] text-gold",
				children: order.public_id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					"Amount ",
					formatInr(order.amount_cents),
					" · payment ",
					order.payment_status,
					" · ref ",
					order.payment_ref
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-3 rounded-[20px] bg-wood p-5 shadow-[0_0_0_1px_rgb(201_164_76_/_0.2)]",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						item.name,
						" × ",
						item.qty
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gold tabular-nums",
						children: formatInr(item.unit_price_cents * item.qty)
					})]
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					order.customer_name,
					" · ",
					order.address_line,
					", ",
					order.city,
					" ",
					order.pincode
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-8 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					children: "Return to the store"
				})
			})
		]
	});
}
//#endregion
export { OrderPage as component };
