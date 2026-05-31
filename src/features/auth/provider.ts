import { supabaseAuthProvider } from "./providers/supabase-provider";
import type { AuthProvider } from "./types";

/**
 * Auth provider. All auth (requireAuth, login, logout, etc.) goes through this.
 *
 * VelozHub runs on Supabase email + password (five pre-seeded household
 * accounts). The other implementations (`apiAuthProvider`, `cognitoAuthProvider`)
 * remain in `./providers` if you ever want to swap back.
 */

export const authProvider: AuthProvider = supabaseAuthProvider;

export type {
  AuthCredentials,
  AuthSession,
  AuthUser,
  SignInResult,
  SignUpInput,
  SignUpResult,
} from "./types";
