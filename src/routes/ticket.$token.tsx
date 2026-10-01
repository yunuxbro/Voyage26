import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  checkInRegistration,
  getAdminTicketDetails,
  getTicketStatus,
  verifyAdminAccess,
  type Registration,
} from "@/lib/server/mongo-voyage";
import { formatInr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

type TicketDetails = Registration & {
  shopPurchases: {
    publicId: string;
    amountCents: number;
    createdAt: string;
    items: { name: string; qty: number; unit_price_cents: number }[];
  }[];
};

export const Route = createFileRoute("/ticket/$token")({
  loader: ({ params }) => getTicketStatus({ data: params.token }),
  component: TicketPage,
});

function TicketPage() {
  const { token } = Route.useParams();
  const status = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const [adminCode, setAdminCode] = useState("");
  const [details, setDetails] = useState<TicketDetails | null>(null);
  const [busy, setBusy] = useState(false);

  async function unlock(e: FormEvent) {
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

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">Voyage '26 ticket</p>
      <h1 className="font-display mt-2 text-display-sm text-parchment">Registration lookup</h1>
      {!status.found ? (
        <p className="mt-6 border-y border-gold/20 py-5 text-sm text-muted">This ticket could not be found.</p>
      ) : (
        <>
          <dl className="mt-6 grid gap-4 border-y border-gold/20 py-5 sm:grid-cols-2">
            <div><dt className="text-xs text-muted">Payment review</dt><dd className="mt-1 text-parchment">{status.paymentStatus}</dd></div>
            <div><dt className="text-xs text-muted">Check-in</dt><dd className="mt-1 text-parchment">{status.checkedIn ? "Checked in" : "Not checked in"}</dd></div>
          </dl>
          {details ? (
            <section className="mt-8" aria-labelledby="applicant-details">
              <h2 id="applicant-details" className="font-display text-2xl text-parchment">Applicant details</h2>
              <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <div><dt className="text-xs text-muted">Name</dt><dd className="mt-1 text-parchment">{details.full_name}</dd></div>
                <div><dt className="text-xs text-muted">Package</dt><dd className="mt-1 text-parchment">{details.delegate_option}</dd></div>
                <div><dt className="text-xs text-muted">Email</dt><dd className="mt-1 break-all text-parchment">{details.email}</dd></div>
                <div><dt className="text-xs text-muted">IIT email</dt><dd className="mt-1 break-all text-parchment">{details.iit_email}</dd></div>
                <div><dt className="text-xs text-muted">Phone</dt><dd className="mt-1 text-parchment">{details.phone}</dd></div>
                <div><dt className="text-xs text-muted">Payment reference</dt><dd className="mt-1 text-parchment">{details.payment_ref}</dd></div>
                <div><dt className="text-xs text-muted">Amount due</dt><dd className="mt-1 text-parchment">{formatInr(details.amount_cents)}</dd></div>
                <div><dt className="text-xs text-muted">Amount paid</dt><dd className="mt-1 text-gold">{formatInr(details.amount_paid_cents)}</dd></div>
                <div><dt className="text-xs text-muted">Payment status</dt><dd className="mt-1 text-parchment">{details.payment_status}</dd></div>
                <div><dt className="text-xs text-muted">Submitted</dt><dd className="mt-1 text-parchment">{new Date(details.payment_submitted_at ?? details.created_at).toLocaleString("en-IN")}</dd></div>
              </dl>
              {details.payment_review_note ? <p className="mt-4 text-sm text-muted">Review note: {details.payment_review_note}</p> : null}
              <section className="mt-8 border-t border-gold/20 pt-5" aria-labelledby="shop-purchases">
                <h2 id="shop-purchases" className="font-display text-xl text-parchment">Shop purchases</h2>
                {details.shopPurchases.length ? (
                  <div className="mt-4 grid gap-4">
                    {details.shopPurchases.map((purchase) => (
                      <div key={purchase.publicId} className="border-b border-gold/10 pb-4">
                        <div className="flex flex-wrap justify-between gap-2 text-sm">
                          <span className="text-muted">{purchase.publicId}</span>
                          <span className="text-gold">{formatInr(purchase.amountCents)}</span>
                        </div>
                        <ul className="mt-2 grid gap-1 text-sm text-parchment">
                          {purchase.items.map((item) => (
                            <li key={`${purchase.publicId}-${item.name}`}>{item.name} × {item.qty}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : <p className="mt-2 text-sm text-muted">No shop orders matched this delegate email.</p>}
              </section>
              {details.payment_status === "approved" && !details.checked_in_at ? (
                <Button className="mt-6" type="button" disabled={busy} onClick={() => void checkIn()}>
                  {busy ? "Checking in…" : "Check in delegate"}
                </Button>
              ) : null}
              {details.checked_in_at ? <p className="mt-6 text-sm text-gold">Checked in at {new Date(details.checked_in_at).toLocaleString("en-IN")}</p> : null}
            </section>
          ) : isPending ? (
            <p className="mt-8 text-sm text-muted">Checking sign-in…</p>
          ) : user ? (
            <form className="mt-8 grid max-w-md gap-4" onSubmit={unlock}>
              <div>
                <Label htmlFor="ticketAdminCode">Admin code to view applicant and payment details</Label>
                <Input id="ticketAdminCode" type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required />
              </div>
              <Button type="submit" disabled={busy}>{busy ? "Verifying…" : "View details"}</Button>
            </form>
          ) : (
            <p className="mt-8 text-sm text-muted">
              <Link to="/login" className="text-gold underline underline-offset-4">Sign in</Link> with an authorized account to view applicant details.
            </p>
          )}
        </>
      )}
    </main>
  );
}
