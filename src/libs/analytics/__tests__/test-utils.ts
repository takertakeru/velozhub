/**
 * Test utilities for analytics module
 * Provides mocks, spies, and helpers for testing analytics functionality
 */

import { expect, vi } from "vitest";
import { AnalyticsClient } from "../analytics-client";
import { ConsoleStrategy } from "../index";

/**
 * Test data for consistent testing across all test suites
 */
export const testData = {
  userProperties: {
    name: "John Doe",
    email: "john@example.com",
    plan: "premium",
    team_size: 5,
  },
  eventProperties: {
    location: "header",
    text: "Get Started",
    source: "homepage",
  },
};

/**
 * Create a mock analytics client with spied methods
 */
export function createMockAnalytics() {
  const mockStrategy = new ConsoleStrategy();
  const client = new AnalyticsClient(mockStrategy);
  client.initialize();

  // Spy on strategy methods
  const track = vi.spyOn(mockStrategy, "track");
  const identify = vi.spyOn(mockStrategy, "identify");
  const clearIdentity = vi.spyOn(mockStrategy, "clearIdentity");

  return {
    client,
    strategy: mockStrategy,
    // Spies
    track,
    identify,
    clearIdentity,
    // Helper methods for assertions
    expectTracked(event: string, properties?: Record<string, any>) {
      expect(track).toHaveBeenCalledWith(event, properties);
    },
    expectIdentified(userId: string, properties?: Record<string, any>) {
      expect(identify).toHaveBeenCalledWith(userId, properties);
    },
    expectIdentityCleared() {
      expect(clearIdentity).toHaveBeenCalled();
    },
    // Clear all spies
    clearMocks() {
      track.mockClear();
      identify.mockClear();
      clearIdentity.mockClear();
    },
  };
}

/**
 * Create a console analytics client for testing console output
 */
export function createConsoleAnalytics() {
  const consoleStrategy = new ConsoleStrategy();
  const client = new AnalyticsClient(consoleStrategy);
  client.initialize();

  // Spy on console methods
  const consoleInfo = vi.spyOn(console, "info");
  const consoleLog = vi.spyOn(console, "log");

  return {
    client,
    strategy: consoleStrategy,
    consoleInfo,
    consoleLog,
    expectConsoleMessage(message: string) {
      expect(consoleInfo).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    },
    clearConsoleMocks() {
      consoleInfo.mockClear();
      consoleLog.mockClear();
    },
    restoreConsole() {
      consoleInfo.mockRestore();
      consoleLog.mockRestore();
    },
  };
}
