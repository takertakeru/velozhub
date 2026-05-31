/**
 * Currency Helper Functions Tests
 * Comprehensive test suite for all currency formatting and parsing utilities
 */

import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatCurrencySafely,
  formatCurrencyWithPrecision,
  CURRENCY_CODE,
  CURRENCY_LOCALE,
} from "./format-currency";

// Test constants
const SMALL_AMOUNT = 123.45;
const MEDIUM_AMOUNT = 12345.67;
const LARGE_AMOUNT = 1234567.89;
const ZERO_AMOUNT = 0;
const NEGATIVE_AMOUNT = -567.89;
const VERY_LARGE_AMOUNT = 1234567890.12;

describe("Currency Helper Functions", () => {
  describe("Configuration Constants", () => {
    it("should have correct default locale", () => {
      expect(CURRENCY_LOCALE).toBe("en-PH");
    });

    it("should have correct default currency code", () => {
      expect(CURRENCY_CODE).toBe("PHP");
    });
  });

  describe("formatCurrency", () => {
    it("should format basic amounts correctly", () => {
      const result = formatCurrency(SMALL_AMOUNT);
      expect(result).toMatch(/₱123\.45/);
    });

    it("should format medium amounts with thousands separator", () => {
      const result = formatCurrency(MEDIUM_AMOUNT);
      expect(result).toMatch(/₱12,345\.67/);
    });

    it("should format large amounts correctly", () => {
      const result = formatCurrency(LARGE_AMOUNT);
      expect(result).toMatch(/₱1,234,567\.89/);
    });

    it("should format zero correctly", () => {
      const result = formatCurrency(ZERO_AMOUNT);
      expect(result).toMatch(/₱0\.00/);
    });

    it("should format negative amounts correctly", () => {
      const result = formatCurrency(NEGATIVE_AMOUNT);
      expect(result).toMatch(/-₱567\.89|₱-567\.89|\(₱567\.89\)/);
    });

    it("should handle very large amounts", () => {
      const result = formatCurrency(VERY_LARGE_AMOUNT);
      expect(result).toMatch(/₱1,234,567,890\.12/);
    });

    it("should format with currency code display", () => {
      const result = formatCurrency(SMALL_AMOUNT, { display: "code" });
      expect(result).toMatch(/PHP\s*123\.45/);
    });

    it("should format with currency name display", () => {
      const result = formatCurrency(SMALL_AMOUNT, { display: "name" });
      expect(result).toMatch(/123\.45.*Philippine peso/i);
    });

    it("should respect custom locale", () => {
      const result = formatCurrency(SMALL_AMOUNT, { locale: "en-US" });
      // Should still use PHP but with US formatting conventions
      expect(result).toContain("123.45");
    });

    it("should respect custom currency", () => {
      const result = formatCurrency(SMALL_AMOUNT, {
        currency: "USD",
        locale: "en-US",
      });
      expect(result).toMatch(/\$123\.45/);
    });

    it("should handle decimal edge cases", () => {
      expect(formatCurrency(123.456)).toMatch(/₱123\.46/); // Rounds up
      expect(formatCurrency(123.454)).toMatch(/₱123\.45/); // Rounds down
      expect(formatCurrency(123.1)).toMatch(/₱123\.10/); // Adds trailing zero
      expect(formatCurrency(123)).toMatch(/₱123\.00/); // Adds decimal places
    });

    it("should throw on invalid numeric input", () => {
      expect(() => formatCurrency(NaN)).toThrow();
      expect(() => formatCurrency(Infinity)).toThrow();
      expect(() => formatCurrency(-Infinity)).toThrow();
    });
  });

  describe("formatCurrencyCompact", () => {
    it("should format small amounts without compaction", () => {
      const result = formatCurrencyCompact(SMALL_AMOUNT);
      expect(result).toMatch(/₱123/);
    });

    it("should format thousands with K notation", () => {
      const result = formatCurrencyCompact(12000);
      expect(result).toMatch(/₱12K/);
    });

    it("should format millions with M notation", () => {
      const result = formatCurrencyCompact(1200000);
      expect(result).toMatch(/₱1\.2M/);
    });

    it("should format billions with B notation", () => {
      const result = formatCurrencyCompact(1200000000);
      expect(result).toMatch(/₱1\.2B/);
    });

    it("should handle edge cases for compaction thresholds", () => {
      expect(formatCurrencyCompact(999)).toMatch(/₱999/);
      expect(formatCurrencyCompact(1000)).toMatch(/₱1K/);
      expect(formatCurrencyCompact(999999)).toMatch(/₱1000K|₱1M/);
      expect(formatCurrencyCompact(1000000)).toMatch(/₱1M/);
    });

    it("should format negative compact amounts", () => {
      const result = formatCurrencyCompact(-12000);
      expect(result).toMatch(/-₱12K|₱-12K/);
    });

    it("should respect display options for compact format", () => {
      const result = formatCurrencyCompact(12000, { display: "code" });
      expect(result).toMatch(/PHP\s*12K/);
    });

    it("should handle zero in compact format", () => {
      const result = formatCurrencyCompact(0);
      expect(result).toMatch(/₱0/);
    });

    it("should handle decimal thousands correctly", () => {
      const result = formatCurrencyCompact(1234);
      expect(result).toMatch(/₱1\.2K/);
    });

    it("should handle custom locale for compact format", () => {
      const result = formatCurrencyCompact(12000, { locale: "en-US" });
      expect(result).toContain("12K");
    });
  });

  describe("formatCurrencySafely", () => {
    it("should format valid amounts correctly", () => {
      const result = formatCurrencySafely(SMALL_AMOUNT);
      expect(result).toMatch(/₱123\.45/);
    });

    it("should return default fallback for NaN", () => {
      const result = formatCurrencySafely(NaN);
      expect(result).toBe("₱0.00");
    });

    it("should return default fallback for Infinity", () => {
      const result = formatCurrencySafely(Infinity);
      expect(result).toBe("₱0.00");
    });

    it("should return default fallback for -Infinity", () => {
      const result = formatCurrencySafely(-Infinity);
      expect(result).toBe("₱0.00");
    });

    it("should return custom fallback", () => {
      const result = formatCurrencySafely(NaN, "Invalid amount");
      expect(result).toBe("Invalid amount");
    });

    it("should handle empty string fallback", () => {
      const result = formatCurrencySafely(NaN, "");
      expect(result).toBe("");
    });

    it("should handle zero correctly", () => {
      const result = formatCurrencySafely(0);
      expect(result).toMatch(/₱0\.00/);
    });

    it("should handle negative amounts safely", () => {
      const result = formatCurrencySafely(NEGATIVE_AMOUNT);
      expect(result).toMatch(/-₱567\.89|₱-567\.89|\(₱567\.89\)/);
    });

    it("should handle very small decimals", () => {
      const result = formatCurrencySafely(0.01);
      expect(result).toMatch(/₱0\.01/);
    });

    it("should respect formatting options safely", () => {
      const result = formatCurrencySafely(SMALL_AMOUNT, "₱0.00", {
        display: "code",
      });
      expect(result).toMatch(/PHP\s*123\.45/);
    });
  });

  describe("formatCurrencyWithPrecision", () => {
    it("should format with zero precision", () => {
      const result = formatCurrencyWithPrecision(123.456, 0);
      expect(result).toMatch(/₱123/);
      expect(result).not.toContain(".");
    });

    it("should format with custom precision", () => {
      const result = formatCurrencyWithPrecision(123.1, 3);
      expect(result).toMatch(/₱123\.100/);
    });

    it("should round appropriately with precision", () => {
      const result = formatCurrencyWithPrecision(123.456, 2);
      expect(result).toMatch(/₱123\.46/);
    });

    it("should handle precision limits", () => {
      // Should clamp to maximum precision
      const result = formatCurrencyWithPrecision(123.456, 25);
      expect(result).toContain("123.456");
    });

    it("should handle negative precision", () => {
      // Should clamp to minimum precision (0)
      const result = formatCurrencyWithPrecision(123.456, -5);
      expect(result).toMatch(/₱123/);
      expect(result).not.toContain(".");
    });

    it("should handle non-integer precision", () => {
      const result = formatCurrencyWithPrecision(123.456, 2.7);
      expect(result).toMatch(/₱123\.46/);
    });

    it("should work with different display modes", () => {
      const result = formatCurrencyWithPrecision(123.456, 1, {
        display: "code",
      });
      expect(result).toMatch(/PHP\s*123\.5/);
    });
  });

  describe("Integration Tests", () => {
    it("should work together for currency operations", () => {
      const amount = 1234.56;

      // Test that all functions can handle the same amount
      expect(() => formatCurrency(amount)).not.toThrow();
      expect(() => formatCurrencyCompact(amount)).not.toThrow();
      expect(() => formatCurrencySafely(amount)).not.toThrow();
    });
  });

  describe("Error Boundaries", () => {
    it("should handle number edge cases", () => {
      const edgeCases = [
        0,
        -0,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        Number.EPSILON,
        0.000001,
        999999999999.99,
      ];

      edgeCases.forEach((edgeCase) => {
        // Safe functions should handle these gracefully
        expect(() => formatCurrencySafely(edgeCase)).not.toThrow();
      });
    });

    it("should handle locale edge cases gracefully", () => {
      // Test with potentially problematic locales
      expect(() =>
        formatCurrency(123.45, { locale: "invalid-locale" })
      ).toThrow();
      expect(() =>
        formatCurrencySafely(123.45, "0.00", { locale: "invalid-locale" })
      ).not.toThrow();
    });

    it("should handle currency code edge cases", () => {
      // Test with valid but different currency codes
      expect(() => formatCurrency(123.45, { currency: "USD" })).not.toThrow();
      expect(() => formatCurrency(123.45, { currency: "EUR" })).not.toThrow();

      // Invalid currency codes should throw in strict mode
      expect(() => formatCurrency(123.45, { currency: "INVALID" })).toThrow();
    });
  });
});
