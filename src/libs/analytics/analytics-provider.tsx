/**
 * Analytics Provider
 * Takes a pre-instantiated analytics client from createAnalytics factory
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { AnalyticsClient } from "./analytics-client";
import type { AnalyticsStrategy } from "./types";

const AnalyticsContext = createContext<AnalyticsClient | null>(null);

export interface AnalyticsProviderProps {
  children: React.ReactNode;
  strategy: AnalyticsStrategy;
}

/**
 * Analytics Provider Component
 * Creates and initializes the analytics client internally
 */
export function AnalyticsProvider({
  children,
  strategy,
}: AnalyticsProviderProps) {
  const [client] = useState(() => new AnalyticsClient(strategy));

  useEffect(() => {
    client.initialize();
    return () => client.cleanup();
  }, [client]);

  return (
    <AnalyticsContext.Provider value={client}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Hook to use analytics context
 */
export function useAnalytics(): AnalyticsClient {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }

  return context;
}
