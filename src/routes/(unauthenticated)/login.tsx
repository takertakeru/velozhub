import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginFlowForm } from "@/features/auth/auth-flow/LoginFlowForm";
import { authProvider } from "@/features/auth/provider";

export const Route = createFileRoute("/(unauthenticated)/login")({
  component: App,
  async loader() {
    const session = await authProvider.getCurrentSession();

    if (session) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: "/dashboard" });
    }
  },
});

function App() {
  return <LoginFlowForm />;
}
