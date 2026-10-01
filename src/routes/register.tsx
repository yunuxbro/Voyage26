import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  delegateOptions,
  getRegistrationPaymentSettings,
  getSite,
  registerDelegate,
  type DelegateOption,
} from "@/lib/server/mongo-voyage";
import { Button } from "@/components/ui/button";
import { formatInr, makeQrCodeUrl } from "@/lib/utils";
import { Input, Label, Select } from "@/components/ui/field";

export const Route = createFileRoute("/register")({
  loader: async () => {
    const [site, paymentSettings] = await Promise.all([
      getSite(),
      getRegistrationPaymentSettings(),
    ]);
    return { site, paymentSettings };
  },
  component: RegisterPage,
});

type RegistrationReceipt = {
  paymentRef: string;
  ticketToken: string;
  amountCents: number;
};

function RegisterPage() {
  const { site, paymentSettings } = Route.useLoaderData();
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<RegistrationReceipt | null>(null);
  const [ticketQr, setTicketQr] = useState("");
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [form, setForm] = useState<{
    fullName: string;
    email: string;
    iitEmail: string;
    phone: string;
    delegateOption: DelegateOption;
    shirtSize: string;
  }>({
    fullName: "",
    email: "",
    iitEmail: "",
    phone: "",
    delegateOption: delegateOptions[0],
    shirtSize: "",
  });

  const selectedAmount = paymentSettings.package_prices[form.delegateOption as DelegateOption] ?? 0;
  const includesShirt = form.delegateOption.includes("T-shirt");
  const registrationOpen = Boolean(
    paymentSettings.account_holder &&
      paymentSettings.bank_name &&
      paymentSettings.account_number &&
      paymentSettings.ifsc_code &&
      (form.delegateOption === "Register only" ? selectedAmount >= 0 : selectedAmount > 0),
  );

  useEffect(() => {
    if (!receipt) return;
    const ticketUrl = `${window.location.origin}/ticket/${receipt.ticketToken}`;
    setTicketQr(makeQrCodeUrl(ticketUrl, "240x240"));
  }, [receipt]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (selectedAmount > 0 && !slipFile) {
      toast.error("Upload your bank transfer slip to continue.");
      return;
    }
    if (slipFile && slipFile.size > 2 * 1024 * 1024) {
      toast.error("Payment slips must be smaller than 2 MB.");
      return;
    }
    setBusy(true);
    try {
      let slipBase64 = "";
      if (slipFile) {
        const bytes = new Uint8Array(await slipFile.arrayBuffer());
        let binary = "";
        for (let offset = 0; offset < bytes.length; offset += 0x8000) {
          binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
        }
        slipBase64 = btoa(binary);
      }
      const result = await registerDelegate({
        data: {
          fullName: form.fullName,
          email: form.email,
          iitEmail: form.iitEmail,
          phone: form.phone,
          delegateOption: form.delegateOption as DelegateOption,
          shirtSize: form.shirtSize,
          slipBase64,
          slipContentType: slipFile?.type ?? "",
          slipFileName: slipFile?.name ?? "",
        },
      });
      setReceipt(result);
      toast.success("Registration submitted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setBusy(false);
    }
  }

  if (receipt) {
    return (
      <div className="mx-auto grid max-w-3xl gap-8 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">Registration submitted</p>
          <h1 className="font-display mt-3 text-display-sm text-parchment">Your berth is pending approval</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {receipt.amountCents > 0
              ? "We have your registration and transfer slip. The team will review the payment within 24 hours."
              : "Your registration is in the review queue. The team will review it within 24 hours."}
          </p>
          <dl className="mt-7 grid gap-3 border-y border-gold/20 py-5 text-sm sm:grid-cols-2">
            <div><dt className="text-muted">Payment reference</dt><dd className="mt-1 text-parchment">{receipt.paymentRef}</dd></div>
            <div><dt className="text-muted">Package amount</dt><dd className="mt-1 text-gold">{formatInr(receipt.amountCents)}</dd></div>
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            Keep this ticket for check-in. Your QR links to a protected ticket lookup; applicant details are visible to authorized admins only.
          </p>
        </div>
        <div className="grid justify-items-center gap-3">
          {ticketQr ? <img src={ticketQr} alt="Registration ticket QR code" className="h-60 w-60 bg-white p-2" /> : <div className="h-60 w-60 animate-pulse bg-wood" />}
          <span className="text-xs tracking-[0.16em] text-gold">{receipt.paymentRef}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">
        Delegate registration
      </p>
      <h1 className="font-display mt-2 text-display-sm text-parchment">
        Take a berth on {site.event_title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {site.venue}. Choose a merchandise package or register without one.
      </p>
      {paymentSettings.registration_image_url ? (
        <img
          src={paymentSettings.registration_image_url}
          alt="Voyage registration details"
          className="mt-6 aspect-[3/1] w-full object-cover"
        />
      ) : null}

      <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="fullName">Name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="iitEmail">Email address (IIT email if you are an IITian)</Label>
            <Input
              id="iitEmail"
              type="email"
              value={form.iitEmail}
              onChange={(e) => setForm({ ...form, iitEmail: e.target.value })}
              placeholder="name@iit…"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone number (WhatsApp preferred)</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="delegateOption">Package</Label>
          <Select
            id="delegateOption"
            value={form.delegateOption}
            onChange={(e) => setForm({ ...form, delegateOption: e.target.value as DelegateOption })}
            required
          >
            {delegateOptions.map((option) => (
              <option key={option} value={option} disabled={option !== "Register only" && paymentSettings.package_prices[option] <= 0}>
                {option === "Register only" ? "Register only (no merchandise)" : option} - {paymentSettings.package_prices[option] > 0 ? formatInr(paymentSettings.package_prices[option]) : option === "Register only" ? formatInr(0) : "Not configured"}
              </option>
            ))}
          </Select>
        </div>

        {includesShirt ? (
          <div className="grid gap-4 border-y border-gold/20 py-5 sm:grid-cols-[minmax(0,1fr)_14rem] sm:items-center">
            <img
              src={paymentSettings.shirt_image_url}
              alt="Sample Voyage T-shirt"
              className="h-56 w-full bg-white/5 object-contain p-3"
            />
            <div>
              <Label htmlFor="shirtSize">T-shirt size</Label>
              <Select
                id="shirtSize"
                value={form.shirtSize}
                onChange={(e) => setForm({ ...form, shirtSize: e.target.value })}
                required
              >
                <option value="" disabled>Choose a size</option>
                {paymentSettings.shirt_sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </Select>
            </div>
          </div>
        ) : null}

        <section className="grid gap-3 border-y border-gold/20 py-5" aria-labelledby="transfer-heading">
          <div>
            <h2 id="transfer-heading" className="font-display text-xl text-parchment">Bank transfer</h2>
            <p className="mt-1 text-xs text-muted">{selectedAmount > 0 ? "Transfer the exact package amount, then attach the receipt below." : "No package payment is due for this selection."}</p>
          </div>
          {registrationOpen ? (
            <>
            {paymentSettings.demo_transfer_mode ? (
              <p className="border border-red-400/40 bg-red-950/30 p-3 text-sm font-medium text-red-200">
                DEMO ONLY: These fictional bank details cannot receive money. Do not make a transfer.
              </p>
            ) : null}
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-muted">Account name</dt><dd className="text-parchment">{paymentSettings.account_holder}</dd></div>
              <div><dt className="text-muted">Bank</dt><dd className="text-parchment">{paymentSettings.bank_name}</dd></div>
              <div><dt className="text-muted">Account number</dt><dd className="text-parchment">{paymentSettings.account_number}</dd></div>
              <div><dt className="text-muted">IFSC</dt><dd className="text-parchment">{paymentSettings.ifsc_code}</dd></div>
              {paymentSettings.upi_id ? <div><dt className="text-muted">UPI ID</dt><dd className="text-parchment">{paymentSettings.upi_id}</dd></div> : null}
              <div><dt className="text-muted">Amount due</dt><dd className="font-medium text-gold">{formatInr(selectedAmount)}</dd></div>
            </dl>
            </>
          ) : (
            <p className="text-sm text-muted">This package is not available yet. The admin must configure its transfer price first.</p>
          )}
        </section>

        {selectedAmount > 0 ? <div>
          <Label htmlFor="paymentSlip">Bank transfer slip (PDF, PNG, or JPEG; max 2 MB)</Label>
          <Input
            id="paymentSlip"
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            onChange={(e) => setSlipFile(e.target.files?.[0] ?? null)}
            required={selectedAmount > 0}
          />
          {slipFile ? <p className="mt-2 text-xs text-muted">Selected: {slipFile.name}</p> : null}
        </div> : null}
        <Button type="submit" size="lg" disabled={busy || !registrationOpen}>
          {busy ? "Submitting…" : "Submit registration"}
        </Button>
        <p className="text-center text-xs text-muted">Submissions are reviewed by the admin team within 24 hours.</p>
      </form>
    </div>
  );
}
