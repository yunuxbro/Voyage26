import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BCxQLEMm.mjs";
import { a as luhnOk, i as last4, n as expiryValid, s as makeRef } from "./utils-Dw4aI9KJ.mjs";
import { n as require_lib } from "../_libs/@better-auth/mongo-adapter.mjs";
import { i as getPrivateFilesBucket, o as nextMongoId, r as getMongoDb } from "./mongo.server-1K_cavEN.mjs";
import { n as requireAdminSession, r as verifyAdminCode, t as createServerRpc } from "./admin-access.server-DNFrjnXp.mjs";
import { randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/mongo-voyage-Dv0ShHSB.js
var import_lib = require_lib();
var delegateOptions = [
	"Register only",
	"Delegate Pack",
	"T-shirt Only",
	"Mouse Pad Only",
	"Delegate Pack + Mouse Pad",
	"T-shirt + Mouse Pad"
];
function publicDocument(document) {
	const { _id: mongoId, ...data } = document;
	return data;
}
async function findOne(collectionName, filter) {
	const row = await (await getMongoDb()).collection(collectionName).findOne(filter);
	return row ? publicDocument(row) : null;
}
async function findMany(collectionName, filter = {}, sort = {}) {
	return (await (await getMongoDb()).collection(collectionName).find(filter).sort(sort).toArray()).map((row) => publicDocument(row));
}
function asIso(value) {
	if (value instanceof Date) return value.toISOString();
	return String(value ?? "");
}
function normalizeSite(row) {
	return {
		...row,
		event_starts_at: asIso(row.event_starts_at)
	};
}
function readPackagePrices(value) {
	const parsed = typeof value === "string" ? JSON.parse(value) : value;
	if (!parsed || typeof parsed !== "object") throw new Error("Package prices are not configured.");
	return Object.fromEntries(delegateOptions.map((option) => [option, Number(parsed[option] ?? 0)]));
}
function assertCard(cardNumber, expiry, cvc) {
	const digits = cardNumber.replace(/\D/g, "");
	if (!luhnOk(digits)) throw new Error("That card number does not look valid.");
	if (!expiryValid(expiry)) throw new Error("That expiry date is not valid.");
	if (!/^\d{3,4}$/.test(cvc.trim())) throw new Error("Enter a 3 or 4 digit CVC.");
	if (digits.startsWith("0000")) throw new Error("The harbour declined this card.");
}
var getSite_createServerFn_handler = createServerRpc({
	id: "6c06d451357dfa6f72ceec795f4424d91a4f7b3fe7dcefea9cafa360146f2ef9",
	name: "getSite",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => getSite.__executeServer(opts));
var getSite = createServerFn({ method: "GET" }).handler(getSite_createServerFn_handler, async () => {
	const row = await findOne("site_settings", { id: 1 });
	if (!row) throw new Error("Site settings missing.");
	return normalizeSite(row);
});
var listProducts_createServerFn_handler = createServerRpc({
	id: "0a9ac6b274bc8b6b9adc6340aedf7ed1c384867219dcf4cfa5c86b1698634799",
	name: "listProducts",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => listProducts.__executeServer(opts));
var listProducts = createServerFn({ method: "GET" }).handler(listProducts_createServerFn_handler, async () => findMany("products", { active: true }, {
	sort_order: 1,
	id: 1
}));
var listAllProducts_createServerFn_handler = createServerRpc({
	id: "fa1e4f4cd4f02404ba2c07c6828f479a4a886fe4b56126f4bcfd3fbb4b921057",
	name: "listAllProducts",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => listAllProducts.__executeServer(opts));
var listAllProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAllProducts_createServerFn_handler, async () => {
	requireAdminSession();
	return findMany("products", {}, {
		sort_order: 1,
		id: 1
	});
});
var listGallery_createServerFn_handler = createServerRpc({
	id: "d460408bef3c152451a3d50c769721d3065610a2af782513ab6cd347745d3830",
	name: "listGallery",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => listGallery.__executeServer(opts));
var listGallery = createServerFn({ method: "GET" }).handler(listGallery_createServerFn_handler, async () => findMany("gallery_items", {}, {
	sort_order: 1,
	id: 1
}));
var listSessions_createServerFn_handler = createServerRpc({
	id: "a8db7b14c2c35866ccc2ec26e8def748c21be45d588e605c56911b1a1b1e4a4b",
	name: "listSessions",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => listSessions.__executeServer(opts));
var listSessions = createServerFn({ method: "GET" }).handler(listSessions_createServerFn_handler, async () => findMany("event_sessions", {}, {
	sort_order: 1,
	id: 1
}));
var getHomeData_createServerFn_handler = createServerRpc({
	id: "20b4ee8f8cebfc40d17997ed81d2cfc5319a6d7b9fdaa17bc086467fe0f1ebd1",
	name: "getHomeData",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => getHomeData.__executeServer(opts));
var getHomeData = createServerFn({ method: "GET" }).handler(getHomeData_createServerFn_handler, async () => {
	const [site, products, gallery, sessions] = await Promise.all([
		findOne("site_settings", { id: 1 }),
		findMany("products", { active: true }, {
			sort_order: 1,
			id: 1
		}),
		findMany("gallery_items", {}, {
			sort_order: 1,
			id: 1
		}),
		findMany("event_sessions", {}, {
			sort_order: 1,
			id: 1
		})
	]);
	if (!site) throw new Error("Site settings missing.");
	return {
		site: normalizeSite(site),
		products,
		gallery,
		sessions
	};
});
var verifyAdminAccess_createServerFn_handler = createServerRpc({
	id: "97376eaa5784a8547320e6859c662828b37202db0d10cf358f0165be20d20e66",
	name: "verifyAdminAccess",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => verifyAdminAccess.__executeServer(opts));
var verifyAdminAccess = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(verifyAdminAccess_createServerFn_handler, async ({ data }) => {
	verifyAdminCode(data.code);
	return { ok: true };
});
var getRegistrationPaymentSettings_createServerFn_handler = createServerRpc({
	id: "3c379fec7960823c7310c781367d252cd065e1f53baf8c31426c94ccf35e3639",
	name: "getRegistrationPaymentSettings",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => getRegistrationPaymentSettings.__executeServer(opts));
var getRegistrationPaymentSettings = createServerFn({ method: "GET" }).handler(getRegistrationPaymentSettings_createServerFn_handler, async () => {
	const row = await findOne("registration_payment_settings", { id: 1 });
	if (!row) throw new Error("Payment settings are not available.");
	return {
		...row,
		package_prices: readPackagePrices(row.package_prices)
	};
});
async function saveSlip(registrationId, base64, contentType, fileName) {
	if (!(/* @__PURE__ */ new Set([
		"application/pdf",
		"image/png",
		"image/jpeg"
	])).has(contentType)) throw new Error("Upload a PDF, PNG, or JPEG payment slip.");
	if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) throw new Error("The payment slip could not be read.");
	const bytes = Buffer.from(base64, "base64");
	if (!bytes.length || bytes.length > 2097152) throw new Error("Payment slips must be smaller than 2 MB.");
	const isPdf = contentType === "application/pdf" && bytes.subarray(0, 4).toString() === "%PDF";
	const isPng = contentType === "image/png" && bytes.subarray(0, 8).equals(Buffer.from([
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	]));
	const isJpeg = contentType === "image/jpeg" && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
	if (!isPdf && !isPng && !isJpeg) throw new Error("The uploaded file does not match its file type.");
	const safeFileName = fileName.split(/[\\/]/).pop()?.replace(/[\r\n\0]/g, "").slice(0, 180) || "payment-slip";
	const fileId = new import_lib.ObjectId();
	const upload = (await getPrivateFilesBucket()).openUploadStream(safeFileName, {
		id: fileId,
		metadata: {
			purpose: "payment-slip",
			registrationId,
			contentType
		}
	});
	await new Promise((resolve, reject) => {
		upload.once("finish", resolve);
		upload.once("error", reject);
		upload.end(bytes);
	});
	return fileId.toHexString();
}
var registerDelegate_createServerFn_handler = createServerRpc({
	id: "0653e6a6bc6079452d57fe3f25bf701e755cc8c5d798da2a0614307cada87c66",
	name: "registerDelegate",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => registerDelegate.__executeServer(opts));
var registerDelegate = createServerFn({ method: "POST" }).validator((data) => data).handler(registerDelegate_createServerFn_handler, async ({ data }) => {
	const fullName = data.fullName.trim();
	const email = data.email.trim().toLowerCase();
	const iitEmail = data.iitEmail.trim().toLowerCase();
	const phone = data.phone.trim();
	const delegateOption = data.delegateOption || "Register only";
	if (!delegateOptions.includes(delegateOption)) throw new Error("Choose a valid package.");
	if (fullName.length < 2) throw new Error("Enter your full name.");
	if (!email.includes("@") || email.length < 5) throw new Error("Enter a valid email.");
	if (!iitEmail.includes("@") || iitEmail.length < 5) throw new Error("Enter a valid IIT email.");
	if (phone.replace(/\D/g, "").length < 10) throw new Error("Enter a valid phone number.");
	const settings = await findOne("registration_payment_settings", { id: 1 });
	if (!settings?.account_holder || !settings.bank_name || !settings.account_number || !settings.ifsc_code) throw new Error("Registration is not open yet. Transfer details are being configured.");
	const amountCents = readPackagePrices(settings.package_prices)[delegateOption];
	if (!Number.isSafeInteger(amountCents) || amountCents < 0) throw new Error("This package is not available.");
	const registrationId = await nextMongoId("registrations");
	let slipFileId = null;
	if (data.slipBase64 || data.slipContentType || data.slipFileName) {
		if (!data.slipBase64 || !data.slipContentType || !data.slipFileName) throw new Error("Choose a complete payment-slip file.");
		slipFileId = await saveSlip(registrationId, data.slipBase64, data.slipContentType, data.slipFileName);
	} else if (amountCents > 0) throw new Error("Upload your bank transfer slip to continue.");
	const registrationRef = makeRef("V26R");
	const ticketToken = randomBytes(32).toString("base64url");
	const now = (/* @__PURE__ */ new Date()).toISOString();
	try {
		await (await getMongoDb()).collection("registrations").insertOne({
			id: registrationId,
			full_name: fullName,
			email,
			iit_email: iitEmail,
			phone,
			university: "",
			year_of_study: "",
			crew_track: "",
			motivation: "",
			delegate_option: delegateOption,
			amount_cents: amountCents,
			amount_paid_cents: 0,
			payment_status: "submitted",
			payment_ref: registrationRef,
			card_last4: null,
			payment_submitted_at: slipFileId ? now : null,
			payment_reviewed_at: null,
			payment_review_note: "",
			slip_file_id: slipFileId,
			ticket_token: ticketToken,
			checked_in_at: null,
			created_at: now
		});
	} catch (error) {
		if (slipFileId) await (await getPrivateFilesBucket()).delete(new import_lib.ObjectId(slipFileId)).catch(() => void 0);
		throw error;
	}
	return {
		id: registrationId,
		paymentRef: registrationRef,
		ticketToken,
		amountCents
	};
});
var getTicketStatus_createServerFn_handler = createServerRpc({
	id: "427c40e3b15ae6572aba88708e873c4e50e3c36ba5e5c54d996e352cef94dcae",
	name: "getTicketStatus",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => getTicketStatus.__executeServer(opts));
var getTicketStatus = createServerFn({ method: "GET" }).validator((ticketToken) => ticketToken).handler(getTicketStatus_createServerFn_handler, async ({ data: ticketToken }) => {
	const row = await findOne("registrations", { ticket_token: ticketToken });
	if (!row) return { found: false };
	return {
		found: true,
		paymentStatus: row.payment_status,
		checkedIn: Boolean(row.checked_in_at)
	};
});
var getAdminTicketDetails_createServerFn_handler = createServerRpc({
	id: "fcf951145d2f1d9382bcd09de3d80aa05f80ae12562bad47362420257ad0b9ed",
	name: "getAdminTicketDetails",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => getAdminTicketDetails.__executeServer(opts));
var getAdminTicketDetails = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((ticketToken) => ticketToken).handler(getAdminTicketDetails_createServerFn_handler, async ({ data: ticketToken }) => {
	requireAdminSession();
	const row = await findOne("registrations", { ticket_token: ticketToken });
	if (!row) throw new Error("Ticket not found.");
	const matchingOrders = await findMany("orders", { email: row.email.toLowerCase() }, { created_at: -1 });
	const shopPurchases = await Promise.all(matchingOrders.map(async (order) => ({
		publicId: order.public_id,
		amountCents: order.amount_cents,
		createdAt: asIso(order.created_at),
		items: await findMany("order_items", { order_id: order.id }, { id: 1 })
	})));
	const { slip_file_id: _slipFileId, ...details } = row;
	return {
		...details,
		created_at: asIso(row.created_at),
		shopPurchases
	};
});
var getPaymentSlip_createServerFn_handler = createServerRpc({
	id: "0ff81844e0704859e9621b2b0cae08eabd8d9ce536d089cb2b0b23cfc400cfc9",
	name: "getPaymentSlip",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => getPaymentSlip.__executeServer(opts));
var getPaymentSlip = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((registrationId) => registrationId).handler(getPaymentSlip_createServerFn_handler, async ({ data: registrationId }) => {
	requireAdminSession();
	const row = await findOne("registrations", { id: registrationId });
	if (!row?.slip_file_id) throw new Error("No payment slip is attached to this registration.");
	const bucket = await getPrivateFilesBucket();
	const chunks = [];
	for await (const chunk of bucket.openDownloadStream(new import_lib.ObjectId(row.slip_file_id))) chunks.push(Buffer.from(chunk));
	const file = await bucket.find({ _id: new import_lib.ObjectId(row.slip_file_id) }).next();
	const contentType = typeof file?.metadata?.contentType === "string" ? file.metadata.contentType : "application/octet-stream";
	return {
		base64: Buffer.concat(chunks).toString("base64"),
		contentType,
		fileName: file?.filename ?? "payment-slip"
	};
});
var reviewRegistration_createServerFn_handler = createServerRpc({
	id: "474f7344978ac8295b1620a581fe0afaadbeeac88f809e1483c7e41349ac3173",
	name: "reviewRegistration",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => reviewRegistration.__executeServer(opts));
var reviewRegistration = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(reviewRegistration_createServerFn_handler, async ({ data }) => {
	requireAdminSession();
	const amountPaidCents = Math.round(Number(data.amountPaidRupees) * 100);
	if (!Number.isSafeInteger(amountPaidCents) || amountPaidCents < 0) throw new Error("Enter a valid amount paid.");
	if (!(/* @__PURE__ */ new Set(["approve", "reject"])).has(data.action)) throw new Error("Choose a valid review action.");
	if (!(await (await getMongoDb()).collection("registrations").updateOne({
		id: data.registrationId,
		payment_status: "submitted",
		...data.action === "approve" ? { amount_cents: { $lte: amountPaidCents } } : {}
	}, { $set: {
		amount_paid_cents: amountPaidCents,
		payment_status: data.action === "approve" ? "approved" : "rejected",
		payment_review_note: data.note.trim().slice(0, 500),
		payment_reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
	} })).matchedCount) {
		const row = await findOne("registrations", { id: data.registrationId });
		if (!row) throw new Error("Registration not found.");
		if (row.payment_status !== "submitted") throw new Error("This registration has already been reviewed.");
		throw new Error("The verified payment must cover the package price before approval.");
	}
	return { ok: true };
});
var checkInRegistration_createServerFn_handler = createServerRpc({
	id: "95f5aa05c5dafa3828b8c120130b6281f5dd1c3baa201ca2f5ed6934719e3290",
	name: "checkInRegistration",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => checkInRegistration.__executeServer(opts));
var checkInRegistration = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((ticketToken) => ticketToken).handler(checkInRegistration_createServerFn_handler, async ({ data: ticketToken }) => {
	requireAdminSession();
	const db = await getMongoDb();
	const row = await db.collection("registrations").findOne({ ticket_token: ticketToken });
	if (!row) throw new Error("Ticket not found.");
	if (row.payment_status !== "approved") throw new Error("Only approved delegates can be checked in.");
	if (!row.checked_in_at) await db.collection("registrations").updateOne({
		id: row.id,
		payment_status: "approved",
		checked_in_at: null
	}, { $set: { checked_in_at: (/* @__PURE__ */ new Date()).toISOString() } });
	return { ok: true };
});
var updateRegistrationPaymentSettings_createServerFn_handler = createServerRpc({
	id: "331e75bca9d8397889cda0756f03418fa0c220507906e79ee7664da9a8812fcd",
	name: "updateRegistrationPaymentSettings",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => updateRegistrationPaymentSettings.__executeServer(opts));
var updateRegistrationPaymentSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateRegistrationPaymentSettings_createServerFn_handler, async ({ data }) => {
	requireAdminSession();
	const accountHolder = data.accountHolder.trim();
	const bankName = data.bankName.trim();
	const accountNumber = data.accountNumber.trim();
	const ifscCode = data.ifscCode.trim().toUpperCase();
	const upiId = data.upiId.trim();
	if (!accountHolder || !bankName || !/^\d{8,20}$/.test(accountNumber) || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) throw new Error("Enter the account holder, bank, account number, and a valid IFSC code.");
	const packagePrices = Object.fromEntries(delegateOptions.map((option) => {
		const cents = Math.round(Number(data.packagePricesRupees[option]) * 100);
		if (!Number.isSafeInteger(cents) || cents < 0 || option !== "Register only" && cents === 0) throw new Error(`Enter a positive package price for ${option}; register-only may be free.`);
		return [option, cents];
	}));
	const imageUrl = data.registrationImageUrl.trim();
	if (imageUrl && !/^data:image\/(png|jpeg|webp|gif);base64,/.test(imageUrl)) throw new Error("Upload a valid registration image.");
	await (await getMongoDb()).collection("registration_payment_settings").updateOne({ id: 1 }, { $set: {
		account_holder: accountHolder,
		bank_name: bankName,
		account_number: accountNumber,
		ifsc_code: ifscCode,
		upi_id: upiId,
		registration_image_url: imageUrl,
		package_prices: packagePrices,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	} }, { upsert: true });
	return { ok: true };
});
var exportRegistrations_createServerFn_handler = createServerRpc({
	id: "a31d34fa51bc926d068734e855c2945f6eb111a06b87b153b7e0d737bfe902c8",
	name: "exportRegistrations",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => exportRegistrations.__executeServer(opts));
var exportRegistrations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(exportRegistrations_createServerFn_handler, async () => {
	requireAdminSession();
	return (await findMany("registrations", {}, {
		created_at: -1,
		id: -1
	})).map(({ has_payment_slip: _hasSlip, ...row }) => ({
		...row,
		created_at: asIso(row.created_at)
	}));
});
var placeOrder_createServerFn_handler = createServerRpc({
	id: "aff0ec6285e1786d19d81797ce9acc8ed04a749f5202376e3cf43a96ff689381",
	name: "placeOrder",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).validator((data) => data).handler(placeOrder_createServerFn_handler, async ({ data }) => {
	const customerName = data.customerName.trim();
	const email = data.email.trim().toLowerCase();
	const phone = data.phone.trim();
	const addressLine = data.addressLine.trim();
	const city = data.city.trim();
	const pincode = data.pincode.trim();
	if (customerName.length < 2) throw new Error("Enter the name on the order.");
	if (!email.includes("@")) throw new Error("Enter a valid email.");
	if (phone.replace(/\D/g, "").length < 10) throw new Error("Enter a valid phone number.");
	if (addressLine.length < 6) throw new Error("Enter a delivery address.");
	if (!city) throw new Error("Enter a city.");
	if (!/^\d{6}$/.test(pincode)) throw new Error("Enter a 6-digit pincode.");
	if (!data.items.length) throw new Error("Your hold is empty.");
	assertCard(data.cardNumber, data.cardExpiry, data.cardCvc);
	const db = await getMongoDb();
	const catalog = await findMany("products");
	const byId = new Map(catalog.map((product) => [product.id, product]));
	let amount = 0;
	const lines = [];
	for (const item of data.items) {
		const product = byId.get(item.productId);
		if (!product || !product.active) throw new Error("A product in your hold is no longer available.");
		if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 12) throw new Error("Quantity must be between one and twelve.");
		if (product.stock < item.qty) throw new Error(`${product.name} has only ${product.stock} left in the hold.`);
		amount += product.price_cents * item.qty;
		lines.push({
			product,
			qty: item.qty
		});
	}
	const order = {
		id: await nextMongoId("orders"),
		public_id: makeRef("V26"),
		user_id: null,
		customer_name: customerName,
		email,
		phone,
		address_line: addressLine,
		city,
		pincode,
		amount_cents: amount,
		payment_status: "pending",
		payment_ref: makeRef("PAY"),
		card_last4: last4(data.cardNumber),
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	const session = (await import("./mongo.server-1K_cavEN.mjs").then((n) => n.a).then((n) => n.a)).getMongoClient().startSession();
	try {
		await session.withTransaction(async () => {
			for (const line of lines) if (!(await db.collection("products").updateOne({
				id: line.product.id,
				active: true,
				stock: { $gte: line.qty }
			}, { $inc: { stock: -line.qty } }, { session })).matchedCount) throw new Error(`${line.product.name} no longer has enough stock.`);
			await db.collection("orders").insertOne(order, { session });
			if (lines.length) {
				const orderItems = await Promise.all(lines.map(async ({ product, qty }) => ({
					id: await nextMongoId("order_items"),
					order_id: order.id,
					product_id: product.id,
					name: product.name,
					qty,
					unit_price_cents: product.price_cents
				})));
				await db.collection("order_items").insertMany(orderItems, { session });
			}
		});
	} finally {
		await session.endSession();
	}
	return {
		publicId: order.public_id,
		paymentRef: order.payment_ref,
		amountCents: amount
	};
});
var getOrder_createServerFn_handler = createServerRpc({
	id: "a512e257c36408b418bd65ffb2dd897017754d99c8eeb189b5623ab9b703b565",
	name: "getOrder",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => getOrder.__executeServer(opts));
var getOrder = createServerFn({ method: "GET" }).validator((publicId) => publicId).handler(getOrder_createServerFn_handler, async ({ data: publicId }) => {
	const order = await findOne("orders", { public_id: publicId });
	if (!order) return null;
	const items = await findMany("order_items", { order_id: order.id }, { id: 1 });
	return {
		order: {
			...order,
			created_at: asIso(order.created_at)
		},
		items
	};
});
var adminDashboard_createServerFn_handler = createServerRpc({
	id: "14cd3f2e2265f39f8167389b9b965f33dcc0f9fb30d487693952f96512ce2a13",
	name: "adminDashboard",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => adminDashboard.__executeServer(opts));
var adminDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminDashboard_createServerFn_handler, async () => {
	requireAdminSession();
	const [site, products, gallery, sessions, registrations, orders, paymentSettings] = await Promise.all([
		findOne("site_settings", { id: 1 }),
		findMany("products", {}, {
			sort_order: 1,
			id: 1
		}),
		findMany("gallery_items", {}, {
			sort_order: 1,
			id: 1
		}),
		findMany("event_sessions", {}, {
			sort_order: 1,
			id: 1
		}),
		findMany("registrations", {}, {
			created_at: -1,
			id: -1
		}),
		findMany("orders", {}, {
			created_at: -1,
			id: -1
		}),
		findOne("registration_payment_settings", { id: 1 })
	]);
	if (!site) throw new Error("Site settings missing.");
	return {
		site: normalizeSite(site),
		products,
		gallery,
		sessions,
		registrations: registrations.map(({ slip_file_id: slipFileId, ...row }) => ({
			...row,
			has_payment_slip: Boolean(slipFileId),
			created_at: asIso(row.created_at)
		})),
		orders: orders.map((row) => ({
			...row,
			created_at: asIso(row.created_at)
		})),
		paymentSettings: paymentSettings ? {
			...paymentSettings,
			package_prices: readPackagePrices(paymentSettings.package_prices)
		} : null
	};
});
var updateSettings_createServerFn_handler = createServerRpc({
	id: "414da096959b4d6fffc3f79185d4d2001136ebd38bcddd79be5376b15c906d34",
	name: "updateSettings",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => updateSettings.__executeServer(opts));
var updateSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateSettings_createServerFn_handler, async ({ data }) => {
	requireAdminSession();
	if (!data.eventTitle.trim()) throw new Error("Event title is required.");
	const starts = new Date(data.eventStartsAt);
	if (Number.isNaN(starts.getTime())) throw new Error("Event date is invalid.");
	const fee = Math.round(Number(data.registrationFeeRupees) * 100);
	if (!Number.isSafeInteger(fee) || fee < 0) throw new Error("Registration fee is invalid.");
	await (await getMongoDb()).collection("site_settings").updateOne({ id: 1 }, { $set: {
		event_title: data.eventTitle.trim(),
		tagline: data.tagline.trim(),
		description: data.description.trim(),
		about_text: data.aboutText.trim(),
		venue: data.venue.trim(),
		event_starts_at: starts.toISOString(),
		registration_fee_cents: fee,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	} });
	return { ok: true };
});
var upsertProduct_createServerFn_handler = createServerRpc({
	id: "108bdc466141fa561f459f2cd226a17e9e86d7553e13b7a4c344f22e23349d03",
	name: "upsertProduct",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => upsertProduct.__executeServer(opts));
var upsertProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(upsertProduct_createServerFn_handler, async ({ data }) => {
	requireAdminSession();
	const slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
	const name = data.name.trim();
	if (!slug || !name) throw new Error("Name and slug are required.");
	const price = Math.round(Number(data.priceRupees) * 100);
	if (!Number.isSafeInteger(price) || price < 0) throw new Error("Price is invalid.");
	if (!/^\/(images|assets)\//.test(data.imageUrl) && !/^data:image\/(png|jpeg|webp|gif);base64,/.test(data.imageUrl)) throw new Error("Choose a valid store image.");
	const db = await getMongoDb();
	const id = data.id ?? await nextMongoId("products");
	await db.collection("products").updateOne({ id }, {
		$set: {
			slug,
			name,
			description: data.description.trim(),
			price_cents: price,
			image_url: data.imageUrl.trim(),
			stock: Math.max(0, Math.floor(data.stock)),
			active: data.active,
			sort_order: Math.floor(data.sortOrder)
		},
		$setOnInsert: { id }
	}, { upsert: true });
	return { id };
});
var deleteProduct_createServerFn_handler = createServerRpc({
	id: "a0c311d3101ea6f5e2059505198a863b51c3c0665984bc37f9c154ebc96551ad",
	name: "deleteProduct",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => deleteProduct.__executeServer(opts));
var deleteProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteProduct_createServerFn_handler, async ({ data: id }) => {
	requireAdminSession();
	await (await getMongoDb()).collection("products").deleteOne({ id });
	return { ok: true };
});
var upsertGallery_createServerFn_handler = createServerRpc({
	id: "b42484896d657c80918c89210cb22e8a957c8dc8ba2bfe31dd8e3188a29ab1ad",
	name: "upsertGallery",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => upsertGallery.__executeServer(opts));
var upsertGallery = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(upsertGallery_createServerFn_handler, async ({ data }) => {
	requireAdminSession();
	if (!data.imageUrl.trim() || !data.caption.trim()) throw new Error("Image and caption are required.");
	const db = await getMongoDb();
	const id = data.id ?? await nextMongoId("gallery_items");
	await db.collection("gallery_items").updateOne({ id }, {
		$set: {
			image_url: data.imageUrl.trim(),
			caption: data.caption.trim(),
			sort_order: Math.floor(data.sortOrder)
		},
		$setOnInsert: { id }
	}, { upsert: true });
	return { id };
});
var deleteGallery_createServerFn_handler = createServerRpc({
	id: "be2b059a85bdee7b8b3165c1ac5f88a48b3edcebf710234cef3f7d2a2334b293",
	name: "deleteGallery",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => deleteGallery.__executeServer(opts));
var deleteGallery = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteGallery_createServerFn_handler, async ({ data: id }) => {
	requireAdminSession();
	await (await getMongoDb()).collection("gallery_items").deleteOne({ id });
	return { ok: true };
});
var upsertSession_createServerFn_handler = createServerRpc({
	id: "e411bc3b011389244ecd832cda1d4cda494819d00cad19d210b1b29859333d00",
	name: "upsertSession",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => upsertSession.__executeServer(opts));
var upsertSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(upsertSession_createServerFn_handler, async ({ data }) => {
	requireAdminSession();
	if (!data.title.trim()) throw new Error("Title is required.");
	const db = await getMongoDb();
	const id = data.id ?? await nextMongoId("event_sessions");
	await db.collection("event_sessions").updateOne({ id }, {
		$set: {
			title: data.title.trim(),
			description: data.description.trim(),
			day_label: data.dayLabel.trim(),
			time_label: data.timeLabel.trim(),
			sort_order: Math.floor(data.sortOrder)
		},
		$setOnInsert: { id }
	}, { upsert: true });
	return { id };
});
var deleteSession_createServerFn_handler = createServerRpc({
	id: "20a9c01ff01f25ea3ce79ae7b7a5975110312258341e5d0621abc908c1aa52dd",
	name: "deleteSession",
	filename: "src/lib/server/mongo-voyage.ts"
}, (opts) => deleteSession.__executeServer(opts));
var deleteSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteSession_createServerFn_handler, async ({ data: id }) => {
	requireAdminSession();
	await (await getMongoDb()).collection("event_sessions").deleteOne({ id });
	return { ok: true };
});
//#endregion
export { adminDashboard_createServerFn_handler, checkInRegistration_createServerFn_handler, deleteGallery_createServerFn_handler, deleteProduct_createServerFn_handler, deleteSession_createServerFn_handler, exportRegistrations_createServerFn_handler, getAdminTicketDetails_createServerFn_handler, getHomeData_createServerFn_handler, getOrder_createServerFn_handler, getPaymentSlip_createServerFn_handler, getRegistrationPaymentSettings_createServerFn_handler, getSite_createServerFn_handler, getTicketStatus_createServerFn_handler, listAllProducts_createServerFn_handler, listGallery_createServerFn_handler, listProducts_createServerFn_handler, listSessions_createServerFn_handler, placeOrder_createServerFn_handler, registerDelegate_createServerFn_handler, reviewRegistration_createServerFn_handler, updateRegistrationPaymentSettings_createServerFn_handler, updateSettings_createServerFn_handler, upsertGallery_createServerFn_handler, upsertProduct_createServerFn_handler, upsertSession_createServerFn_handler, verifyAdminAccess_createServerFn_handler };
