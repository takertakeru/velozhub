// Sentry initialization should be imported first!
// eslint-disable-next-line simple-import-sort/imports
import { StrictMode } from "react";
import { initializeInstrumentation } from "../instrumentation.ts";
import "./styles.css";

import * as Sentry from "@sentry/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
// eslint-disable-next-line @typescript-eslint/naming-convention
import ReactDOM from "react-dom/client";
import { ConsoleStrategy, PostHogStrategy } from "./libs/analytics";
import { AnalyticsProvider } from "./libs/analytics/analytics-provider.tsx";
import { queryClient } from "./libs/query/query-client.tsx";
import reportWebVitals from "./reportWebVitals.ts";
// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

// Initialize instrumentation
initializeInstrumentation(router);

// Render the app
const rootElement = document.querySelector("#app");
const createAnalyticsClient = () => {
  if (import.meta.env.DEV) {
    return new ConsoleStrategy();
  }

  return new PostHogStrategy();
};

if (rootElement !== null) {
  const root = ReactDOM.createRoot(rootElement, {
    // Callback called when an error is thrown and not caught by an ErrorBoundary.
    onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
      console.warn("Uncaught error", error, errorInfo.componentStack);
    }),
    // Callback called when React catches an error in an ErrorBoundary.
    onCaughtError: Sentry.reactErrorHandler(),
    // Callback called when React automatically recovers from errors.
    onRecoverableError: Sentry.reactErrorHandler(),
  });

  root.render(
    <StrictMode>
      <AnalyticsProvider strategy={createAnalyticsClient()}>
        <RouterProvider router={router} />
      </AnalyticsProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
