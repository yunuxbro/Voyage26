import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as formatInr } from "./utils-Dw4aI9KJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Route$3, l as useCart, s as Button } from "./router-BRS1F0Tu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-DtZIC4Er.js
var import_jsx_runtime = require_jsx_runtime();
function ShopPage() {
	const products = Route$3.useLoaderData();
	const add = useCart((s) => s.add);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
				children: "Ship's store"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-display-sm text-parchment",
				children: "Cargo for the crossing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
				children: "Tees, compasses, journals — kit issued in the spirit of a privateer company. Harbour Pay at checkout. Stock is finite."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "flex flex-col overflow-hidden rounded-[24px] bg-wood shadow-[0_0_0_1px_rgb(201_164_76_/_0.18)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image_url,
						alt: product.name,
						className: "framed h-64 w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl text-parchment",
								children: product.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 flex-1 text-sm leading-relaxed text-muted",
								children: product.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gold tabular-nums",
									children: formatInr(product.price_cents)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [product.stock, " in hold"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-4 w-full",
								disabled: product.stock < 1,
								onClick: () => {
									add({
										productId: product.id,
										name: product.name,
										priceCents: product.price_cents,
										imageUrl: product.image_url
									});
									toast.success(`${product.name} added to the hold.`);
								},
								children: product.stock < 1 ? "Sold out" : "Add to hold"
							})
						]
					})]
				}, product.id))
			})
		]
	});
}
//#endregion
export { ShopPage as component };
