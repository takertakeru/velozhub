/**
 * Analytics Client Tests
 * Test the simplified 3-method analytics client functionality
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsClient } from "../analytics-client";
import { createMockAnalytics, testData } from "./test-utils";

describe("AnalyticsClient", () => {
  let mockAnalytics: ReturnType<typeof createMockAnalytics>;

  beforeEach(() => {
    mockAnalytics = createMockAnalytics();
  });

  describe("Core Functionality", () => {
    it("should track events with flexible properties", () => {
      mockAnalytics.client.track("button clicked", {
        ...testData.eventProperties,
        customProperty: "custom-value",
      });

      mockAnalytics.expectTracked("button clicked", {
        ...testData.eventProperties,
        customProperty: "custom-value",
      });
    });

    it("should track events without properties", () => {
      mockAnalytics.client.track("page viewed");

      mockAnalytics.expectTracked("page viewed", undefined);
    });

    it("should identify users", () => {
      mockAnalytics.client.identify("user-123", testData.userProperties);

      mockAnalytics.expectIdentified("user-123", testData.userProperties);
    });

    it("should identify users without properties", () => {
      mockAnalytics.client.identify("user-123");

      mockAnalytics.expectIdentified("user-123", undefined);
    });

    it("should clear user identity", () => {
      mockAnalytics.client.clearIdentity();

      mockAnalytics.expectIdentityCleared();
    });
  });

  describe("Configuration", () => {
    it("should respect enabled flag", () => {
      // Create a simple test strategy
      const testStrategy = {
        name: "test",
        initialize: vi.fn(),
        track: vi.fn(),
        identify: vi.fn(),
        clearIdentity: vi.fn(),
        isReady: vi.fn(() => true),
      };

      // Create new client with disabled config
      const disabledClient = new AnalyticsClient(testStrategy, {
        enabled: false,
      });
      disabledClient.track("user signed up", { method: "email" });

      // Strategy should not receive the event due to enabled: false
      expect(testStrategy.track).not.toHaveBeenCalled();
    });

    it("should update configuration", () => {
      mockAnalytics.client.updateConfig({ debug: true });

      expect(mockAnalytics.client.getConfig().debug).toBe(true);
    });

    it("should return current configuration", () => {
      const config = mockAnalytics.client.getConfig();

      expect(config).toHaveProperty("enabled");
      expect(config).toHaveProperty("debug");
      expect(config.enabled).toBe(true);
      expect(config.debug).toBe(false);
    });

    it("should not mutate original config when returned", () => {
      const config = mockAnalytics.client.getConfig();
      config.debug = true;

      expect(mockAnalytics.client.getConfig().debug).toBe(false);
    });
  });

  describe("State Management", () => {
    it("should report ready state", () => {
      expect(mockAnalytics.client.isReady()).toBe(true);
    });

    it("should report not ready when disabled", () => {
      mockAnalytics.client.updateConfig({ enabled: false });

      expect(mockAnalytics.client.isReady()).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should handle strategy initialization errors gracefully", async () => {
      const failingStrategy = {
        name: "failing",
        initialize: vi.fn().mockRejectedValue(new Error("Init failed")),
        track: vi.fn(),
        identify: vi.fn(),
        clearIdentity: vi.fn(),
        isReady: vi.fn(() => false),
      };

      const client = new AnalyticsClient(failingStrategy, {
        debug: false, // Disable debug to avoid console logs in test
        enabled: true,
      });

      // Should not throw
      await expect(client.initialize()).resolves.toBeUndefined();
    });

    it("should log initialization errors when debug is enabled", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const failingStrategy = {
        name: "failing",
        initialize: vi.fn().mockRejectedValue(new Error("Init failed")),
        track: vi.fn(),
        identify: vi.fn(),
        clearIdentity: vi.fn(),
        isReady: vi.fn(() => false),
      };

      const client = new AnalyticsClient(failingStrategy, {
        debug: true,
        enabled: true,
      });

      await client.initialize();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Analytics initialization failed:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it("should not log initialization errors when debug is disabled", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const failingStrategy = {
        name: "failing",
        initialize: vi.fn().mockRejectedValue(new Error("Init failed")),
        track: vi.fn(),
        identify: vi.fn(),
        clearIdentity: vi.fn(),
        isReady: vi.fn(() => false),
      };

      const client = new AnalyticsClient(failingStrategy, {
        debug: false,
        enabled: true,
      });

      await client.initialize();

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Cleanup", () => {
    it("should clean up strategy resources on cleanup", () => {
      const cleanupSpy = vi.fn();
      mockAnalytics.strategy.cleanup = cleanupSpy;

      mockAnalytics.client.cleanup();

      expect(cleanupSpy).toHaveBeenCalled();
    });

    it("should handle missing cleanup method gracefully", () => {
      expect(() => mockAnalytics.client.cleanup()).not.toThrow();
    });
  });
});
