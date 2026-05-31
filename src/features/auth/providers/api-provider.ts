import { z } from "zod";
import { api, baseAPI } from "@/libs/api/api";
import type {
  AuthCredentials,
  AuthProvider,
  AuthSession,
  SignInResult,
  SignUpInput,
  SignUpResult,
} from "../types";

/** Cookie-based auth. */

const userSchema = z.object({
  id: z.string(),
  email: z.string(),
});

const sessionResponseSchema = z.object({
  user: userSchema,
});

export const apiAuthProvider: AuthProvider = {
  name: "api",

  async getCurrentSession(): Promise<AuthSession | null> {
    try {
      const data = await api.get("/auth/me");
      const { user } = sessionResponseSchema.parse(data);

      return { user };
    } catch {
      return null;
    }
  },

  async signIn(credentials: AuthCredentials): Promise<SignInResult> {
    const data = await baseAPI
      .url("/auth/login")
      .headers({ Accept: "application/json" })
      .options({ credentials: "include" })
      .post({
        email: credentials.username,
        password: credentials.password,
      })
      .json();
    const { user } = sessionResponseSchema.parse(data);

    return {
      kind: "done",
      session: { user },
    };
  },

  async signOut() {
    await baseAPI
      .url("/auth/logout")
      .options({ credentials: "include" })
      .post()
      .res()
      .catch(() => undefined);
  },

  async signUp(input: SignUpInput): Promise<SignUpResult> {
    const data = await baseAPI
      .url("/auth/signup")
      .headers({ Accept: "application/json" })
      .options({ credentials: "include" })
      .post({ email: input.email, password: input.password })
      .json();
    const { user } = sessionResponseSchema.parse(data);

    return {
      kind: "done",
      session: { user },
    };
  },

  confirmSignUp() {
    return Promise.reject(new Error("confirmSignUp not implemented."));
  },

  resendSignUpCode() {
    return Promise.reject(new Error("resendSignUpCode not implemented."));
  },

  async resetPassword(username) {
    await baseAPI
      .url("/auth/password-reset")
      .headers({ Accept: "application/json" })
      .post({ email: username })
      .json();
  },

  async confirmResetPassword({ username, code, newPassword }) {
    await baseAPI
      .url("/auth/password-reset/confirm")
      .headers({ Accept: "application/json" })
      .post({
        email: username,
        code,
        newPassword,
      })
      .json();
  },
};
