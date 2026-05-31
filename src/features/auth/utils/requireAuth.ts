import { type LinkProps, redirect } from "@tanstack/react-router";
import { authProvider } from "@/features/auth/provider";

type RedirectTo = LinkProps["to"];

export async function requireAuth({
  redirectTo = "/login",
}: {
  redirectTo?: RedirectTo;
} = {}) {
  const session = await authProvider.getCurrentSession();

  if (!session) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: redirectTo });
  }

  return session;
}
