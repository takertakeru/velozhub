/**
 * Console Analytics Strategy
 * Logs analytics events to browser console - perfect for development
 */

import type { AnalyticsStrategy } from "../types";

export interface ConsoleConfig {
  prefix?: string;
  logLevel?: "log" | "info" | "warn";
}

export class ConsoleStrategy implements AnalyticsStrategy {
  readonly name = "console";
  private prefix: string = "[Analytics]";
  private logLevel: "log" | "info" | "warn" = "info";

  initialize(config: ConsoleConfig = {}): void {
    this.prefix = config.prefix || "[Analytics]";
    this.logLevel = config.logLevel || "info";

    console[this.logLevel](`${this.prefix} Console strategy initialized`);
  }

  track(event: string, properties?: Record<string, any>): void {
    console[this.logLevel](`${this.prefix} Track:`, event, properties);
  }

  identify(userId: string, properties?: Record<string, any>): void {
    console[this.logLevel](`${this.prefix} Identify:`, userId, properties);
  }

  clearIdentity(): void {
    console[this.logLevel](`${this.prefix} Clear identity`);
  }

  isReady(): boolean {
    return true; // Console is always ready
  }

  cleanup(): void {
    // No-op
  }
}
