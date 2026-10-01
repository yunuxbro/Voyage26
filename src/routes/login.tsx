import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { authClient, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { CompassRose } from "@/components/pirate/ornament";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!isPending && user) {
    void navigate({ to: "/admin" });
  }

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    if (!authEnabled) return;
    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "Captain",
        });
        if (error) throw new Error(error.message ?? "Could not sign up.");
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) throw new Error(error.message ?? "Could not sign in.");
      }
      toast.success("Welcome aboard.");
      await navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[80dvh] max-w-md place-items-center px-4 py-16">
      <div className="w-full rounded-[24px] bg-wood p-6 shadow-[0_0_0_1px_rgb(201_164_76_/_0.25)] sm:p-8">
        <CompassRose className="mx-auto size-10" />
        <h1 className="font-display mt-4 text-center text-2xl text-gold">
          {mode === "in" ? "Sign in" : "Create an account"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Officers of the fleet use this hatch. Delegates register on the
          public berth.
        </p>

        {authEnabled ? (
          <>
            <form className="mt-6 grid gap-3" onSubmit={onEmail}>
              {mode === "up" ? (
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              ) : null}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "up" ? "new-password" : "current-password"}
                  minLength={8}
                  required
                />
              </div>
              <Button type="submit" className="mt-2 w-full" disabled={busy}>
                {busy ? "Holding…" : mode === "in" ? "Sign in" : "Sign up"}
              </Button>
            </form>

            <button
              type="button"
              className="mt-3 w-full text-center text-sm text-gold hover:text-gold-2"
              onClick={() => setMode(mode === "in" ? "up" : "in")}
            >
              {mode === "in"
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </button>

          </>
        ) : (
          <p className="mt-6 text-center text-sm text-muted">Sign-in is disabled.</p>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          Looking for a berth?{" "}
          <Link to="/register" className="text-gold">
            Register as a delegate
          </Link>
        </p>
      </div>
    </div>
  );
}
