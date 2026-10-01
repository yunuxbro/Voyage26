import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as formatInr } from "./utils-Dw4aI9KJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { M as verifyAdminAccess, N as useCurrentUserState, S as getAdminTicketDetails, h as checkInRegistration, n as Route$1, s as Button } from "./router-BRS1F0Tu.mjs";
import { n as Label, t as Input } from "./field-VT8cIc4L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ticket._token-D7FVds3t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TicketPage() {
	const { token } = Route$1.useParams();
	const status = Route$1.useLoaderData();
	const { user, isPending } = useCurrentUserState();
	const [adminCode, setAdminCode] = (0, import_react.useState)("");
	const [details, setDetails] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function unlock(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await verifyAdminAccess({ data: { code: adminCode } });
			const result = await getAdminTicketDetails({ data: token });
			setDetails(result);
			setAdminCode("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not open ticket details.");
		} finally {
			setBusy(false);
		}
	}
	async function checkIn() {
		setBusy(true);
		try {
			await checkInRegistration({ data: token });
			const result = await getAdminTicketDetails({ data: token });
			setDetails(result);
			toast.success("Delegate checked in.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not check in delegate.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
				children: "Voyage '26 ticket"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-display-sm text-parchment",
				children: "Registration lookup"
			}),
			!status.found ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 border-y border-gold/20 py-5 text-sm text-muted",
				children: "This ticket could not be found."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-6 grid gap-4 border-y border-gold/20 py-5 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs text-muted",
					children: "Payment review"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-1 text-parchment",
					children: status.paymentStatus
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs text-muted",
					children: "Check-in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-1 text-parchment",
					children: status.checkedIn ? "Checked in" : "Not checked in"
				})] })]
			}), details ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				"aria-labelledby": "applicant-details",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "applicant-details",
						className: "font-display text-2xl text-parchment",
						children: "Applicant details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-parchment",
								children: details.full_name
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Package"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-parchment",
								children: details.delegate_option
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 break-all text-parchment",
								children: details.email
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "IIT email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 break-all text-parchment",
								children: details.iit_email
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Phone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-parchment",
								children: details.phone
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Payment reference"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-parchment",
								children: details.payment_ref
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Amount due"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-parchment",
								children: formatInr(details.amount_cents)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Amount paid"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-gold",
								children: formatInr(details.amount_paid_cents)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Payment status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-parchment",
								children: details.payment_status
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Submitted"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-parchment",
								children: new Date(details.payment_submitted_at ?? details.created_at).toLocaleString("en-IN")
							})] })
						]
					}),
					details.payment_review_note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: ["Review note: ", details.payment_review_note]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8 border-t border-gold/20 pt-5",
						"aria-labelledby": "shop-purchases",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "shop-purchases",
							className: "font-display text-xl text-parchment",
							children: "Shop purchases"
						}), details.shopPurchases.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid gap-4",
							children: details.shopPurchases.map((purchase) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-gold/10 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap justify-between gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: purchase.publicId
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gold",
										children: formatInr(purchase.amountCents)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 grid gap-1 text-sm text-parchment",
									children: purchase.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										item.name,
										" × ",
										item.qty
									] }, `${purchase.publicId}-${item.name}`))
								})]
							}, purchase.publicId))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "No shop orders matched this delegate email."
						})]
					}),
					details.payment_status === "approved" && !details.checked_in_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-6",
						type: "button",
						disabled: busy,
						onClick: () => void checkIn(),
						children: busy ? "Checking in…" : "Check in delegate"
					}) : null,
					details.checked_in_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-sm text-gold",
						children: ["Checked in at ", new Date(details.checked_in_at).toLocaleString("en-IN")]
					}) : null
				]
			}) : isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: "Checking sign-in…"
			}) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 grid max-w-md gap-4",
				onSubmit: unlock,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "ticketAdminCode",
					children: "Admin code to view applicant and payment details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "ticketAdminCode",
					type: "password",
					value: adminCode,
					onChange: (e) => setAdminCode(e.target.value),
					required: true
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "Verifying…" : "View details"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "text-gold underline underline-offset-4",
					children: "Sign in"
				}), " with an authorized account to view applicant details."]
			})] })
		]
	});
}
//#endregion
export { TicketPage as component };
