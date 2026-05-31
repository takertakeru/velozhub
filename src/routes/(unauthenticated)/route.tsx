import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authProvider } from "@/features/auth/provider";

// if switching to Cognito, move this to main.tsx so it runs at app boot.
authProvider.initialize?.();

export const Route = createFileRoute("/(unauthenticated)")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
