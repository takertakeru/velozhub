import { supabase } from "@/libs/supabase/client";
import type {
  AuthCredentials,
  AuthProvider,
  AuthSession,
  SignInResult,
} from "../types";

/**
 * Supabase email + password auth.
 *
 * VelozHub runs on five pre-seeded accounts (created by the household admin in
 * the Supabase dashboard), so public sign-up and email confirmation are closed.
 * Every signed-in user has a real `auth.uid()`, which is what the Postgres RLS
 * policies key off. The token is surfaced on the session for completeness, but
 * the supabase-js client already attaches it to every PostgREST and Realtime
 * request automatically.
 */

function closed(action: string): Promise<never> {
  return Promise.reject(
    new Error(`${action} is disabled. Accounts are managed by the household admin.`),
  );
}

export const supabaseAuthProvider: AuthProvider = {
  name: "supabase",

  async getCurrentSession(): Promise<AuthSession | null> {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session?.user) return null;

    return {
      user: { id: session.user.id, email: session.user.email ?? "" },
      token: session.access_token,
    };
  },

  async signIn(credentials: AuthCredentials): Promise<SignInResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.username,
      password: credentials.password,
    });
    if (error) throw error;

    return {
      kind: "done",
      session: {
        user: { id: data.user.id, email: data.user.email ?? "" },
        token: data.session?.access_token,
      },
    };
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  signUp() {
    return closed("Sign-up");
  },
  confirmSignUp() {
    return closed("Email confirmation");
  },
  resendSignUpCode() {
    return closed("Resend code");
  },

  async resetPassword(username: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(username);
    if (error) throw error;
  },

  async confirmResetPassword(input: { newPassword: string }): Promise<void> {
    // Runs inside the recovery session opened from the reset email link.
    const { error } = await supabase.auth.updateUser({ password: input.newPassword });
    if (error) throw error;
  },
};
