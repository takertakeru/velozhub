export type AuthUser = {
  id: string;
  email: string;
};

/** `token` is set by token-based providers (e.g. Cognito); cookie-based providers omit it. */
export type AuthSession = {
  user: AuthUser;
  token?: string;
};

export type AuthCredentials = {
  username: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
};

/** `done` = signed in. `confirmSignUp` = needs email verification. */
export type SignInResult =
  | { kind: "done"; session: AuthSession }
  | { kind: "confirmSignUp"; username: string };

export type SignUpResult =
  | { kind: "done"; session: AuthSession }
  | { kind: "confirmSignUp"; username: string };

/** Auth backend interface. One implementation is picked in `provider.ts`. */
export type AuthProvider = {
  readonly name: string;
  initialize?: () => void;
  getCurrentSession: () => Promise<AuthSession | null>;
  signIn: (credentials: AuthCredentials) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  signUp: (input: SignUpInput) => Promise<SignUpResult>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  resendSignUpCode: (username: string) => Promise<void>;
  resetPassword: (username: string) => Promise<void>;
  confirmResetPassword: (input: {
    username: string;
    code: string;
    newPassword: string;
  }) => Promise<void>;
};
