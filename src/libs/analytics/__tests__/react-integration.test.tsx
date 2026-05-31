import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  type MockInstance,
} from "vitest";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { AnalyticsProvider, useAnalytics } from "../analytics-provider";
import type { AnalyticsStrategy } from "../types";

function TestComponent() {
  const analytics = useAnalytics();

  const handleTrackClick = () => {
    analytics.track("button clicked", {
      location: "header",
      text: "Test Button",
    });
  };

  const handleTrackSignup = () => {
    analytics.track("user signed up", {
      method: "email",
      source: "test",
    });
  };

  const handleIdentify = () => {
    analytics.identify("user-123", {
      email: "test@example.com",
      name: "Test User",
    });
  };

  const handleClearIdentity = () => {
    analytics.clearIdentity();
  };

  return (
    <div>
      <button data-testid="track-click" onClick={handleTrackClick}>
        Track Button Click
      </button>
      <button data-testid="track-signup" onClick={handleTrackSignup}>
        Track User Signup
      </button>
      <button data-testid="identify" onClick={handleIdentify}>
        Identify User
      </button>
      <button data-testid="clear-identity" onClick={handleClearIdentity}>
        Clear Identity
      </button>
      <span data-testid="ready">
        {analytics.isReady() ? "Ready" : "Not Ready"}
      </span>
    </div>
  );
}

// Simple test strategy for React integration tests
class ReactTestStrategy implements AnalyticsStrategy {
  readonly name = "react-test";

  initialize(): void {}
  track(): void {}
  identify(): void {}
  clearIdentity(): void {}
  isReady(): boolean {
    return true;
  }
  cleanup(): void {
    //
  }
}

describe("React Integration", () => {
  let mockStrategy: ReactTestStrategy;
  let trackSpy: MockInstance;
  let identifySpy: MockInstance;
  let clearIdentitySpy: MockInstance;

  beforeEach(() => {
    mockStrategy = new ReactTestStrategy();
    trackSpy = vi.spyOn(mockStrategy, "track");
    identifySpy = vi.spyOn(mockStrategy, "identify");
    clearIdentitySpy = vi.spyOn(mockStrategy, "clearIdentity");
  });

  describe("AnalyticsProvider", () => {
    it("should provide analytics context to children", () => {
      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <TestComponent />
        </AnalyticsProvider>
      );

      expect(screen.getByText("Ready")).toBeInTheDocument();
    });

    it("should throw error when useAnalytics used outside provider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow("useAnalytics must be used within an AnalyticsProvider");

      consoleSpy.mockRestore();
    });

    it("should initialize strategy on mount", () => {
      const initSpy = vi.spyOn(mockStrategy, "initialize");

      render(
        <AnalyticsProvider strategy={mockStrategy}>
          <TestComponent />
        </AnalyticsProvider>
      );

      expect(initSpy).toHaveBeenCalled();
    });
  });

  describe("useAnalytics Hook", () => {
    it("should track events with PostHog [object] [verb] format", async () => {
      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <TestComponent />
        </AnalyticsProvider>
      );

      await userEvent.click(screen.getByTestId("track-click"));

      expect(trackSpy).toHaveBeenCalledWith("button clicked", {
        location: "header",
        text: "Test Button",
      });
    });

    it("should track different event types", async () => {
      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <TestComponent />
        </AnalyticsProvider>
      );

      await userEvent.click(screen.getByTestId("track-signup"));

      expect(trackSpy).toHaveBeenCalledWith("user signed up", {
        method: "email",
        source: "test",
      });
    });

    it("should identify users when called from components", async () => {
      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <TestComponent />
        </AnalyticsProvider>
      );

      await userEvent.click(screen.getByTestId("identify"));

      expect(identifySpy).toHaveBeenCalledWith("user-123", {
        email: "test@example.com",
        name: "Test User",
      });
    });

    it("should clear identity when called", async () => {
      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <TestComponent />
        </AnalyticsProvider>
      );

      await userEvent.click(screen.getByTestId("clear-identity"));

      expect(clearIdentitySpy).toHaveBeenCalled();
    });

    it("should provide access to configuration methods", () => {
      function ConfigTestComponent() {
        const analytics = useAnalytics();
        const config = analytics.getConfig();

        const handleUpdateConfig = () => {
          analytics.updateConfig({ debug: true });
        };

        return (
          <div>
            <div data-testid="config">{JSON.stringify(config)}</div>
            <button data-testid="update-config" onClick={handleUpdateConfig}>
              Update Config
            </button>
          </div>
        );
      }

      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <ConfigTestComponent />
        </AnalyticsProvider>
      );

      const configElement = screen.getByTestId("config");
      const config = JSON.parse(configElement.textContent || "{}");

      expect(config).toHaveProperty("enabled");
      expect(config).toHaveProperty("debug");
      expect(config.enabled).toBe(true);
      expect(config.debug).toBe(false);
    });

    it("should work with PostHog recommended event patterns", async () => {
      function PostHogPatternsComponent() {
        const analytics = useAnalytics();

        const events = [
          { name: "user signed up", props: { method: "email" } },
          { name: "project created", props: { template: "react" } },
          { name: "button clicked", props: { location: "sidebar" } },
          { name: "page viewed", props: { page: "dashboard" } },
          { name: "file uploaded", props: { type: "image" } },
          { name: "form submitted", props: { form_type: "contact" } },
        ];

        return (
          <div>
            {events.map((event, index) => (
              <button
                key={index}
                data-testid={`event-${index}`}
                onClick={() => analytics.track(event.name, event.props)}
              >
                {event.name}
              </button>
            ))}
          </div>
        );
      }

      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <PostHogPatternsComponent />
        </AnalyticsProvider>
      );

      // Test each event pattern
      await userEvent.click(screen.getByTestId("event-0"));
      expect(trackSpy).toHaveBeenCalledWith("user signed up", {
        method: "email",
      });

      await userEvent.click(screen.getByTestId("event-1"));
      expect(trackSpy).toHaveBeenCalledWith("project created", {
        template: "react",
      });

      await userEvent.click(screen.getByTestId("event-2"));
      expect(trackSpy).toHaveBeenCalledWith("button clicked", {
        location: "sidebar",
      });

      expect(trackSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe("Error Handling", () => {
    it("should handle analytics errors without breaking the app", async () => {
      // Create a strategy that throws errors
      const errorStrategy = new ReactTestStrategy();
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      errorStrategy.track = vi.fn().mockImplementation(() => {
        throw new Error("Analytics error");
      });

      function ErrorTestComponent() {
        const analytics = useAnalytics();

        const handleClick = () => {
          // With our error handling in the client, this should not throw
          analytics.track("button clicked", { location: "test" });
        };

        return <button onClick={handleClick}>Test Error</button>;
      }

      const screen = render(
        <AnalyticsProvider strategy={errorStrategy}>
          <ErrorTestComponent />
        </AnalyticsProvider>
      );

      // Should not throw and break the app
      await userEvent.click(screen.getByText("Test Error"));

      // The strategy should have been called even though it threw an error
      expect(errorStrategy.track).toHaveBeenCalledWith("button clicked", {
        location: "test",
      });

      consoleSpy.mockRestore();
    });

    it("should handle disabled analytics gracefully", async () => {
      function DisabledTestComponent() {
        const analytics = useAnalytics();

        // Disable analytics
        analytics.updateConfig({ enabled: false });

        const handleClick = () => {
          analytics.track("button clicked", { location: "test" });
        };

        return (
          <div>
            <button onClick={handleClick}>Track Event</button>
            <span data-testid="ready">
              {analytics.isReady() ? "Ready" : "Not Ready"}
            </span>
          </div>
        );
      }

      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <DisabledTestComponent />
        </AnalyticsProvider>
      );

      expect(screen.getByText("Not Ready")).toBeInTheDocument();

      await userEvent.click(screen.getByText("Track Event"));

      // Should not have called the strategy because analytics is disabled
      expect(trackSpy).not.toHaveBeenCalled();
    });
  });

  describe("Cleanup", () => {
    it("should cleanup on unmount", () => {
      const cleanupSpy = vi.fn();
      mockStrategy.cleanup = cleanupSpy;

      const { unmount } = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <TestComponent />
        </AnalyticsProvider>
      );

      unmount();

      expect(cleanupSpy).toHaveBeenCalled();
    });
  });
});
