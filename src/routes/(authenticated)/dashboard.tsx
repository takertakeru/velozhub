import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Text, Title } from "@/components/ui/text";
import { requireAuth } from "@/features/auth/utils/requireAuth";

export const Route = createFileRoute("/(authenticated)/dashboard")({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
  loader: async () => {
    const session = await requireAuth();

    return { session };
  },
});

function RouteComponent() {
  const { session } = Route.useLoaderData();

  return (
    <main className="min-h-svh bg-neutral-50 px-6 py-12 dark:bg-neutral-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header>
          <Title size="xxl">Dashboard</Title>
          <Text color="neutral">
            You&apos;re signed in as{" "}
            <strong>{session.user.email || session.user.id}</strong>. This route
            is the post-login destination, build your real app from here.
          </Text>
        </header>

        <Card>
          <Title size="sm">Next Steps</Title>
          <Text color="neutral" className="mt-2">
            Add feature folders under <code>src/features/</code>, mount their
            routes under <code>src/routes/(authenticated)/</code>, and they
            inherit the auth guard automatically.
          </Text>
        </Card>
      </div>
    </main>
  );
}
