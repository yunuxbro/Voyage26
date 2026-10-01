import { createServerFn } from "@tanstack/react-start";
import { ObjectId, type Document, type Filter } from "mongodb";
import { randomBytes } from "node:crypto";
import { authMiddleware } from "@/lib/auth/middleware";
import { getMongoDb, getPrivateFilesBucket, nextMongoId } from "@/lib/mongo.server";
import { expiryValid, last4, luhnOk, makeRef } from "@/lib/utils";
import { requireAdminSession, verifyAdminCode } from "./admin-access.server";

export const delegateOptions = [
  "Register only",
  "Delegate Pack",
  "T-shirt Only",
  "Mouse Pad Only",
  "Delegate Pack + Mouse Pad",
  "T-shirt + Mouse Pad",
] as const;

export type DelegateOption = (typeof delegateOptions)[number];

export type RegistrationPaymentSettings = {
  account_holder: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  upi_id: string;
  demo_transfer_mode: boolean;
  registration_image_url: string;
  shirt_image_url: string;
  shirt_sizes: string[];
  package_prices: Record<DelegateOption, number>;
};

const DEMO_TRANSFER_DETAILS = {
  account_holder: "VOYAGE '26 DEMO - NOT A REAL ACCOUNT",
  bank_name: "DEMO ONLY - DO NOT TRANSFER",
  account_number: "000000000000",
  ifsc_code: "DEMO0000000",
  upi_id: "demo@upi",
} as const;
const DEFAULT_SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function readShirtSizes(value: unknown): string[] {
  const candidates = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : DEFAULT_SHIRT_SIZES;
  const sizes = [...new Set(candidates
    .filter((size): size is string => typeof size === "string")
    .map((size) => size.trim().toUpperCase())
    .filter((size) => /^[A-Z0-9-]{1,10}$/.test(size)))];
  return sizes.length ? sizes.slice(0, 12) : DEFAULT_SHIRT_SIZES;
}

function normalizePaymentSettings(row: RegistrationPaymentSettings): RegistrationPaymentSettings {
  const demoTransferMode = row.demo_transfer_mode !== false;
  return {
    ...row,
    account_holder: row.account_holder || (demoTransferMode ? DEMO_TRANSFER_DETAILS.account_holder : ""),
    bank_name: row.bank_name || (demoTransferMode ? DEMO_TRANSFER_DETAILS.bank_name : ""),
    account_number: row.account_number || (demoTransferMode ? DEMO_TRANSFER_DETAILS.account_number : ""),
    ifsc_code: row.ifsc_code || (demoTransferMode ? DEMO_TRANSFER_DETAILS.ifsc_code : ""),
    upi_id: row.upi_id || (demoTransferMode ? DEMO_TRANSFER_DETAILS.upi_id : ""),
    demo_transfer_mode: demoTransferMode,
    shirt_image_url: row.shirt_image_url || "/images/product-tee.jpg",
    shirt_sizes: readShirtSizes(row.shirt_sizes),
    package_prices: readPackagePrices(row.package_prices),
  };
}

export type SiteSettings = {
  id: number;
  event_title: string;
  tagline: string;
  description: string;
  about_text: string;
  venue: string;
  event_starts_at: string;
  registration_fee_cents: number;
  updated_at?: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  image_url: string;
  stock: number;
  active: boolean;
  sort_order: number;
};

export type GalleryItem = {
  id: number;
  image_url: string;
  caption: string;
  sort_order: number;
};

export type EventSession = {
  id: number;
  title: string;
  description: string;
  day_label: string;
  time_label: string;
  sort_order: number;
};

export type Registration = {
  id: number;
  full_name: string;
  email: string;
  iit_email: string | null;
  phone: string;
  university: string;
  year_of_study: string;
  crew_track: string;
  motivation: string;
  delegate_option: string;
  shirt_size: string | null;
  amount_cents: number;
  amount_paid_cents: number;
  payment_status: string;
  payment_ref: string;
  card_last4: string | null;
  payment_submitted_at: string | null;
  payment_reviewed_at: string | null;
  payment_review_note: string;
  ticket_token: string;
  checked_in_at: string | null;
  created_at: string;
  has_payment_slip?: boolean;
};

export type Order = {
  id: number;
  public_id: string;
  user_id: string | null;
  customer_name: string;
  email: string;
  phone: string;
  address_line: string;
  city: string;
  pincode: string;
  amount_cents: number;
  payment_status: string;
  payment_ref: string;
  card_last4: string | null;
  created_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number | null;
  name: string;
  qty: number;
  unit_price_cents: number;
};

type Stored<T extends object> = T & Document;

function publicDocument<T extends object>(document: Stored<T>): T {
  const { _id: mongoId, ...data } = document;
  void mongoId;
  return data as T;
}

async function findOne<T extends object>(
  collectionName: string,
  filter: Filter<Stored<T>>,
): Promise<T | null> {
  const db = await getMongoDb();
  const row = await db.collection<Stored<T>>(collectionName).findOne(filter);
  return row ? publicDocument<T>(row as unknown as Stored<T>) : null;
}

async function findMany<T extends object>(
  collectionName: string,
  filter: Filter<Stored<T>> = {},
  sort: Record<string, 1 | -1> = {},
): Promise<T[]> {
  const db = await getMongoDb();
  const rows = await db.collection<Stored<T>>(collectionName).find(filter).sort(sort).toArray();
  return rows.map((row) => publicDocument<T>(row as unknown as Stored<T>));
}

function asIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "");
}

function normalizeSite(row: SiteSettings): SiteSettings {
  return { ...row, event_starts_at: asIso(row.event_starts_at) };
}

function readPackagePrices(value: unknown): Record<DelegateOption, number> {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  if (!parsed || typeof parsed !== "object") throw new Error("Package prices are not configured.");
  return Object.fromEntries(
    delegateOptions.map((option) => [option, Number((parsed as Record<string, unknown>)[option] ?? 0)]),
  ) as Record<DelegateOption, number>;
}

function assertCard(cardNumber: string, expiry: string, cvc: string) {
  const digits = cardNumber.replace(/\D/g, "");
  if (!luhnOk(digits)) throw new Error("That card number does not look valid.");
  if (!expiryValid(expiry)) throw new Error("That expiry date is not valid.");
  if (!/^\d{3,4}$/.test(cvc.trim())) throw new Error("Enter a 3 or 4 digit CVC.");
  if (digits.startsWith("0000")) throw new Error("The harbour declined this card.");
}

export const getSite = createServerFn({ method: "GET" }).handler(async () => {
  const row = await findOne<SiteSettings>("site_settings", { id: 1 });
  if (!row) throw new Error("Site settings missing.");
  return normalizeSite(row);
});

export const listProducts = createServerFn({ method: "GET" }).handler(async () =>
  findMany<Product>("products", { active: true }, { sort_order: 1, id: 1 }),
);

export const listAllProducts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    requireAdminSession();
    return findMany<Product>("products", {}, { sort_order: 1, id: 1 });
  });

export const listGallery = createServerFn({ method: "GET" }).handler(async () =>
  findMany<GalleryItem>("gallery_items", {}, { sort_order: 1, id: 1 }),
);

export const listSessions = createServerFn({ method: "GET" }).handler(async () =>
  findMany<EventSession>("event_sessions", {}, { sort_order: 1, id: 1 }),
);

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const [site, products, gallery, sessions] = await Promise.all([
    findOne<SiteSettings>("site_settings", { id: 1 }),
    findMany<Product>("products", { active: true }, { sort_order: 1, id: 1 }),
    findMany<GalleryItem>("gallery_items", {}, { sort_order: 1, id: 1 }),
    findMany<EventSession>("event_sessions", {}, { sort_order: 1, id: 1 }),
  ]);
  if (!site) throw new Error("Site settings missing.");
  return { site: normalizeSite(site), products, gallery, sessions };
});

export const verifyAdminAccess = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    verifyAdminCode(data.code);
    return { ok: true as const };
  });

export const getRegistrationPaymentSettings = createServerFn({ method: "GET" }).handler(async () => {
  const row = await findOne<RegistrationPaymentSettings>("registration_payment_settings", { id: 1 });
  if (!row) throw new Error("Payment settings are not available.");
  return normalizePaymentSettings(row);
});

type RegisterInput = {
  fullName: string;
  email: string;
  iitEmail: string;
  phone: string;
  delegateOption?: DelegateOption | "";
  shirtSize?: string;
  slipBase64?: string;
  slipContentType?: string;
  slipFileName?: string;
};

async function saveSlip(
  registrationId: number,
  base64: string,
  contentType: string,
  fileName: string,
): Promise<string> {
  const allowedMimeTypes = new Set(["application/pdf", "image/png", "image/jpeg"]);
  if (!allowedMimeTypes.has(contentType)) throw new Error("Upload a PDF, PNG, or JPEG payment slip.");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) throw new Error("The payment slip could not be read.");
  const bytes = Buffer.from(base64, "base64");
  if (!bytes.length || bytes.length > 2 * 1024 * 1024) throw new Error("Payment slips must be smaller than 2 MB.");
  const isPdf = contentType === "application/pdf" && bytes.subarray(0, 4).toString() === "%PDF";
  const isPng = contentType === "image/png" && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isJpeg = contentType === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (!isPdf && !isPng && !isJpeg) throw new Error("The uploaded file does not match its file type.");

  const safeFileName = fileName.split(/[\\/]/).pop()?.replace(/[\r\n\0]/g, "").slice(0, 180) || "payment-slip";
  const fileId = new ObjectId();
  const bucket = await getPrivateFilesBucket();
  const upload = bucket.openUploadStream(safeFileName, {
    id: fileId,
    metadata: { purpose: "payment-slip", registrationId, contentType },
  });
  await new Promise<void>((resolve, reject) => {
    upload.once("finish", resolve);
    upload.once("error", reject);
    upload.end(bytes);
  });
  return fileId.toHexString();
}

export const registerDelegate = createServerFn({ method: "POST" })
  .validator((data: RegisterInput) => data)
  .handler(async ({ data }) => {
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

    const storedSettings = await findOne<RegistrationPaymentSettings>("registration_payment_settings", { id: 1 });
    const settings = storedSettings ? normalizePaymentSettings(storedSettings) : null;
    if (!settings?.account_holder || !settings.bank_name || !settings.account_number || !settings.ifsc_code) {
      throw new Error("Registration is not open yet. Transfer details are being configured.");
    }
    const amountCents = readPackagePrices(settings.package_prices)[delegateOption];
    if (
      !Number.isSafeInteger(amountCents) ||
      amountCents < 0 ||
      (delegateOption !== "Register only" && amountCents === 0)
    ) {
      throw new Error("This package is not available.");
    }
    const shirtSize = data.shirtSize?.trim().toUpperCase() ?? "";
    const includesShirt = delegateOption.includes("T-shirt");
    if (includesShirt && !readShirtSizes(settings.shirt_sizes).includes(shirtSize)) {
      throw new Error("Choose an available T-shirt size.");
    }

    const registrationId = await nextMongoId("registrations");
    let slipFileId: string | null = null;
    if (data.slipBase64 || data.slipContentType || data.slipFileName) {
      if (!data.slipBase64 || !data.slipContentType || !data.slipFileName) {
        throw new Error("Choose a complete payment-slip file.");
      }
      slipFileId = await saveSlip(registrationId, data.slipBase64, data.slipContentType, data.slipFileName);
    } else if (amountCents > 0) {
      throw new Error("Upload your bank transfer slip to continue.");
    }

    const registrationRef = makeRef("V26R");
    const ticketToken = randomBytes(32).toString("base64url");
    const now = new Date().toISOString();
    try {
      const db = await getMongoDb();
      await db.collection("registrations").insertOne({
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
        shirt_size: includesShirt ? shirtSize : null,
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
        created_at: now,
      });
    } catch (error) {
      if (slipFileId) {
        const bucket = await getPrivateFilesBucket();
        await bucket.delete(new ObjectId(slipFileId)).catch(() => undefined);
      }
      throw error;
    }
    return { id: registrationId, paymentRef: registrationRef, ticketToken, amountCents };
  });

export const getTicketStatus = createServerFn({ method: "GET" })
  .validator((ticketToken: string) => ticketToken)
  .handler(async ({ data: ticketToken }) => {
    const row = await findOne<{ payment_status: string; checked_in_at: string | null }>(
      "registrations",
      { ticket_token: ticketToken },
    );
    if (!row) return { found: false as const };
    return { found: true as const, paymentStatus: row.payment_status, checkedIn: Boolean(row.checked_in_at) };
  });

export const getAdminTicketDetails = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((ticketToken: string) => ticketToken)
  .handler(async ({ data: ticketToken }) => {
    requireAdminSession();
    const row = await findOne<Registration & { slip_file_id?: string | null }>(
      "registrations",
      { ticket_token: ticketToken },
    );
    if (!row) throw new Error("Ticket not found.");
    const matchingOrders = await findMany<Order>("orders", { email: row.email.toLowerCase() }, { created_at: -1 });
    const shopPurchases = await Promise.all(matchingOrders.map(async (order) => ({
      publicId: order.public_id,
      amountCents: order.amount_cents,
      createdAt: asIso(order.created_at),
      items: await findMany<OrderItem>("order_items", { order_id: order.id }, { id: 1 }),
    })));
    const { slip_file_id: _slipFileId, ...details } = row;
    return { ...details, created_at: asIso(row.created_at), shopPurchases };
  });

export const getPaymentSlip = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((registrationId: number) => registrationId)
  .handler(async ({ data: registrationId }) => {
    requireAdminSession();
    const row = await findOne<{ slip_file_id?: string | null }>("registrations", { id: registrationId });
    if (!row?.slip_file_id) throw new Error("No payment slip is attached to this registration.");
    const bucket = await getPrivateFilesBucket();
    const chunks: Buffer[] = [];
    for await (const chunk of bucket.openDownloadStream(new ObjectId(row.slip_file_id))) {
      chunks.push(Buffer.from(chunk));
    }
    const file = await bucket.find({ _id: new ObjectId(row.slip_file_id) }).next();
    const contentType = typeof file?.metadata?.contentType === "string" ? file.metadata.contentType : "application/octet-stream";
    return {
      base64: Buffer.concat(chunks).toString("base64"),
      contentType,
      fileName: file?.filename ?? "payment-slip",
    };
  });

export const reviewRegistration = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { registrationId: number; action: "approve" | "reject"; amountPaidRupees: number; note: string }) => data)
  .handler(async ({ data }) => {
    requireAdminSession();
    const amountPaidCents = Math.round(Number(data.amountPaidRupees) * 100);
    if (!Number.isSafeInteger(amountPaidCents) || amountPaidCents < 0) throw new Error("Enter a valid amount paid.");
    if (!new Set(["approve", "reject"]).has(data.action)) throw new Error("Choose a valid review action.");
    const db = await getMongoDb();
    const result = await db.collection("registrations").updateOne(
      { id: data.registrationId, payment_status: "submitted", ...(data.action === "approve" ? { amount_cents: { $lte: amountPaidCents } } : {}) },
      {
        $set: {
          amount_paid_cents: amountPaidCents,
          payment_status: data.action === "approve" ? "approved" : "rejected",
          payment_review_note: data.note.trim().slice(0, 500),
          payment_reviewed_at: new Date().toISOString(),
        },
      },
    );
    if (!result.matchedCount) {
      const row = await findOne<{ payment_status: string; amount_cents: number }>("registrations", { id: data.registrationId });
      if (!row) throw new Error("Registration not found.");
      if (row.payment_status !== "submitted") throw new Error("This registration has already been reviewed.");
      throw new Error("The verified payment must cover the package price before approval.");
    }
    return { ok: true as const };
  });

export const checkInRegistration = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((ticketToken: string) => ticketToken)
  .handler(async ({ data: ticketToken }) => {
    requireAdminSession();
    const db = await getMongoDb();
    const row = await db.collection("registrations").findOne({ ticket_token: ticketToken });
    if (!row) throw new Error("Ticket not found.");
    if (row.payment_status !== "approved") throw new Error("Only approved delegates can be checked in.");
    if (!row.checked_in_at) {
      await db.collection("registrations").updateOne(
        { id: row.id, payment_status: "approved", checked_in_at: null },
        { $set: { checked_in_at: new Date().toISOString() } },
      );
    }
    return { ok: true as const };
  });

export const updateRegistrationPaymentSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
    demoTransferMode: boolean;
    registrationImageUrl: string;
    shirtImageUrl: string;
    shirtSizes: string[];
    packagePricesRupees: Record<DelegateOption, number>;
  }) => data)
  .handler(async ({ data }) => {
    requireAdminSession();
    const accountHolder = data.accountHolder.trim();
    const bankName = data.bankName.trim();
    const accountNumber = data.accountNumber.trim();
    const ifscCode = data.ifscCode.trim().toUpperCase();
    const upiId = data.upiId.trim();
    const shirtImageUrl = data.shirtImageUrl.trim();
    const shirtSizes = readShirtSizes(data.shirtSizes);
    if (!accountHolder || !bankName || !/^\d{8,20}$/.test(accountNumber) || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      throw new Error("Enter the account holder, bank, account number, and a valid IFSC code.");
    }
    const packagePrices = Object.fromEntries(delegateOptions.map((option) => {
      const cents = Math.round(Number(data.packagePricesRupees[option]) * 100);
      if (!Number.isSafeInteger(cents) || cents < 0) {
        throw new Error(`Enter a valid non-negative package price for ${option}.`);
      }
      return [option, cents];
    })) as Record<DelegateOption, number>;
    const imageUrl = data.registrationImageUrl.trim();
    if (imageUrl && !/^data:image\/(png|jpeg|webp|gif);base64,/.test(imageUrl)) {
      throw new Error("Upload a valid registration image.");
    }
    if (!/^\/(images|assets)\//.test(shirtImageUrl) && !/^data:image\/(png|jpeg|webp|gif);base64,/.test(shirtImageUrl)) {
      throw new Error("Upload a valid T-shirt sample image.");
    }
    if (!shirtSizes.length) throw new Error("Add at least one available T-shirt size.");
    const db = await getMongoDb();
    await db.collection("registration_payment_settings").updateOne(
      { id: 1 },
      {
        $set: {
          account_holder: accountHolder,
          bank_name: bankName,
          account_number: accountNumber,
          ifsc_code: ifscCode,
          upi_id: upiId,
          demo_transfer_mode: data.demoTransferMode,
          registration_image_url: imageUrl,
          shirt_image_url: shirtImageUrl,
          shirt_sizes: shirtSizes,
          package_prices: packagePrices,
          updated_at: new Date().toISOString(),
        },
      },
      { upsert: true },
    );
    return { ok: true as const };
  });

export const exportRegistrations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    requireAdminSession();
    const rows = await findMany<Registration>("registrations", {}, { created_at: -1, id: -1 });
    return rows.map(({ has_payment_slip: _hasSlip, ...row }) => ({
      ...row,
      shirt_size: row.shirt_size ?? null,
      created_at: asIso(row.created_at),
    }));
  });

type PlaceOrderInput = {
  customerName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  pincode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  items: { productId: number; qty: number }[];
};

export const placeOrder = createServerFn({ method: "POST" })
  .validator((data: PlaceOrderInput) => data)
  .handler(async ({ data }) => {
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
    const catalog = await findMany<Product>("products");
    const byId = new Map(catalog.map((product) => [product.id, product]));
    let amount = 0;
    const lines: { product: Product; qty: number }[] = [];
    for (const item of data.items) {
      const product = byId.get(item.productId);
      if (!product || !product.active) throw new Error("A product in your hold is no longer available.");
      if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 12) throw new Error("Quantity must be between one and twelve.");
      if (product.stock < item.qty) throw new Error(`${product.name} has only ${product.stock} left in the hold.`);
      amount += product.price_cents * item.qty;
      lines.push({ product, qty: item.qty });
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
      created_at: new Date().toISOString(),
    } satisfies Order;
    const session = (await import("@/lib/mongo.server")).getMongoClient().startSession();
    try {
      await session.withTransaction(async () => {
        for (const line of lines) {
          const update = await db.collection("products").updateOne(
            { id: line.product.id, active: true, stock: { $gte: line.qty } },
            { $inc: { stock: -line.qty } },
            { session },
          );
          if (!update.matchedCount) throw new Error(`${line.product.name} no longer has enough stock.`);
        }
        await db.collection("orders").insertOne(order, { session });
        if (lines.length) {
          const orderItems = await Promise.all(lines.map(async ({ product, qty }) => ({
            id: await nextMongoId("order_items"),
            order_id: order.id,
            product_id: product.id,
            name: product.name,
            qty,
            unit_price_cents: product.price_cents,
          })));
          await db.collection("order_items").insertMany(
            orderItems,
            { session },
          );
        }
      });
    } finally {
      await session.endSession();
    }
    return { publicId: order.public_id, paymentRef: order.payment_ref, amountCents: amount };
  });

export const getOrder = createServerFn({ method: "GET" })
  .validator((publicId: string) => publicId)
  .handler(async ({ data: publicId }) => {
    const order = await findOne<Order>("orders", { public_id: publicId });
    if (!order) return null;
    const items = await findMany<OrderItem>("order_items", { order_id: order.id }, { id: 1 });
    return { order: { ...order, created_at: asIso(order.created_at) }, items };
  });

export const adminDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    requireAdminSession();
    const [site, products, gallery, sessions, registrations, orders, paymentSettings] = await Promise.all([
      findOne<SiteSettings>("site_settings", { id: 1 }),
      findMany<Product>("products", {}, { sort_order: 1, id: 1 }),
      findMany<GalleryItem>("gallery_items", {}, { sort_order: 1, id: 1 }),
      findMany<EventSession>("event_sessions", {}, { sort_order: 1, id: 1 }),
      findMany<Registration & { slip_file_id?: string | null }>("registrations", {}, { created_at: -1, id: -1 }),
      findMany<Order>("orders", {}, { created_at: -1, id: -1 }),
      findOne<RegistrationPaymentSettings>("registration_payment_settings", { id: 1 }),
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
        created_at: asIso(row.created_at),
      })),
      orders: orders.map((row) => ({ ...row, created_at: asIso(row.created_at) })),
      paymentSettings: paymentSettings
        ? normalizePaymentSettings(paymentSettings)
        : null,
    };
  });

type SettingsInput = {
  eventTitle: string;
  tagline: string;
  description: string;
  aboutText: string;
  venue: string;
  eventStartsAt: string;
  registrationFeeRupees: number;
};

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: SettingsInput) => data)
  .handler(async ({ data }) => {
    requireAdminSession();
    if (!data.eventTitle.trim()) throw new Error("Event title is required.");
    const starts = new Date(data.eventStartsAt);
    if (Number.isNaN(starts.getTime())) throw new Error("Event date is invalid.");
    const fee = Math.round(Number(data.registrationFeeRupees) * 100);
    if (!Number.isSafeInteger(fee) || fee < 0) throw new Error("Registration fee is invalid.");
    const db = await getMongoDb();
    await db.collection("site_settings").updateOne(
      { id: 1 },
      {
        $set: {
          event_title: data.eventTitle.trim(),
          tagline: data.tagline.trim(),
          description: data.description.trim(),
          about_text: data.aboutText.trim(),
          venue: data.venue.trim(),
          event_starts_at: starts.toISOString(),
          registration_fee_cents: fee,
          updated_at: new Date().toISOString(),
        },
      },
    );
    return { ok: true as const };
  });

type ProductInput = {
  id?: number;
  slug: string;
  name: string;
  description: string;
  priceRupees: number;
  imageUrl: string;
  stock: number;
  active: boolean;
  sortOrder: number;
};

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: ProductInput) => data)
  .handler(async ({ data }) => {
    requireAdminSession();
    const slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const name = data.name.trim();
    if (!slug || !name) throw new Error("Name and slug are required.");
    const price = Math.round(Number(data.priceRupees) * 100);
    if (!Number.isSafeInteger(price) || price < 0) throw new Error("Price is invalid.");
    if (!/^\/(images|assets)\//.test(data.imageUrl) && !/^data:image\/(png|jpeg|webp|gif);base64,/.test(data.imageUrl)) {
      throw new Error("Choose a valid store image.");
    }
    const db = await getMongoDb();
    const id = data.id ?? await nextMongoId("products");
    await db.collection<Product>("products").updateOne(
      { id },
      {
        $set: {
          slug,
          name,
          description: data.description.trim(),
          price_cents: price,
          image_url: data.imageUrl.trim(),
          stock: Math.max(0, Math.floor(data.stock)),
          active: data.active,
          sort_order: Math.floor(data.sortOrder),
        },
        $setOnInsert: { id },
      },
      { upsert: true },
    );
    return { id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    requireAdminSession();
    const db = await getMongoDb();
    await db.collection("products").deleteOne({ id });
    return { ok: true as const };
  });

type GalleryInput = { id?: number; imageUrl: string; caption: string; sortOrder: number };

export const upsertGallery = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: GalleryInput) => data)
  .handler(async ({ data }) => {
    requireAdminSession();
    if (!data.imageUrl.trim() || !data.caption.trim()) throw new Error("Image and caption are required.");
    const db = await getMongoDb();
    const id = data.id ?? await nextMongoId("gallery_items");
    await db.collection<GalleryItem>("gallery_items").updateOne(
      { id },
      { $set: { image_url: data.imageUrl.trim(), caption: data.caption.trim(), sort_order: Math.floor(data.sortOrder) }, $setOnInsert: { id } },
      { upsert: true },
    );
    return { id };
  });

export const deleteGallery = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    requireAdminSession();
    const db = await getMongoDb();
    await db.collection("gallery_items").deleteOne({ id });
    return { ok: true as const };
  });

type SessionInput = { id?: number; title: string; description: string; dayLabel: string; timeLabel: string; sortOrder: number };

export const upsertSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: SessionInput) => data)
  .handler(async ({ data }) => {
    requireAdminSession();
    if (!data.title.trim()) throw new Error("Title is required.");
    const db = await getMongoDb();
    const id = data.id ?? await nextMongoId("event_sessions");
    await db.collection<EventSession>("event_sessions").updateOne(
      { id },
      {
        $set: {
          title: data.title.trim(),
          description: data.description.trim(),
          day_label: data.dayLabel.trim(),
          time_label: data.timeLabel.trim(),
          sort_order: Math.floor(data.sortOrder),
        },
        $setOnInsert: { id },
      },
      { upsert: true },
    );
    return { id };
  });

export const deleteSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    requireAdminSession();
    const db = await getMongoDb();
    await db.collection("event_sessions").deleteOne({ id });
    return { ok: true as const };
  });
