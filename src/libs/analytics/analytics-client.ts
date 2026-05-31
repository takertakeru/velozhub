/**
 * Main Analytics Client
 * Simplified 3-method API with strategy pattern for different providers
 */

import type {
  AnalyticsClient as AnalyticsClientCore,
  AnalyticsStrategy,
  AnalyticsConfig,
  AnalyticsEventMap,
} from "./types";

export class AnalyticsClient implements AnalyticsClientCore {
  private strategy: AnalyticsStrategy;
  private config: AnalyticsConfig;

  constructor(
    strategy: AnalyticsStrategy,
    config: Partial<AnalyticsConfig> = { enabled: true, debug: false }
  ) {
    this.strategy = strategy;
    this.config = {
      ...config,
      enabled: config.enabled ?? true,
      debug: config.debug ?? false,
    };
  }

  /**
   * Initialize the analytics client with the strategy
   */
  async initialize(strategyConfig?: Record<string, any>): Promise<void> {
    try {
      await this.strategy.initialize(strategyConfig || {});
    } catch (error) {
      if (this.config.debug) {
        console.error("Analytics initialization failed:", error);
      }
    }
  }

  // Overloaded track method to support both augmented and generic usage
  track<K extends keyof AnalyticsEventMap>(
    event: K,
    properties: AnalyticsEventMap[K]
  ): void;
  track(event: string, properties?: Record<string, any>): void;
  track(event: string, properties?: Record<string, any>): void {
    if (!this.config.enabled) return;
    try {
      this.strategy.track(event, properties);
    } catch (error) {
      // Strategy errors are caught and optionally logged
      // These errors can be captured by monitoring handlers if configured
      if (this.config.debug) {
        console.error("Analytics track error:", error);
      }
    }
  }

  identify(userId: string, properties?: Record<string, any>): void {
    if (!this.config.enabled) return;
    try {
      this.strategy.identify(userId, properties);
    } catch (error) {
      // Strategy errors are caught and optionally logged
      // These errors can be captured by monitoring handlers if configured
      if (this.config.debug) {
        console.error("Analytics identify error:", error);
      }
    }
  }

  clearIdentity(): void {
    if (!this.config.enabled) return;
    try {
      this.strategy.clearIdentity();
    } catch (error) {
      // Strategy errors are caught and optionally logged
      // These errors can be captured by monitoring handlers if configured
      if (this.config.debug) {
        console.error("Analytics clearIdentity error:", error);
      }
    }
  }

  /**
   * Check if analytics is ready and enabled
   */
  isReady(): boolean {
    return this.config.enabled && this.strategy.isReady();
  }

  /**
   * Get current configuration (useful for debugging)
   */
  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.strategy.cleanup) {
      this.strategy.cleanup();
    }
  }
}
