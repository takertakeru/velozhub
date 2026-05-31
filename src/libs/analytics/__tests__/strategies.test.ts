import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { ConsoleStrategy } from "../index";
import { testData } from "./test-utils";

describe("ConsoleStrategy", () => {
  let strategy: ConsoleStrategy;
  let consoleSpy: MockInstance;

  beforeEach(() => {
    strategy = new ConsoleStrategy();
    consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should initialize with default config", () => {
    strategy.initialize();

    expect(consoleSpy).toHaveBeenCalledWith(
      "[Analytics] Console strategy initialized"
    );
  });

  it("should initialize with custom config", () => {
    const customSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    strategy.initialize({
      prefix: "[TEST]",
      logLevel: "warn",
    });

    expect(customSpy).toHaveBeenCalledWith(
      "[TEST] Console strategy initialized"
    );

    customSpy.mockRestore();
  });

  it("should log tracking events with PostHog format", () => {
    strategy.initialize();
    strategy.track("user signed up", { method: "email", source: "homepage" });

    expect(consoleSpy).toHaveBeenCalledWith(
      "[Analytics] Track:",
      "user signed up",
      { method: "email", source: "homepage" }
    );
  });

  it("should log tracking events without properties", () => {
    strategy.initialize();
    strategy.track("page viewed");

    expect(consoleSpy).toHaveBeenCalledWith(
      "[Analytics] Track:",
      "page viewed",
      undefined
    );
  });

  it("should log user identification", () => {
    strategy.initialize();
    strategy.identify("user-123", testData.userProperties);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[Analytics] Identify:",
      "user-123",
      testData.userProperties
    );
  });

  it("should log user identification without properties", () => {
    strategy.initialize();
    strategy.identify("user-123");

    expect(consoleSpy).toHaveBeenCalledWith(
      "[Analytics] Identify:",
      "user-123",
      undefined
    );
  });

  it("should log identity clearing", () => {
    strategy.initialize();
    strategy.clearIdentity();

    expect(consoleSpy).toHaveBeenCalledWith("[Analytics] Clear identity");
  });

  it("should be ready immediately", () => {
    expect(strategy.isReady()).toBe(true);
  });

  it("should handle all PostHog recommended event patterns", () => {
    strategy.initialize();

    const events = [
      "user signed up",
      "project created",
      "button clicked",
      "page viewed",
      "file uploaded",
      "form submitted",
      "payment completed",
    ];

    events.forEach((event) => {
      strategy.track(event, { test: true });
      expect(consoleSpy).toHaveBeenCalledWith("[Analytics] Track:", event, {
        test: true,
      });
    });
  });
});
