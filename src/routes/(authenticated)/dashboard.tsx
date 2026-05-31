import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "@/features/auth/utils/requireAuth";
import { VelozApp } from "@/features/booking/ui/VelozApp";

export const Route = createFileRoute("/(authenticated)/dashboard")({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
});

function RouteComponent() {
  return <VelozApp />;
}
