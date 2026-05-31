/**
 * Analytics Module
 * Simplified, flexible analytics with progressive type safety.
 */

// Core types and interfaces
export type {
  AnalyticsClient as AnalyticsClientCore,
  AnalyticsConfig,
  AnalyticsContextValue,
  AnalyticsEventMap,
  AnalyticsStrategy,
} from "./types";

// Strategy implementations
export {
  type ConsoleConfig,
  ConsoleStrategy,
} from "./strategies/console-strategy";
export {
  type PostHogConfig,
  PostHogStrategy,
} from "./strategies/posthog-strategy";

// Core client
export { AnalyticsClient } from "./analytics-client";

// React provider and hook
export { AnalyticsProvider, useAnalytics } from "./analytics-provider";
