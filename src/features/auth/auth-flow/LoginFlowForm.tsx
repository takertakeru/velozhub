import "@/components/veloz/veloz.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import {
  initialVelozTheme,
  VelozMark,
  type VelozTheme,
} from "@/components/veloz/brand";
import * as Ic from "@/components/veloz/icons";
import { authProvider } from "@/features/auth/provider";
import { getErrorMessage } from "@/libs/query/query-error";

/**
 * VelozHub login, styled with the Veloz design system.
 *
 * Accounts are five pre-seeded family members managed by the household admin, so
 * instead of typing an email you pick your name (mapped to its Supabase email)
 * and enter the shared-style password. Behaviour is unchanged from before; only
 * the presentation now matches the rest of the app.
 */
const drivers = [
  { name: "Siekie", email: "siekie@gmail.com", color: "var(--c-mom)" },
  { name: "Joahn", email: "internationaljcb@gmail.com", color: "var(--c-dad)" },
  { name: "Takeru", email: "takertakeru@gmail.com", color: "var(--c-leo)" },
  { name: "Khyle", email: "sabrinakhyle@gmail.com", color: "var(--c-ana)" },
  { name: "Ian", email: "iankarl.epis123@gmail.com", color: "var(--c-marco)" },
];

const schema = z.object({
  name: z.string().min(1, "Please select your name."),
  password: z.string().min(1, "Password is required."),
});

type FormData = z.infer<typeof schema>;

export function LoginFlowForm() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<VelozTheme>(initialVelozTheme);
  const form = useForm<FormData>({
    defaultValues: { name: "", password: "" },
    resolver: zodResolver(schema),
  });

  const selectedName = form.watch("name");

  const onSubmitHandler = form.handleSubmit(async (data) => {
    const driver = drivers.find((d) => d.name === data.name);

    if (!driver) {
      return;
    }

    const result = await authProvider
      .signIn({ username: driver.email, password: data.password })
      .catch((error) => {
        form.setError("root", { message: getErrorMessage(error) });

        return null;
      });

    if (!result) {
      return;
    }
    if (result.kind === "confirmSignUp") {
      await authProvider.resendSignUpCode(result.username);
      void navigate({
        to: "/confirm-account",
        search: { email: result.username },
      });

      return;
    }

    void navigate({ to: "/dashboard" });
  });

  const rootError = form.formState.errors.root?.message;
  const nameError = form.formState.errors.name?.message;
  const passwordError = form.formState.errors.password?.message;
  const isLoading = form.formState.isSubmitting;

  return (
    <div className="veloz surface" data-theme={theme}>
      <div className="auth-shell">
        <form className="auth-card" onSubmit={onSubmitHandler}>
          <div className="auth-top">
            <div className="brandrow">
              <VelozMark className="mark" /> VelozHub
            </div>
            <button
              type="button"
              className="icon-btn"
              aria-label="Toggle theme"
              onClick={() => {
                setTheme((t) => (t === "dark" ? "light" : "dark"));
              }}
            >
              {theme === "dark" ? <Ic.Sun /> : <Ic.Moon />}
            </button>
          </div>

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">
            Pick your name and sign in to book the family Veloz.
          </p>

          {rootError && (
            <div className="warn" style={{ marginBottom: "var(--s5)" }}>
              <Ic.Alert />
              <div>
                <div className="w-title">Could not sign in</div>
                <div className="w-body">{rootError}</div>
              </div>
            </div>
          )}

          <div className="field" style={{ marginTop: 0 }}>
            <div className="grouplabel" id="namepick-label">
              Who are you?
            </div>
            <div
              className="namepick"
              role="group"
              aria-labelledby="namepick-label"
            >
              {drivers.map((d) => {
                return (
                  <button
                    key={d.name}
                    type="button"
                    className="namebtn"
                    aria-pressed={selectedName === d.name}
                    style={{ "--pc": d.color } as React.CSSProperties}
                    onClick={() => {
                      form.setValue("name", d.name, { shouldValidate: true });
                    }}
                  >
                    <span className="avatar">{d.name[0]}</span>
                    {d.name}
                  </button>
                );
              })}
            </div>
            {nameError && <FieldError message={nameError} />}
          </div>

          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="input"
              autoComplete="current-password"
              placeholder="Your password"
              {...form.register("password")}
            />
            {passwordError && <FieldError message={passwordError} />}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <div
      style={{
        color: "var(--danger)",
        fontSize: "var(--fs-sm)",
        fontWeight: 600,
        marginTop: "var(--s2)",
      }}
    >
      {message}
    </div>
  );
}
