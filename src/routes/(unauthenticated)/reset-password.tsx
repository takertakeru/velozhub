import "@/components/veloz/veloz.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  initialVelozTheme,
  persistVelozTheme,
  VelozMark,
  type VelozTheme,
} from "@/components/veloz/brand";
import * as Ic from "@/components/veloz/icons";
import { authProvider } from "@/features/auth/provider";
import { getErrorMessage } from "@/libs/query/query-error";

/**
 * Password reset, Veloz-styled.
 *
 * Supabase sends a recovery **link** (not a code), so this is a single screen:
 * enter your email, we send the link, and you set a new password after clicking
 * it (the recovery session opens automatically via `detectSessionInUrl`).
 */
export const Route = createFileRoute("/(unauthenticated)/reset-password")({
  component: RouteComponent,
});

const schema = z.object({ email: z.email("Enter a valid email address.") });

type FormData = z.infer<typeof schema>;

function RouteComponent() {
  const [theme, setTheme] = useState<VelozTheme>(initialVelozTheme);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const form = useForm<FormData>({
    defaultValues: { email: "" },
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await authProvider.resetPassword(data.email);
      setSentTo(data.email);
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  });

  const rootError = form.formState.errors.root?.message;
  const emailError = form.formState.errors.email?.message;
  const isLoading = form.formState.isSubmitting;

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";

      persistVelozTheme(next);

      return next;
    });
  };

  return (
    <div className="veloz surface" data-theme={theme}>
      <div className="auth-shell">
        {sentTo ? (
          <div className="auth-card">
            <AuthTop theme={theme} onToggleTheme={toggleTheme} />
            <h1 className="auth-title">Check your inbox</h1>
            <p className="auth-sub">
              We sent a password reset link to <b>{sentTo}</b>. Open it on this
              device to set a new password.
            </p>
            <Link to="/login" className="btn btn-primary btn-block">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form className="auth-card" onSubmit={onSubmit}>
            <AuthTop theme={theme} onToggleTheme={toggleTheme} />
            <h1 className="auth-title">Reset password</h1>
            <p className="auth-sub">
              Enter your email and we&apos;ll send a link to reset it.
            </p>

            {rootError && (
              <div className="warn" style={{ marginBottom: "var(--s5)" }}>
                <Ic.Alert />
                <div>
                  <div className="w-title">Could not send the link</div>
                  <div className="w-body">{rootError}</div>
                </div>
              </div>
            )}

            <div className="field" style={{ marginTop: 0 }}>
              <label htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                type="email"
                className="input"
                autoComplete="email"
                placeholder="you@example.com"
                {...form.register("email")}
              />
              {emailError && (
                <div
                  style={{
                    color: "var(--danger)",
                    fontSize: "var(--fs-sm)",
                    fontWeight: 600,
                    marginTop: "var(--s2)",
                  }}
                >
                  {emailError}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.6 : 1, marginTop: "var(--s6)" }}
            >
              {isLoading ? "Sending…" : "Send reset link"}
            </button>

            <p
              style={{
                textAlign: "center",
                marginTop: "var(--s5)",
                fontSize: "var(--fs-sm)",
                color: "var(--ink-2)",
              }}
            >
              Remembered it?{" "}
              <Link to="/login" style={{ fontWeight: 700, color: "var(--ink)" }}>
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function AuthTop({
  theme,
  onToggleTheme,
}: {
  theme: VelozTheme;
  onToggleTheme: () => void;
}) {
  return (
    <div className="auth-top">
      <div className="brandrow">
        <VelozMark className="mark" /> VelozHub
      </div>
      <button
        type="button"
        className="icon-btn"
        aria-label="Toggle theme"
        onClick={onToggleTheme}
      >
        {theme === "dark" ? <Ic.Sun /> : <Ic.Moon />}
      </button>
    </div>
  );
}
