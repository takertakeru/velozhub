import { createFileRoute, redirect } from "@tanstack/react-router";
import { authProvider } from "@/features/auth/provider";
import { queryClient } from "@/libs/query/query-client";

export const Route = createFileRoute("/logout")({
  async loader() {
    await authProvider.signOut().catch(() => undefined);
    queryClient.clear();
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: "/login" });
  },
});
