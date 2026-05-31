import { apiAuthProvider } from "./providers/api-provider";
import type { AuthProvider } from "./types";

/**
 * Auth provider. All auth (requireAuth, login, logout, etc.) goes through this.
 *
 * To use Cognito instead: just import `cognitoAuthProvider` from
 * `./provders/cognito-provider`, assign it below, and set the `VITE_COGNITO_*` env vars.
 */

export const authProvider: AuthProvider = apiAuthProvider;

export type {
  AuthCredentials,
  AuthSession,
  AuthUser,
  SignInResult,
  SignUpInput,
  SignUpResult,
} from "./types";
