import { Amplify } from "aws-amplify";
import {
  confirmResetPassword as amplifyConfirmResetPassword,
  confirmSignUp as amplifyConfirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  resendSignUpCode as amplifyResendSignUpCode,
  resetPassword as amplifyResetPassword,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signUp as amplifySignUp,
} from "aws-amplify/auth";
import { env } from "@/env";
import type {
  AuthCredentials,
  AuthProvider,
  AuthSession,
  SignInResult,
  SignUpInput,
  SignUpResult,
} from "../types";

let isConfigured = false;

function configureAmplify() {
  if (isConfigured) {
    return;
  }

  if (!env.VITE_COGNITO_POOL_ID || !env.VITE_COGNITO_CLIENT_ID) {
    throw new Error(
      "[auth] Missing VITE_COGNITO_POOL_ID / VITE_COGNITO_CLIENT_ID.",
    );
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: env.VITE_COGNITO_CLIENT_ID,
        userPoolId: env.VITE_COGNITO_POOL_ID,
        loginWith: { email: true },
      },
    },
  });
  isConfigured = true;
}

export const cognitoAuthProvider: AuthProvider = {
  name: "cognito",

  initialize() {
    configureAmplify();
  },

  async getCurrentSession(): Promise<AuthSession | null> {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken.toString();

      return {
        user: {
          id: user.userId,
          email: user.signInDetails?.loginId ?? "",
        },
        token,
      };
    } catch {
      return null;
    }
  },

  async signIn(credentials: AuthCredentials): Promise<SignInResult> {
    const result = await amplifySignIn({
      username: credentials.username,
      password: credentials.password,
    });

    const step = result.nextStep.signInStep;

    if (step === "CONFIRM_SIGN_UP") {
      return { kind: "confirmSignUp", username: credentials.username };
    }

    if (step === "DONE") {
      const session = await cognitoAuthProvider.getCurrentSession();

      if (!session) {
        throw new Error(
          "Cognito sign-in completed but no session is available",
        );
      }

      return { kind: "done", session };
    }

    throw new Error(`Unhandled Cognito sign-in step: ${step}`);
  },

  async signOut() {
    await amplifySignOut({ global: true });
  },

  async signUp(input: SignUpInput): Promise<SignUpResult> {
    const result = await amplifySignUp({
      username: input.email,
      password: input.password,
      options: {
        userAttributes: { email: input.email },
      },
    });

    if (result.isSignUpComplete) {
      const session = await cognitoAuthProvider.getCurrentSession();

      if (session) {
        return { kind: "done", session };
      }
    }

    return { kind: "confirmSignUp", username: input.email };
  },

  async confirmSignUp(username, code) {
    await amplifyConfirmSignUp({
      username,
      confirmationCode: code,
    });
  },

  async resendSignUpCode(username) {
    await amplifyResendSignUpCode({ username });
  },

  async resetPassword(username) {
    await amplifyResetPassword({ username });
  },

  async confirmResetPassword({ username, code, newPassword }) {
    await amplifyConfirmResetPassword({
      username,
      newPassword,
      confirmationCode: code,
    });
  },
};
