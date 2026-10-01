import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as makeQrCodeUrl, r as formatInr } from "./utils-Dw4aI9KJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as registerDelegate, _ as delegateOptions, a as Route$4, s as Button } from "./router-BRS1F0Tu.mjs";
import { n as Label, r as Select, t as Input } from "./field-VT8cIc4L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-DQJbrr4w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const { site, paymentSettings } = Route$4.useLoaderData();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [receipt, setReceipt] = (0, import_react.useState)(null);
	const [ticketQr, setTicketQr] = (0, import_react.useState)("");
	const [slipFile, setSlipFile] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		email: "",
		iitEmail: "",
		phone: "",
		delegateOption: delegateOptions[0]
	});
	const selectedAmount = paymentSettings.package_prices[form.delegateOption] ?? 0;
	const registrationOpen = Boolean(paymentSettings.account_holder && paymentSettings.bank_name && paymentSettings.account_number && paymentSettings.ifsc_code && delegateOptions.every((option) => option === "Register only" ? paymentSettings.package_prices[option] >= 0 : paymentSettings.package_prices[option] > 0));
	(0, import_react.useEffect)(() => {
		if (!receipt) return;
		const ticketUrl = `${window.location.origin}/ticket/${receipt.ticketToken}`;
		setTicketQr(makeQrCodeUrl(ticketUrl, "240x240"));
	}, [receipt]);
	async function onSubmit(e) {
		e.preventDefault();
		if (selectedAmount > 0 && !slipFile) {
			toast.error("Upload your bank transfer slip to continue.");
			return;
		}
		if (slipFile && slipFile.size > 2097152) {
			toast.error("Payment slips must be smaller than 2 MB.");
			return;
		}
		setBusy(true);
		try {
			let slipBase64 = "";
			if (slipFile) {
				const bytes = new Uint8Array(await slipFile.arrayBuffer());
				let binary = "";
				for (let offset = 0; offset < bytes.length; offset += 32768) binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
				slipBase64 = btoa(binary);
			}
			const result = await registerDelegate({ data: {
				fullName: form.fullName,
				email: form.email,
				iitEmail: form.iitEmail,
				phone: form.phone,
				delegateOption: form.delegateOption,
				slipBase64,
				slipContentType: slipFile?.type ?? "",
				slipFileName: slipFile?.name ?? ""
			} });
			setReceipt(result);
			toast.success("Registration submitted.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Registration failed.");
		} finally {
			setBusy(false);
		}
	}
	if (receipt) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-3xl gap-8 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-[1fr_auto] md:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
				children: "Registration submitted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-3 text-display-sm text-parchment",
				children: "Your berth is pending approval"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted",
				children: receipt.amountCents > 0 ? "We have your registration and transfer slip. The team will review the payment within 24 hours." : "Your registration is in the review queue. The team will review it within 24 hours."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-7 grid gap-3 border-y border-gold/20 py-5 text-sm sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-muted",
					children: "Payment reference"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-1 text-parchment",
					children: receipt.paymentRef
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-muted",
					children: "Package amount"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-1 text-gold",
					children: formatInr(receipt.amountCents)
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-xs leading-relaxed text-muted",
				children: "Keep this ticket for check-in. Your QR links to a protected ticket lookup; applicant details are visible to authorized admins only."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid justify-items-center gap-3",
			children: [ticketQr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: ticketQr,
				alt: "Registration ticket QR code",
				className: "h-60 w-60 bg-white p-2"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-60 w-60 animate-pulse bg-wood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs tracking-[0.16em] text-gold",
				children: receipt.paymentRef
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
				children: "Delegate registration"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display mt-2 text-display-sm text-parchment",
				children: ["Take a berth on ", site.event_title]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: [site.venue, ". Choose a merchandise package or register without one."]
			}),
			paymentSettings.registration_image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: paymentSettings.registration_image_url,
				alt: "Voyage registration details",
				className: "mt-6 aspect-[3/1] w-full object-cover"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 grid gap-4",
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "fullName",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "fullName",
							value: form.fullName,
							onChange: (e) => setForm({
								...form,
								fullName: e.target.value
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "iitEmail",
							children: "Email address (IIT email if you are an IITian)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "iitEmail",
							type: "email",
							value: form.iitEmail,
							onChange: (e) => setForm({
								...form,
								iitEmail: e.target.value
							}),
							placeholder: "name@iit…",
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "phone",
							children: "Phone number (WhatsApp preferred)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "phone",
							value: form.phone,
							onChange: (e) => setForm({
								...form,
								phone: e.target.value
							}),
							required: true
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "delegateOption",
						children: "Package"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "delegateOption",
						value: form.delegateOption,
						onChange: (e) => setForm({
							...form,
							delegateOption: e.target.value
						}),
						required: true,
						children: delegateOptions.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: option,
							children: [
								option === "Register only" ? "Register only (no merchandise)" : option,
								" - ",
								formatInr(paymentSettings.package_prices[option])
							]
						}, option))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-3 border-y border-gold/20 py-5",
						"aria-labelledby": "transfer-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "transfer-heading",
							className: "font-display text-xl text-parchment",
							children: "Bank transfer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: selectedAmount > 0 ? "Transfer the exact package amount, then attach the receipt below." : "No package payment is due for this selection."
						})] }), registrationOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid gap-2 text-sm sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Account name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-parchment",
									children: paymentSettings.account_holder
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Bank"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-parchment",
									children: paymentSettings.bank_name
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Account number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-parchment",
									children: paymentSettings.account_number
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "IFSC"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-parchment",
									children: paymentSettings.ifsc_code
								})] }),
								paymentSettings.upi_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "UPI ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-parchment",
									children: paymentSettings.upi_id
								})] }) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Amount due"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium text-gold",
									children: formatInr(selectedAmount)
								})] })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Registration is temporarily closed while transfer details and package prices are configured."
						})]
					}),
					selectedAmount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "paymentSlip",
							children: "Bank transfer slip (PDF, PNG, or JPEG; max 2 MB)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "paymentSlip",
							type: "file",
							accept: "application/pdf,image/png,image/jpeg",
							onChange: (e) => setSlipFile(e.target.files?.[0] ?? null),
							required: selectedAmount > 0
						}),
						slipFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted",
							children: ["Selected: ", slipFile.name]
						}) : null
					] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						disabled: busy || !registrationOpen,
						children: busy ? "Submitting…" : "Submit registration"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-muted",
						children: "Submissions are reviewed by the admin team within 24 hours."
					})
				]
			})
		]
	});
}
//#endregion
export { RegisterPage as component };
