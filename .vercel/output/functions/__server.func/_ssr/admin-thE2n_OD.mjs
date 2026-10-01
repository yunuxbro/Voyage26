import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BCxQLEMm.mjs";
import { o as makeQrCodeUrl, r as formatInr } from "./utils-Dw4aI9KJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as upsertProduct, C as getPaymentSlip, D as updateRegistrationPaymentSettings, E as reviewRegistration, M as verifyAdminAccess, N as useCurrentUserState, O as updateSettings, _ as delegateOptions, b as deleteSession, g as createSsrRpc, j as upsertSession, k as upsertGallery, m as adminDashboard, s as Button, u as RedirectToSignIn, v as deleteGallery, x as exportRegistrations, y as deleteProduct } from "./router-BRS1F0Tu.mjs";
import { i as Textarea, n as Label, t as Input } from "./field-VT8cIc4L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-thE2n_OD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var uploadImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("0c5cfd404d205fdcd558981c9394fe457590f74443743c1ae9eec62d43ce1741"));
var encoder = new TextEncoder();
function xmlEscape(value) {
	return Array.from(value).filter((character) => {
		const codePoint = character.codePointAt(0) ?? 0;
		return codePoint === 9 || codePoint === 10 || codePoint === 13 || codePoint >= 32 && codePoint <= 55295 || codePoint >= 57344 && codePoint <= 65533 || codePoint >= 65536 && codePoint <= 1114111;
	}).join("").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function columnName(index) {
	let value = index;
	let name = "";
	while (value > 0) {
		const remainder = (value - 1) % 26;
		name = String.fromCharCode(65 + remainder) + name;
		value = Math.floor((value - 1) / 26);
	}
	return name;
}
function cellXml(reference, value) {
	if (value === null || value === void 0 || value === "") return "";
	if (typeof value === "number" && Number.isFinite(value)) return `<c r="${reference}"><v>${value}</v></c>`;
	return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(String(value))}</t></is></c>`;
}
function crc32(bytes) {
	let crc = 4294967295;
	for (const byte of bytes) {
		crc ^= byte;
		for (let bit = 0; bit < 8; bit += 1) crc = (crc & 1) === 1 ? crc >>> 1 ^ 3988292384 : crc >>> 1;
	}
	return (crc ^ 4294967295) >>> 0;
}
function concatBytes(parts) {
	const result = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
	let offset = 0;
	for (const part of parts) {
		result.set(part, offset);
		offset += part.length;
	}
	return result;
}
function makeZip(files) {
	const entries = [];
	const localParts = [];
	let offset = 0;
	for (const file of files) {
		const name = encoder.encode(file.name);
		const bytes = encoder.encode(file.content);
		const crc = crc32(bytes);
		const header = new Uint8Array(30 + name.length);
		const view = new DataView(header.buffer);
		view.setUint32(0, 67324752, true);
		view.setUint16(4, 20, true);
		view.setUint16(6, 0, true);
		view.setUint16(8, 0, true);
		view.setUint16(10, 0, true);
		view.setUint16(12, 33, true);
		view.setUint32(14, crc, true);
		view.setUint32(18, bytes.length, true);
		view.setUint32(22, bytes.length, true);
		view.setUint16(26, name.length, true);
		view.setUint16(28, 0, true);
		header.set(name, 30);
		entries.push({
			name: file.name,
			bytes,
			crc,
			offset
		});
		localParts.push(header, bytes);
		offset += header.length + bytes.length;
	}
	const centralOffset = offset;
	const centralDirectory = concatBytes(entries.map((entry) => {
		const name = encoder.encode(entry.name);
		const header = new Uint8Array(46 + name.length);
		const view = new DataView(header.buffer);
		view.setUint32(0, 33639248, true);
		view.setUint16(4, 20, true);
		view.setUint16(6, 20, true);
		view.setUint16(8, 0, true);
		view.setUint16(10, 0, true);
		view.setUint16(12, 0, true);
		view.setUint16(14, 33, true);
		view.setUint32(16, entry.crc, true);
		view.setUint32(20, entry.bytes.length, true);
		view.setUint32(24, entry.bytes.length, true);
		view.setUint16(28, name.length, true);
		view.setUint16(30, 0, true);
		view.setUint16(32, 0, true);
		view.setUint16(34, 0, true);
		view.setUint16(36, 0, true);
		view.setUint32(38, 0, true);
		view.setUint32(42, entry.offset, true);
		header.set(name, 46);
		return header;
	}));
	const end = /* @__PURE__ */ new Uint8Array(22);
	const endView = new DataView(end.buffer);
	endView.setUint32(0, 101010256, true);
	endView.setUint16(4, 0, true);
	endView.setUint16(6, 0, true);
	endView.setUint16(8, entries.length, true);
	endView.setUint16(10, entries.length, true);
	endView.setUint32(12, centralDirectory.length, true);
	endView.setUint32(16, centralOffset, true);
	endView.setUint16(20, 0, true);
	return concatBytes([
		...localParts,
		centralDirectory,
		end
	]);
}
function createXlsxWorkbook(headers, rows) {
	return makeZip([
		{
			name: "[Content_Types].xml",
			content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`
		},
		{
			name: "_rels/.rels",
			content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`
		},
		{
			name: "xl/workbook.xml",
			content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Registrations" sheetId="1" r:id="rId1"/></sheets></workbook>`
		},
		{
			name: "xl/_rels/workbook.xml.rels",
			content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`
		},
		{
			name: "xl/worksheets/sheet1.xml",
			content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${[headers, ...rows].map((values, rowIndex) => {
				const cells = values.map((value, columnIndex) => cellXml(`${columnName(columnIndex + 1)}${rowIndex + 1}`, value)).join("");
				return `<row r="${rowIndex + 1}">${cells}</row>`;
			}).join("")}</sheetData></worksheet>`
		}
	]);
}
function AdminPage() {
	const { user, isPending } = useCurrentUserState();
	const [securityCodeVerified, setSecurityCodeVerified] = (0, import_react.useState)(false);
	const [securityInput, setSecurityInput] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("settings");
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (isPending || !user || !securityCodeVerified) return;
		let cancelled = false;
		setLoading(true);
		adminDashboard().then((next) => {
			if (!cancelled) setData(next);
		}).catch((err) => toast.error(err instanceof Error ? err.message : "Could not load.")).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [
		isPending,
		user,
		securityCodeVerified
	]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-16 text-muted",
		children: "Unfurling the charts…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function handleSecurityCodeSubmit(e) {
		e.preventDefault();
		try {
			await verifyAdminAccess({ data: { code: securityInput } });
			setSecurityCodeVerified(true);
			setSecurityInput("");
			toast.success("Access granted.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Invalid security code.");
			setSecurityInput("");
		}
	}
	if (!securityCodeVerified) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
				children: "Quartermaster"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-3 text-display-sm text-parchment",
				children: "Verify Access"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Enter the server-configured admin code to access applicant and payment details."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 grid gap-4",
				onSubmit: handleSecurityCodeSubmit,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "securityCode",
					children: "Security Code"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "securityCode",
					type: "password",
					value: securityInput,
					onChange: (e) => setSecurityInput(e.target.value),
					placeholder: "Enter code",
					required: true
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "lg",
					children: "Unlock"
				})]
			})
		]
	});
	if (loading && !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-16 text-muted",
		children: "Loading the admin log…"
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-16 text-muted",
		children: "Nothing in the log."
	});
	const tabs = [
		{
			id: "settings",
			label: "Settings"
		},
		{
			id: "payments",
			label: "Payments"
		},
		{
			id: "shop",
			label: "Store"
		},
		{
			id: "gallery",
			label: "Gallery"
		},
		{
			id: "log",
			label: "Watches"
		},
		{
			id: "berths",
			label: "Berths"
		},
		{
			id: "orders",
			label: "Orders"
		}
	];
	async function exportRegistrationsXlsx() {
		try {
			const rows = await exportRegistrations();
			const workbook = createXlsxWorkbook([
				"Name",
				"Email",
				"IIT email",
				"Phone",
				"Package",
				"Amount due (INR)",
				"Amount paid (INR)",
				"Payment status",
				"Payment reference",
				"Submitted at",
				"Reviewed at",
				"Checked in at"
			], rows.map((row) => [
				row.full_name,
				row.email,
				row.iit_email,
				row.phone,
				row.delegate_option,
				row.amount_cents / 100,
				row.amount_paid_cents / 100,
				row.payment_status,
				row.payment_ref,
				row.payment_submitted_at ?? row.created_at,
				row.payment_reviewed_at,
				row.checked_in_at
			]));
			const workbookBuffer = workbook.buffer.slice(workbook.byteOffset, workbook.byteOffset + workbook.byteLength);
			const blob = new Blob([workbookBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = "voyage-registrations.xlsx";
			anchor.click();
			URL.revokeObjectURL(url);
			toast.success(`Exported ${rows.length} registrations.`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not export registrations.");
		}
	}
	async function refresh() {
		const next = await adminDashboard();
		setData(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
				children: "Quartermaster"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-display-sm text-parchment",
				children: "Change the voyage"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Signed in as ",
					user.displayName ?? user.primaryEmail,
					". Event date, copy, cargo and the gallery all live here."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: tabs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(item.id),
						className: tab === item.id ? "h-10 rounded-[10px] bg-gold px-3 text-sm text-ink" : "h-10 rounded-[10px] px-3 text-sm text-gold shadow-[0_0_0_1px_rgb(201_164_76_/_0.3)]",
						children: item.label
					}, item.id))
				}), tab === "berths" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => void exportRegistrationsXlsx(),
					children: "Export Excel"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [
					tab === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsForm, {
						site: data.site,
						onSaved: refresh
					}) : null,
					tab === "payments" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentSettingsForm, {
						settings: data.paymentSettings,
						onSaved: refresh
					}) : null,
					tab === "shop" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsAdmin, {
						products: data.products,
						onSaved: refresh
					}) : null,
					tab === "gallery" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryAdmin, {
						items: data.gallery,
						onSaved: refresh
					}) : null,
					tab === "log" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionsAdmin, {
						sessions: data.sessions,
						onSaved: refresh
					}) : null,
					tab === "berths" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-[20px] bg-wood shadow-[0_0_0_1px_rgb(201_164_76_/_0.18)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[1120px] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-[0.65rem] tracking-[0.16em] text-gold uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Package"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Due / paid"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Review"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Ref"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Slip"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "QR"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Action"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.registrations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-6 text-muted",
								colSpan: 9,
								children: "No registrations yet."
							}) }) : data.registrations.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-gold/10 align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-parchment",
										children: row.full_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 text-muted",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: row.email }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-xs",
												children: row.iit_email
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-xs",
												children: row.phone
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted",
										children: row.delegate_option
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 tabular-nums",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-parchment",
											children: formatInr(row.amount_cents)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 text-xs text-gold",
											children: [formatInr(row.amount_paid_cents), " verified"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-parchment",
												children: row.payment_status
											}),
											row.payment_status === "submitted" && row.payment_submitted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: Date.now() - new Date(row.payment_submitted_at).getTime() > 864e5 ? "mt-1 text-xs text-red-300" : "mt-1 text-xs text-muted",
												children: ["Submitted ", new Date(row.payment_submitted_at).toLocaleString("en-IN")]
											}) : null,
											row.payment_review_note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 max-w-48 text-xs text-muted",
												children: row.payment_review_note
											}) : null
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted",
										children: row.payment_ref
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: row.has_payment_slip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlipDownload, { registrationId: row.id }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted",
											children: "No slip"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketQr, { ticketToken: row.ticket_token })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegistrationReview, {
											registration: row,
											onSaved: refresh
										})
									})
								]
							}, row.id)) })]
						})
					}) : null,
					tab === "orders" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-[20px] bg-wood shadow-[0_0_0_1px_rgb(201_164_76_/_0.18)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[720px] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-[0.65rem] tracking-[0.16em] text-gold uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Order"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Prize"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Status"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-6 text-muted",
								colSpan: 5,
								children: "No prizes taken."
							}) }) : data.orders.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-gold/10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-gold",
										children: row.public_id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-parchment",
										children: row.customer_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted",
										children: row.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 tabular-nums text-gold",
										children: formatInr(row.amount_cents)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted",
										children: row.payment_status
									})
								]
							}, row.id)) })]
						})
					}) : null
				]
			})
		]
	});
}
function toLocalInput(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function PaymentSettingsForm({ settings, onSaved }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [imageBusy, setImageBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(() => ({
		accountHolder: settings?.account_holder ?? "",
		bankName: settings?.bank_name ?? "",
		accountNumber: settings?.account_number ?? "",
		ifscCode: settings?.ifsc_code ?? "",
		upiId: settings?.upi_id ?? "",
		registrationImageUrl: settings?.registration_image_url ?? "",
		packagePricesRupees: Object.fromEntries(delegateOptions.map((option) => [option, (settings?.package_prices[option] ?? 0) / 100]))
	}));
	async function uploadRegistrationImage(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 5242880) {
			toast.error("Images must be smaller than 5 MB.");
			return;
		}
		setImageBusy(true);
		try {
			const bytes = new Uint8Array(await file.arrayBuffer());
			let binary = "";
			for (let offset = 0; offset < bytes.length; offset += 32768) binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
			const result = await uploadImage({ data: {
				base64: btoa(binary),
				mimeType: file.type
			} });
			setForm((current) => ({
				...current,
				registrationImageUrl: result.url
			}));
			toast.success("Registration image uploaded.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not upload image.");
		} finally {
			setImageBusy(false);
		}
	}
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await updateRegistrationPaymentSettings({ data: form });
			toast.success("Transfer details and package prices saved.");
			await onSaved();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save payment settings.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid max-w-3xl gap-5",
		onSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-parchment",
				children: "Bank transfer details"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "These details appear on the public registration form. New registrations stay closed until every package has a price."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "accountHolder",
						children: "Account holder"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "accountHolder",
						value: form.accountHolder,
						onChange: (e) => setForm({
							...form,
							accountHolder: e.target.value
						}),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "bankName",
						children: "Bank name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "bankName",
						value: form.bankName,
						onChange: (e) => setForm({
							...form,
							bankName: e.target.value
						}),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "accountNumber",
						children: "Account number"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "accountNumber",
						inputMode: "numeric",
						value: form.accountNumber,
						onChange: (e) => setForm({
							...form,
							accountNumber: e.target.value
						}),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "ifscCode",
						children: "IFSC code"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "ifscCode",
						value: form.ifscCode,
						onChange: (e) => setForm({
							...form,
							ifscCode: e.target.value.toUpperCase()
						}),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "upiId",
							children: "UPI ID (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "upiId",
							value: form.upiId,
							onChange: (e) => setForm({
								...form,
								upiId: e.target.value
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-gold/20 pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl text-parchment",
					children: "Package prices"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2",
					children: delegateOptions.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						htmlFor: `price-${option}`,
						children: [option, " (INR)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: `price-${option}`,
						type: "number",
						min: option === "Register only" ? "0" : "0.01",
						step: "0.01",
						value: form.packagePricesRupees[option],
						onChange: (e) => setForm({
							...form,
							packagePricesRupees: {
								...form.packagePricesRupees,
								[option]: Number(e.target.value)
							}
						}),
						required: true
					})] }, option))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-gold/20 pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "registrationImage",
						children: "Registration or payment image (PNG, JPEG, WebP, or GIF; max 5 MB)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "registrationImage",
						type: "file",
						accept: "image/png,image/jpeg,image/webp,image/gif",
						onChange: uploadRegistrationImage,
						disabled: imageBusy
					}),
					imageBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "Uploading…"
					}) : null,
					form.registrationImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: form.registrationImageUrl,
						alt: "Registration or payment image preview",
						className: "mt-3 aspect-[3/1] w-full object-cover"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: busy,
				children: busy ? "Saving…" : "Save payment settings"
			})
		]
	});
}
function SlipDownload({ registrationId }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function download() {
		setBusy(true);
		try {
			const slip = await getPaymentSlip({ data: registrationId });
			const binary = atob(slip.base64);
			const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
			const url = URL.createObjectURL(new Blob([bytes], { type: slip.contentType }));
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = slip.fileName;
			anchor.click();
			window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not retrieve slip.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		size: "sm",
		variant: "outline",
		disabled: busy,
		onClick: () => void download(),
		children: busy ? "Loading…" : "Download"
	});
}
function TicketQr({ ticketToken }) {
	const [qr, setQr] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const url = `${window.location.origin}/ticket/${ticketToken}`;
		setQr(makeQrCodeUrl(url, "120x120"));
	}, [ticketToken]);
	return qr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: `/ticket/${ticketToken}`,
		"aria-label": "Open ticket lookup",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: qr,
			alt: "Ticket QR code",
			className: "h-20 w-20 bg-white p-1"
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted",
		children: "Preparing…"
	});
}
function RegistrationReview({ registration, onSaved }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [amountPaid, setAmountPaid] = (0, import_react.useState)(registration.amount_cents / 100);
	const [note, setNote] = (0, import_react.useState)("");
	async function submit(action) {
		setBusy(true);
		try {
			await reviewRegistration({ data: {
				registrationId: registration.id,
				action,
				amountPaidRupees: amountPaid,
				note
			} });
			toast.success(action === "approve" ? "Registration approved." : "Registration rejected.");
			await onSaved();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update review status.");
		} finally {
			setBusy(false);
		}
	}
	if (registration.payment_status !== "submitted") return registration.checked_in_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-gold",
		children: "Checked in"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted",
		children: "Reviewed"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid w-44 gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: `paid-${registration.id}`,
				children: "Verified amount (INR)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: `paid-${registration.id}`,
				type: "number",
				min: "0",
				step: "0.01",
				value: amountPaid,
				onChange: (e) => setAmountPaid(Number(e.target.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				"aria-label": "Review note",
				placeholder: "Optional review note",
				value: note,
				onChange: (e) => setNote(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					disabled: busy,
					onClick: () => void submit("approve"),
					children: "Approve"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "wine",
					disabled: busy,
					onClick: () => void submit("reject"),
					children: "Reject"
				})]
			})
		]
	});
}
function SettingsForm({ site, onSaved }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		eventTitle: site.event_title,
		tagline: site.tagline,
		description: site.description,
		aboutText: site.about_text,
		venue: site.venue,
		eventStartsAt: toLocalInput(site.event_starts_at),
		registrationFeeRupees: site.registration_fee_cents / 100
	});
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await updateSettings({ data: {
				...form,
				eventStartsAt: new Date(form.eventStartsAt).toISOString()
			} });
			toast.success("Charts updated.");
			await onSaved();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid max-w-2xl gap-4",
		onSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "eventTitle",
				children: "Event title"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "eventTitle",
				value: form.eventTitle,
				onChange: (e) => setForm({
					...form,
					eventTitle: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "tagline",
				children: "Tagline"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "tagline",
				value: form.tagline,
				onChange: (e) => setForm({
					...form,
					tagline: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "venue",
				children: "Venue"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "venue",
				value: form.venue,
				onChange: (e) => setForm({
					...form,
					venue: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "starts",
					children: "Event starts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "starts",
					type: "datetime-local",
					value: form.eventStartsAt,
					onChange: (e) => setForm({
						...form,
						eventStartsAt: e.target.value
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "fee",
					children: "Registration fee (₹)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "fee",
					type: "number",
					min: 0,
					step: "1",
					value: form.registrationFeeRupees,
					onChange: (e) => setForm({
						...form,
						registrationFeeRupees: Number(e.target.value)
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "description",
				children: "Short description"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "description",
				value: form.description,
				onChange: (e) => setForm({
					...form,
					description: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "about",
				children: "About"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "about",
				className: "min-h-40",
				value: form.aboutText,
				onChange: (e) => setForm({
					...form,
					aboutText: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: busy,
				children: busy ? "Saving…" : "Save settings"
			})
		]
	});
}
function ProductsAdmin({ products, onSaved }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRow, {
			product,
			onSaved
		}, product.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRow, { onSaved })]
	});
}
function ProductRow({ product, onSaved }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		slug: product?.slug ?? "",
		name: product?.name ?? "",
		description: product?.description ?? "",
		priceRupees: (product?.price_cents ?? 0) / 100,
		imageUrl: product?.image_url ?? "/images/product-tee.jpg",
		stock: product?.stock ?? 20,
		active: product?.active ?? true,
		sortOrder: product?.sort_order ?? 10
	});
	async function save() {
		setBusy(true);
		try {
			await upsertProduct({ data: {
				...form,
				id: product?.id
			} });
			toast.success("Cargo updated.");
			await onSaved();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 rounded-[20px] bg-wood p-4 shadow-[0_0_0_1px_rgb(201_164_76_/_0.16)] sm:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Name",
				value: form.name,
				onChange: (e) => setForm({
					...form,
					name: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "slug",
				value: form.slug,
				onChange: (e) => setForm({
					...form,
					slug: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "sm:col-span-2 min-h-20",
				value: form.description,
				onChange: (e) => setForm({
					...form,
					description: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Image URL",
				value: form.imageUrl,
				onChange: (e) => setForm({
					...form,
					imageUrl: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: form.priceRupees,
						onChange: (e) => setForm({
							...form,
							priceRupees: Number(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: form.stock,
						onChange: (e) => setForm({
							...form,
							stock: Number(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: form.sortOrder,
						onChange: (e) => setForm({
							...form,
							sortOrder: Number(e.target.value)
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex h-11 items-center gap-2 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: form.active,
					onChange: (e) => setForm({
						...form,
						active: e.target.checked
					})
				}), "Active"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					disabled: busy,
					children: product ? "Save" : "Add cargo"
				}), product ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "wine",
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							await deleteProduct({ data: product.id });
							toast.success("Removed.");
							await onSaved();
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "Could not delete.");
						} finally {
							setBusy(false);
						}
					},
					children: "Delete"
				}) : null]
			})
		]
	});
}
function GalleryAdmin({ items, onSaved }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryRow, {
			item,
			onSaved
		}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryRow, { onSaved })]
	});
}
function GalleryRow({ item, onSaved }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)(item?.image_url ?? null);
	const [form, setForm] = (0, import_react.useState)({
		imageUrl: item?.image_url ?? "",
		caption: item?.caption ?? "",
		sortOrder: item?.sort_order ?? 10
	});
	async function handleImageUpload(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		setBusy(true);
		try {
			const buffer = await file.arrayBuffer();
			const bytes = new Uint8Array(buffer);
			let binary = "";
			for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
			const { url } = await uploadImage({ data: {
				base64: btoa(binary),
				mimeType: file.type
			} });
			setForm({
				...form,
				imageUrl: url
			});
			setPreview(url);
			toast.success("Image uploaded.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not upload image.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 rounded-[20px] bg-wood p-4 shadow-[0_0_0_1px_rgb(201_164_76_/_0.16)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-2 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Image" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "file",
						accept: "image/*",
						onChange: handleImageUpload,
						disabled: busy
					})
				}),
				preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: preview,
					alt: "Preview",
					className: "mt-3 h-48 w-full rounded-lg object-cover"
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "caption",
					children: "Caption"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "caption",
					placeholder: "Image caption",
					value: form.caption,
					onChange: (e) => setForm({
						...form,
						caption: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "sortOrder",
					className: "mt-2 block",
					children: "Order"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "sortOrder",
					type: "number",
					value: form.sortOrder,
					onChange: (e) => setForm({
						...form,
						sortOrder: Number(e.target.value)
					})
				})
			] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				disabled: busy || !form.imageUrl,
				onClick: async () => {
					setBusy(true);
					try {
						await upsertGallery({ data: {
							...form,
							id: item?.id
						} });
						toast.success("Gallery updated.");
						await onSaved();
					} catch (err) {
						toast.error(err instanceof Error ? err.message : "Could not save.");
					} finally {
						setBusy(false);
					}
				},
				children: "Save"
			}), item ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "wine",
				disabled: busy,
				onClick: async () => {
					setBusy(true);
					try {
						await deleteGallery({ data: item.id });
						await onSaved();
					} catch (err) {
						toast.error(err instanceof Error ? err.message : "Could not delete.");
					} finally {
						setBusy(false);
					}
				},
				children: "Delete"
			}) : null]
		})]
	});
}
function SessionsAdmin({ sessions, onSaved }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [sessions.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionRow, {
			session,
			onSaved
		}, session.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionRow, { onSaved })]
	});
}
function SessionRow({ session, onSaved }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		title: session?.title ?? "",
		description: session?.description ?? "",
		dayLabel: session?.day_label ?? "",
		timeLabel: session?.time_label ?? "",
		sortOrder: session?.sort_order ?? 10
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 rounded-[20px] bg-wood p-4 shadow-[0_0_0_1px_rgb(201_164_76_/_0.16)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Watch name",
						value: form.dayLabel,
						onChange: (e) => setForm({
							...form,
							dayLabel: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Time",
						value: form.timeLabel,
						onChange: (e) => setForm({
							...form,
							timeLabel: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: form.sortOrder,
						onChange: (e) => setForm({
							...form,
							sortOrder: Number(e.target.value)
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Title",
				value: form.title,
				onChange: (e) => setForm({
					...form,
					title: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "min-h-20",
				value: form.description,
				onChange: (e) => setForm({
					...form,
					description: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							await upsertSession({ data: {
								...form,
								id: session?.id
							} });
							toast.success("Log updated.");
							await onSaved();
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "Could not save.");
						} finally {
							setBusy(false);
						}
					},
					children: "Save"
				}), session ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "wine",
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							await deleteSession({ data: session.id });
							await onSaved();
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "Could not delete.");
						} finally {
							setBusy(false);
						}
					},
					children: "Delete"
				}) : null]
			})
		]
	});
}
//#endregion
export { AdminPage as component };
