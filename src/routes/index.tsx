import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: () => {
    // The root path goes straight to sign-in; there is no public landing page.

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: "/login" });
  },
});
