import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  adminDashboard,
  delegateOptions,
  deleteGallery,
  deleteProduct,
  deleteSession,
  exportRegistrations,
  getPaymentSlip,
  reviewRegistration,
  updateRegistrationPaymentSettings,
  updateSettings,
  upsertGallery,
  upsertProduct,
  upsertSession,
  verifyAdminAccess,
  type EventSession,
  type GalleryItem,
  type Product,
  type DelegateOption,
  type Registration,
  type RegistrationPaymentSettings,
  type SiteSettings,
} from "@/lib/server/mongo-voyage";
import { uploadImage } from "@/routes/api/upload";
import { formatInr, makeQrCodeUrl } from "@/lib/utils";
import { createXlsxWorkbook } from "@/lib/xlsx";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Tab = "settings" | "payments" | "shop" | "gallery" | "log" | "berths" | "orders";

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const [securityCodeVerified, setSecurityCodeVerified] = useState(false);
  const [securityInput, setSecurityInput] = useState("");
  const [tab, setTab] = useState<Tab>("settings");
  const [data, setData] = useState<Awaited<ReturnType<typeof adminDashboard>> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending || !user || !securityCodeVerified) return;
    let cancelled = false;
    setLoading(true);
    void adminDashboard()
      .then((next) => {
        if (!cancelled) setData(next);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Could not load."))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, user, securityCodeVerified]);

  if (isPending) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-muted">Unfurling the charts…</div>;
  }
  if (!user) return <RedirectToSignIn />;

  async function handleSecurityCodeSubmit(e: FormEvent) {
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

  if (!securityCodeVerified) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">Quartermaster</p>
        <h1 className="font-display mt-3 text-display-sm text-parchment">Verify Access</h1>
        <p className="mt-3 text-sm text-muted">
          Enter the server-configured admin code to access applicant and payment details.
        </p>
        <form className="mt-8 grid gap-4" onSubmit={handleSecurityCodeSubmit}>
          <div>
            <Label htmlFor="securityCode">Security Code</Label>
            <Input
              id="securityCode"
              type="password"
              value={securityInput}
              onChange={(e) => setSecurityInput(e.target.value)}
              placeholder="Enter code"
              required
            />
          </div>
          <Button type="submit" size="lg">
            Unlock
          </Button>
        </form>
      </div>
    );
  }

  if (loading && !data) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-muted">Loading the admin log…</div>;
  }
  if (!data) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-muted">Nothing in the log.</div>;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "settings", label: "Settings" },
    { id: "payments", label: "Payments" },
    { id: "shop", label: "Store" },
    { id: "gallery", label: "Gallery" },
    { id: "log", label: "Watches" },
    { id: "berths", label: "Berths" },
    { id: "orders", label: "Orders" },
  ];

  async function exportRegistrationsXlsx() {
    try {
      const rows = await exportRegistrations();
      const workbook = createXlsxWorkbook(
        ["Name", "Email", "IIT email", "Phone", "Package", "Amount due (INR)", "Amount paid (INR)", "Payment status", "Payment reference", "Submitted at", "Reviewed at", "Checked in at"],
        rows.map((row) => [
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
          row.checked_in_at,
        ]),
      );
      const workbookBuffer = workbook.buffer.slice(
        workbook.byteOffset,
        workbook.byteOffset + workbook.byteLength,
      ) as ArrayBuffer;
      const blob = new Blob([workbookBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">Quartermaster</p>
      <h1 className="font-display mt-2 text-display-sm text-parchment">
        Change the voyage
      </h1>
      <p className="mt-2 text-sm text-muted">
        Signed in as {user.displayName ?? user.primaryEmail}. Event date, copy, cargo
        and the gallery all live here.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={
                tab === item.id
                  ? "h-10 rounded-[10px] bg-gold px-3 text-sm text-ink"
                  : "h-10 rounded-[10px] px-3 text-sm text-gold shadow-[0_0_0_1px_rgb(201_164_76_/_0.3)]"
              }
            >
              {item.label}
            </button>
          ))}
        </div>
        {tab === "berths" ? (
          <Button type="button" variant="outline" onClick={() => void exportRegistrationsXlsx()}>
            Export Excel
          </Button>
        ) : null}
      </div>
      <div className="mt-8">
        {tab === "settings" ? (
          <SettingsForm site={data.site} onSaved={refresh} />
        ) : null}
        {tab === "payments" ? (
          <PaymentSettingsForm settings={data.paymentSettings} onSaved={refresh} />
        ) : null}
        {tab === "shop" ? (
          <ProductsAdmin products={data.products} onSaved={refresh} />
        ) : null}
        {tab === "gallery" ? (
          <GalleryAdmin items={data.gallery} onSaved={refresh} />
        ) : null}
        {tab === "log" ? (
          <SessionsAdmin sessions={data.sessions} onSaved={refresh} />
        ) : null}
        {tab === "berths" ? (
          <div className="overflow-x-auto rounded-[20px] bg-wood shadow-[0_0_0_1px_rgb(201_164_76_/_0.18)]">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="text-[0.65rem] tracking-[0.16em] text-gold uppercase">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Due / paid</th>
                  <th className="px-4 py-3">Review</th>
                  <th className="px-4 py-3">Ref</th>
                  <th className="px-4 py-3">Slip</th>
                  <th className="px-4 py-3">QR</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.registrations.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-muted" colSpan={9}>
                      No registrations yet.
                    </td>
                  </tr>
                ) : (
                  data.registrations.map((row) => (
                    <tr key={row.id} className="border-t border-gold/10 align-top">
                      <td className="px-4 py-3 text-parchment">{row.full_name}</td>
                      <td className="px-4 py-3 text-muted">
                        <div>{row.email}</div>
                        <div className="mt-1 text-xs">{row.iit_email}</div>
                        <div className="mt-1 text-xs">{row.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-muted">{row.delegate_option}</td>
                      <td className="px-4 py-3 tabular-nums">
                        <div className="text-parchment">{formatInr(row.amount_cents)}</div>
                        <div className="mt-1 text-xs text-gold">{formatInr(row.amount_paid_cents)} verified</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-parchment">{row.payment_status}</div>
                        {row.payment_status === "submitted" && row.payment_submitted_at ? (
                          <div className={Date.now() - new Date(row.payment_submitted_at).getTime() > 24 * 60 * 60 * 1000 ? "mt-1 text-xs text-red-300" : "mt-1 text-xs text-muted"}>
                            Submitted {new Date(row.payment_submitted_at).toLocaleString("en-IN")}
                          </div>
                        ) : null}
                        {row.payment_review_note ? <div className="mt-1 max-w-48 text-xs text-muted">{row.payment_review_note}</div> : null}
                      </td>
                      <td className="px-4 py-3 text-muted">{row.payment_ref}</td>
                      <td className="px-4 py-3">{row.has_payment_slip ? <SlipDownload registrationId={row.id} /> : <span className="text-xs text-muted">No slip</span>}</td>
                      <td className="px-4 py-3"><TicketQr ticketToken={row.ticket_token} /></td>
                      <td className="px-4 py-3">
                        <RegistrationReview registration={row} onSaved={refresh} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
        {tab === "orders" ? (
          <div className="overflow-x-auto rounded-[20px] bg-wood shadow-[0_0_0_1px_rgb(201_164_76_/_0.18)]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-[0.65rem] tracking-[0.16em] text-gold uppercase">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Prize</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-muted" colSpan={5}>
                      No prizes taken.
                    </td>
                  </tr>
                ) : (
                  data.orders.map((row) => (
                    <tr key={row.id} className="border-t border-gold/10">
                      <td className="px-4 py-3 text-gold">{row.public_id}</td>
                      <td className="px-4 py-3 text-parchment">{row.customer_name}</td>
                      <td className="px-4 py-3 text-muted">{row.email}</td>
                      <td className="px-4 py-3 tabular-nums text-gold">
                        {formatInr(row.amount_cents)}
                      </td>
                      <td className="px-4 py-3 text-muted">{row.payment_status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function PaymentSettingsForm({
  settings,
  onSaved,
}: {
  settings: RegistrationPaymentSettings | null;
  onSaved: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [form, setForm] = useState(() => ({
    accountHolder: settings?.account_holder ?? "",
    bankName: settings?.bank_name ?? "",
    accountNumber: settings?.account_number ?? "",
    ifscCode: settings?.ifsc_code ?? "",
    upiId: settings?.upi_id ?? "",
      registrationImageUrl: settings?.registration_image_url ?? "",
    packagePricesRupees: Object.fromEntries(
      delegateOptions.map((option) => [option, (settings?.package_prices[option] ?? 0) / 100]),
    ) as Record<DelegateOption, number>,
  }));

  async function uploadRegistrationImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Images must be smaller than 5 MB.");
      return;
    }
    setImageBusy(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let binary = "";
      for (let offset = 0; offset < bytes.length; offset += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
      }
      const result = await uploadImage({ data: { base64: btoa(binary), mimeType: file.type } });
      setForm((current) => ({ ...current, registrationImageUrl: result.url }));
      toast.success("Registration image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload image.");
    } finally {
      setImageBusy(false);
    }
  }

  async function onSubmit(e: FormEvent) {
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

  return (
    <form className="grid max-w-3xl gap-5" onSubmit={onSubmit}>
      <div>
        <h2 className="font-display text-2xl text-parchment">Bank transfer details</h2>
        <p className="mt-1 text-sm text-muted">These details appear on the public registration form. New registrations stay closed until every package has a price.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="accountHolder">Account holder</Label><Input id="accountHolder" value={form.accountHolder} onChange={(e) => setForm({ ...form, accountHolder: e.target.value })} required /></div>
        <div><Label htmlFor="bankName">Bank name</Label><Input id="bankName" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} required /></div>
        <div><Label htmlFor="accountNumber">Account number</Label><Input id="accountNumber" inputMode="numeric" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} required /></div>
        <div><Label htmlFor="ifscCode">IFSC code</Label><Input id="ifscCode" value={form.ifscCode} onChange={(e) => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })} required /></div>
        <div className="sm:col-span-2"><Label htmlFor="upiId">UPI ID (optional)</Label><Input id="upiId" value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} /></div>
      </div>
      <div className="border-t border-gold/20 pt-5">
        <h3 className="font-display text-xl text-parchment">Package prices</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {delegateOptions.map((option) => (
            <div key={option}>
              <Label htmlFor={`price-${option}`}>{option} (INR)</Label>
              <Input
                id={`price-${option}`}
                type="number"
                min={option === "Register only" ? "0" : "0.01"}
                step="0.01"
                value={form.packagePricesRupees[option]}
                onChange={(e) => setForm({
                  ...form,
                  packagePricesRupees: { ...form.packagePricesRupees, [option]: Number(e.target.value) },
                })}
                required
              />
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gold/20 pt-5">
        <Label htmlFor="registrationImage">Registration or payment image (PNG, JPEG, WebP, or GIF; max 5 MB)</Label>
        <Input id="registrationImage" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadRegistrationImage} disabled={imageBusy} />
        {imageBusy ? <p className="mt-2 text-xs text-muted">Uploading…</p> : null}
        {form.registrationImageUrl ? <img src={form.registrationImageUrl} alt="Registration or payment image preview" className="mt-3 aspect-[3/1] w-full object-cover" /> : null}
      </div>
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save payment settings"}</Button>
    </form>
  );
}

function SlipDownload({ registrationId }: { registrationId: number }) {
  const [busy, setBusy] = useState(false);

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
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not retrieve slip.");
    } finally {
      setBusy(false);
    }
  }

  return <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void download()}>{busy ? "Loading…" : "Download"}</Button>;
}

function TicketQr({ ticketToken }: { ticketToken: string }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    const url = `${window.location.origin}/ticket/${ticketToken}`;
    setQr(makeQrCodeUrl(url, "120x120"));
  }, [ticketToken]);

  return qr ? (
    <a href={`/ticket/${ticketToken}`} aria-label="Open ticket lookup">
      <img src={qr} alt="Ticket QR code" className="h-20 w-20 bg-white p-1" />
    </a>
  ) : <span className="text-xs text-muted">Preparing…</span>;
}

function RegistrationReview({
  registration,
  onSaved,
}: {
  registration: Registration;
  onSaved: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [amountPaid, setAmountPaid] = useState(registration.amount_cents / 100);
  const [note, setNote] = useState("");

  async function submit(action: "approve" | "reject") {
    setBusy(true);
    try {
      await reviewRegistration({
        data: { registrationId: registration.id, action, amountPaidRupees: amountPaid, note },
      });
      toast.success(action === "approve" ? "Registration approved." : "Registration rejected.");
      await onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update review status.");
    } finally {
      setBusy(false);
    }
  }

  if (registration.payment_status !== "submitted") {
    return registration.checked_in_at ? <span className="text-xs text-gold">Checked in</span> : <span className="text-xs text-muted">Reviewed</span>;
  }

  return (
    <div className="grid w-44 gap-2">
      <Label htmlFor={`paid-${registration.id}`}>Verified amount (INR)</Label>
      <Input id={`paid-${registration.id}`} type="number" min="0" step="0.01" value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} />
      <Input aria-label="Review note" placeholder="Optional review note" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="flex gap-2">
        <Button type="button" size="sm" disabled={busy} onClick={() => void submit("approve")}>Approve</Button>
        <Button type="button" size="sm" variant="wine" disabled={busy} onClick={() => void submit("reject")}>Reject</Button>
      </div>
    </div>
  );
}

function SettingsForm({
  site,
  onSaved,
}: {
  site: SiteSettings;
  onSaved: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    eventTitle: site.event_title,
    tagline: site.tagline,
    description: site.description,
    aboutText: site.about_text,
    venue: site.venue,
    eventStartsAt: toLocalInput(site.event_starts_at),
    registrationFeeRupees: site.registration_fee_cents / 100,
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await updateSettings({
        data: {
          ...form,
          eventStartsAt: new Date(form.eventStartsAt).toISOString(),
        },
      });
      toast.success("Charts updated.");
      await onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="grid max-w-2xl gap-4" onSubmit={onSubmit}>
      <div>
        <Label htmlFor="eventTitle">Event title</Label>
        <Input
          id="eventTitle"
          value={form.eventTitle}
          onChange={(e) => setForm({ ...form, eventTitle: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="venue">Venue</Label>
        <Input
          id="venue"
          value={form.venue}
          onChange={(e) => setForm({ ...form, venue: e.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="starts">Event starts</Label>
          <Input
            id="starts"
            type="datetime-local"
            value={form.eventStartsAt}
            onChange={(e) => setForm({ ...form, eventStartsAt: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="fee">Registration fee (₹)</Label>
          <Input
            id="fee"
            type="number"
            min={0}
            step="1"
            value={form.registrationFeeRupees}
            onChange={(e) =>
              setForm({ ...form, registrationFeeRupees: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Short description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about">About</Label>
        <Textarea
          id="about"
          className="min-h-40"
          value={form.aboutText}
          onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
        />
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}

function ProductsAdmin({
  products,
  onSaved,
}: {
  products: Product[];
  onSaved: () => Promise<void>;
}) {
  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <ProductRow key={product.id} product={product} onSaved={onSaved} />
      ))}
      <ProductRow onSaved={onSaved} />
    </div>
  );
}

function ProductRow({
  product,
  onSaved,
}: {
  product?: Product;
  onSaved: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    slug: product?.slug ?? "",
    name: product?.name ?? "",
    description: product?.description ?? "",
    priceRupees: (product?.price_cents ?? 0) / 100,
    imageUrl: product?.image_url ?? "/images/product-tee.jpg",
    stock: product?.stock ?? 20,
    active: product?.active ?? true,
    sortOrder: product?.sort_order ?? 10,
  });

  async function save() {
    setBusy(true);
    try {
      await upsertProduct({
        data: { ...form, id: product?.id },
      });
      toast.success("Cargo updated.");
      await onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3 rounded-[20px] bg-wood p-4 shadow-[0_0_0_1px_rgb(201_164_76_/_0.16)] sm:grid-cols-2">
      <Input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <Input
        placeholder="slug"
        value={form.slug}
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
      />
      <Textarea
        className="sm:col-span-2 min-h-20"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <Input
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
      />
      <div className="grid grid-cols-3 gap-2">
        <Input
          type="number"
          value={form.priceRupees}
          onChange={(e) => setForm({ ...form, priceRupees: Number(e.target.value) })}
        />
        <Input
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        />
        <Input
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
        />
      </div>
      <label className="flex h-11 items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
        />
        Active
      </label>
      <div className="flex gap-2">
        <Button onClick={save} disabled={busy}>
          {product ? "Save" : "Add cargo"}
        </Button>
        {product ? (
          <Button
            variant="wine"
            disabled={busy}
            onClick={async () => {
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
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function GalleryAdmin({
  items,
  onSaved,
}: {
  items: GalleryItem[];
  onSaved: () => Promise<void>;
}) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <GalleryRow key={item.id} item={item} onSaved={onSaved} />
      ))}
      <GalleryRow onSaved={onSaved} />
    </div>
  );
}

function GalleryRow({
  item,
  onSaved,
}: {
  item?: GalleryItem;
  onSaved: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(item?.image_url ?? null);
  const [form, setForm] = useState({
    imageUrl: item?.image_url ?? "",
    caption: item?.caption ?? "",
    sortOrder: item?.sort_order ?? 10,
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    try {
      // Convert file to base64
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      const { url } = await uploadImage({ data: { base64, mimeType: file.type } });
      setForm({ ...form, imageUrl: url });
      setPreview(url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3 rounded-[20px] bg-wood p-4 shadow-[0_0_0_1px_rgb(201_164_76_/_0.16)]">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label>Image</Label>
          <div className="mt-2 flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={busy}
            />
          </div>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 h-48 w-full rounded-lg object-cover"
            />
          )}
        </div>
        <div>
          <Label htmlFor="caption">Caption</Label>
          <Input
            id="caption"
            placeholder="Image caption"
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
          />
          <Label htmlFor="sortOrder" className="mt-2 block">
            Order
          </Label>
          <Input
            id="sortOrder"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={busy || !form.imageUrl}
          onClick={async () => {
            setBusy(true);
            try {
              await upsertGallery({ data: { ...form, id: item?.id } });
              toast.success("Gallery updated.");
              await onSaved();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not save.");
            } finally {
              setBusy(false);
            }
          }}
        >
          Save
        </Button>
        {item ? (
          <Button
            size="sm"
            variant="wine"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await deleteGallery({ data: item.id });
                await onSaved();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not delete.");
              } finally {
                setBusy(false);
              }
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function SessionsAdmin({
  sessions,
  onSaved,
}: {
  sessions: EventSession[];
  onSaved: () => Promise<void>;
}) {
  return (
    <div className="grid gap-4">
      {sessions.map((session) => (
        <SessionRow key={session.id} session={session} onSaved={onSaved} />
      ))}
      <SessionRow onSaved={onSaved} />
    </div>
  );
}

function SessionRow({
  session,
  onSaved,
}: {
  session?: EventSession;
  onSaved: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: session?.title ?? "",
    description: session?.description ?? "",
    dayLabel: session?.day_label ?? "",
    timeLabel: session?.time_label ?? "",
    sortOrder: session?.sort_order ?? 10,
  });
  return (
    <div className="grid gap-3 rounded-[20px] bg-wood p-4 shadow-[0_0_0_1px_rgb(201_164_76_/_0.16)]">
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          placeholder="Watch name"
          value={form.dayLabel}
          onChange={(e) => setForm({ ...form, dayLabel: e.target.value })}
        />
        <Input
          placeholder="Time"
          value={form.timeLabel}
          onChange={(e) => setForm({ ...form, timeLabel: e.target.value })}
        />
        <Input
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
        />
      </div>
      <Input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <Textarea
        className="min-h-20"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <div className="flex gap-2">
        <Button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await upsertSession({ data: { ...form, id: session?.id } });
              toast.success("Log updated.");
              await onSaved();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not save.");
            } finally {
              setBusy(false);
            }
          }}
        >
          Save
        </Button>
        {session ? (
          <Button
            variant="wine"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await deleteSession({ data: session.id });
                await onSaved();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not delete.");
              } finally {
                setBusy(false);
              }
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  );
}
