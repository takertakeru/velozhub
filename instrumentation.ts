// eslint-disable-next-line @typescript-eslint/naming-convention
import * as Sentry from "@sentry/react";
import { env } from "@/env";

export const initializeInstrumentation = (router: any) => {
  return Sentry.init({
    dsn: env.VITE_SENTRY_DSN,

    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
  });
};
