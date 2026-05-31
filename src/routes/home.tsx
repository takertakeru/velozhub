import {
  ArrowRightIcon,
  ArrowSquareOutIcon,
  BookOpenIcon,
  ChartLineIcon,
  CodeIcon,
  GearIcon,
  LightningIcon,
  PaletteIcon,
  PlugsConnectedIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SignInIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code, Text, Title } from "@/components/ui/text";
import { cn } from "@/components/ui/utils";
import { env } from "@/env";
import { authProvider } from "@/features/auth/provider";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

type Status = "ready" | "skipped" | "action";

type SetupItem = {
  icon: React.ElementType;
  label: string;
  status: Status;
  description: string;
  hint?: string;
};

function buildAuthSetupItem(): SetupItem {
  const isCognito = authProvider.name === "cognito";
  const hasCognitoConfig = Boolean(
    env.VITE_COGNITO_POOL_ID && env.VITE_COGNITO_CLIENT_ID,
  );

  if (!isCognito) {
    return {
      icon: ShieldCheckIcon,
      label: "Authentication",
      status: "ready",
      description: `Backend provider. Auth flows hit ${env.VITE_API_URL}. Sessions are kept in an HttpOnly cookie set by your backend.`,
    };
  }

  if (!hasCognitoConfig) {
    return {
      icon: ShieldCheckIcon,
      label: "Authentication",
      status: "action",
      description:
        "Cognito provider selected but VITE_COGNITO_POOL_ID / VITE_COGNITO_CLIENT_ID are missing in .env.local.",
    };
  }

  return {
    icon: ShieldCheckIcon,
    label: "Authentication",
    status: "ready",
    description:
      "Cognito provider. Sign-in, sign-up, and password reset go through AWS Amplify.",
  };
}

function buildSetupItems(): Array<SetupItem> {
  return [
    buildAuthSetupItem(),
    {
      icon: PlugsConnectedIcon,
      label: "API",
      status: "ready",
      description: `Pointed at ${env.VITE_API_URL}.`,
    },
    {
      icon: ChartLineIcon,
      label: "Analytics",
      status: env.VITE_PUBLIC_POSTHOG_KEY ? "ready" : "skipped",
      description: env.VITE_PUBLIC_POSTHOG_KEY
        ? "PostHog is configured."
        : "PostHog is off. Events log to the browser console.",
    },
    {
      icon: WarningCircleIcon,
      label: "Error monitoring",
      status: env.VITE_SENTRY_DSN ? "ready" : "skipped",
      description: env.VITE_SENTRY_DSN
        ? "Sentry is enabled."
        : "Sentry is off. Errors stay in the browser console.",
    },
  ];
}

const statusMeta: Record<Status, { label: string; classes: string }> = {
  ready: {
    label: "Ready",
    classes: "bg-brand-success-muted text-brand-success-text",
  },
  skipped: {
    label: "Off",
    classes: "bg-brand-neutral-muted text-brand-neutral-text",
  },
  action: {
    label: "Action needed",
    classes: "bg-brand-warning-muted text-brand-warning-text",
  },
};

function StatusPill({ status }: { status: Status }) {
  const meta = statusMeta[status];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        meta.classes,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

function RouteComponent() {
  const items = buildSetupItems();
  const isDev = import.meta.env.DEV;

  return (
    <main className="min-h-svh bg-neutral-50 px-6 py-12 dark:bg-neutral-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12">
        <section className="flex flex-col gap-4">
          <span className="bg-brand-info-muted text-brand-info-text inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <RocketLaunchIcon className="size-3.5" weight="fill" />
            Template starter
          </span>

          <Title size="xxl" className="text-balance">
            Welcome to your MVP frontend
          </Title>

          <Text size="lg" className="max-w-2xl">
            React 19, TanStack Router, Tailwind 4, and a built-in design
            system, all wired up. This page is public and shows the current
            state of your local setup. The actual app lives behind auth at{" "}
            <Code>/dashboard</Code>.
          </Text>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button href="/login" variant="solid" color="primary">
              <SignInIcon />
              Sign in to dashboard
            </Button>
            {isDev && (
              <>
                <Button href="/preview" variant="outline">
                  <PaletteIcon />
                  Component preview
                </Button>
                <Button href="/layout-preview" variant="outline">
                  <CodeIcon />
                  Layout preview
                </Button>
              </>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <Title size="md">Setup status</Title>
            <Text color="neutral" size="xs">
              Auto-detected from your <Code>.env.local</Code>
            </Text>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <SetupCard key={item.label} item={item} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <Title size="md">Where to next</Title>
          <Card>
            <ul className="divide-brand-neutral-muted/40 -my-3 divide-y">
              <NextStep
                icon={BookOpenIcon}
                title="Read the README"
                description="Project structure, env vars, the auth provider choice, and deployment notes, all in one place."
              />
              {authProvider.name === "cognito" ? (
                <NextStep
                  icon={GearIcon}
                  title="Verify your Cognito setup"
                  description="Confirm the user pool has an app client configured for USER_PASSWORD_AUTH and that the VITE_COGNITO_* env vars in .env.local match the pool."
                />
              ) : (
                <NextStep
                  icon={GearIcon}
                  title="Implement the backend auth contract"
                  description="Your backend needs POST /auth/login, POST /auth/logout, GET /auth/me, POST /auth/signup, POST /auth/password-reset, and POST /auth/password-reset/confirm, and must set an HttpOnly session cookie on login. See src/features/auth/providers/api-provider.ts for the full contract."
                />
              )}
              {isDev && (
                <NextStep
                  icon={PaletteIcon}
                  title="Browse the design system"
                  description="The /preview route showcases every component you can use."
                  to="/preview"
                />
              )}
              <NextStep
                icon={CodeIcon}
                title="Add a new route"
                description="Drop a .tsx file in src/routes/ and TanStack Router picks it up automatically."
              />
              <NextStep
                icon={LightningIcon}
                title="Hook up the API"
                description={`Wretch is ready at ${env.VITE_API_URL}. Define endpoints in src/features/<name>/api/.`}
              />
            </ul>
          </Card>
        </section>

        <footer className="pt-2 text-center">
          <Text size="xs" color="neutral">
            Built with React, TanStack Router, Tailwind, and React Aria.
          </Text>
        </footer>
      </div>
    </main>
  );
}

function SetupCard({ item }: { item: SetupItem }) {
  const Icon = item.icon;

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-brand-neutral-muted text-brand-neutral-text rounded-lg p-2">
            <Icon className="size-5" />
          </div>
          <Title size="sm">{item.label}</Title>
        </div>
        <StatusPill status={item.status} />
      </div>
      <Text className="mt-3" color="neutral">
        {item.description}
      </Text>
      {item.hint && (
        <Text size="xs" color="warning" className="mt-2">
          {item.hint}
        </Text>
      )}
    </Card>
  );
}

type NextStepProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  /** Internal route. */
  to?: string;
  /** External link. */
  href?: string;
};

function NextStep({ icon: Icon, title, description, to, href }: NextStepProps) {
  const body = (
    <div className="flex items-center gap-4 py-3">
      <div className="bg-brand-neutral-muted text-brand-neutral-text rounded-lg p-2">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-brand-neutral-text font-medium dark:text-white">
          {title}
        </p>
        <Text size="xs" color="neutral">
          {description}
        </Text>
      </div>
      {(to ?? href) && (
        <span className="text-brand-neutral-text shrink-0">
          {href ? (
            <ArrowSquareOutIcon className="size-4" />
          ) : (
            <ArrowRightIcon className="size-4" />
          )}
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <li>
        <Link
          to={to}
          className="hover:bg-brand-neutral-muted/50 -mx-4 block rounded-md px-4 transition-colors"
        >
          {body}
        </Link>
      </li>
    );
  }

  if (href) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="hover:bg-brand-neutral-muted/50 -mx-4 block rounded-md px-4 transition-colors"
        >
          {body}
        </a>
      </li>
    );
  }

  return <li>{body}</li>;
}
