import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: () => {
    // Fresh clone lands on /home (public welcome + setup status).
    // fresh clone for mvp frontend template would land on /home (public welcome + setup status) will be shown.

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: "/home" });
  },
});
