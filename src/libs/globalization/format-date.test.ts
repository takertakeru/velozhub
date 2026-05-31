/**
 * Date Helper Functions Tests
 * Comprehensive test suite for all date formatting and parsing utilities
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  formatDuration,
  formatHumanDate,
  formatHumanDateTime,
  formatRelativeTime,
  formatSafely,
  safeParseDate,
} from "./format-date";

// Mock dates for consistent testing
const MOCK_NOW = new Date("2024-01-15T14:30:00.000Z");
const YESTERDAY = new Date("2024-01-14T14:30:00.000Z");
const TWO_HOURS_AGO = new Date("2024-01-15T12:30:00.000Z");
const THREE_DAYS_FUTURE = new Date("2024-01-18T14:30:00.000Z");

describe("Date Helper Functions", () => {
  beforeEach(() => {
    // Mock the current date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("formatHumanDate", () => {
    it("should format date correctly", () => {
      const result = formatHumanDate(MOCK_NOW);
      expect(result).toBe("January 15, 2024");
    });

    it("should format different months correctly", () => {
      const marchDate = new Date("2024-03-01T00:00:00.000Z");
      const result = formatHumanDate(marchDate);
      expect(result).toBe("March 1, 2024");
    });

    it("should format leap year dates correctly", () => {
      const leapDate = new Date("2024-02-29T00:00:00.000Z");
      const result = formatHumanDate(leapDate);
      expect(result).toBe("February 29, 2024");
    });

    it("should handle year boundaries correctly", () => {
      const newYear = new Date("2025-01-01T00:00:00.000Z");
      const result = formatHumanDate(newYear);
      expect(result).toBe("January 1, 2025");
    });

    it("should throw on invalid date", () => {
      const invalidDate = new Date("invalid");
      expect(() => formatHumanDate(invalidDate)).toThrow();
    });
  });

  describe("formatHumanDateTime", () => {
    it("should format date and time correctly", () => {
      const result = formatHumanDateTime(MOCK_NOW);
      // The time will be in local timezone, so we need to test the format not the exact time
      expect(result).toMatch(/January 15, 2024, \d{1,2}:\d{2} [AP]M/);
    });

    it("should format AM time correctly", () => {
      const morningDate = new Date("2024-01-15T09:15:00.000Z");
      const result = formatHumanDateTime(morningDate);
      // Format should be correct, but time depends on local timezone
      expect(result).toMatch(/January 15, 2024, \d{1,2}:\d{2} [AP]M/);
    });

    it("should format midnight correctly", () => {
      const midnight = new Date("2024-01-15T00:00:00.000Z");
      const result = formatHumanDateTime(midnight);
      expect(result).toMatch(/January 1[45], 2024, \d{1,2}:\d{2} [AP]M/);
    });

    it("should format noon correctly", () => {
      const noon = new Date("2024-01-15T12:00:00.000Z");
      const result = formatHumanDateTime(noon);
      expect(result).toMatch(/January 1[45], 2024, \d{1,2}:\d{2} [AP]M/);
    });

    it("should handle different time zones correctly", () => {
      // Note: This tests the local formatting behavior
      const dateWithTime = new Date("2024-01-15T23:45:00.000Z");
      const result = formatHumanDateTime(dateWithTime);
      expect(result).toMatch(/January 1[56], 2024, \d{1,2}:\d{2} [AP]M/);
    });

    it("should throw on invalid date", () => {
      const invalidDate = new Date("invalid");
      expect(() => formatHumanDateTime(invalidDate)).toThrow();
    });
  });

  describe("formatRelativeTime", () => {
    it("should format past time correctly", () => {
      const result = formatRelativeTime(TWO_HOURS_AGO);
      expect(result).toBe("about 2 hours ago");
    });

    it("should format future time correctly", () => {
      const result = formatRelativeTime(THREE_DAYS_FUTURE);
      expect(result).toBe("in 3 days");
    });

    it("should format minutes ago correctly", () => {
      const fiveMinutesAgo = new Date("2024-01-15T14:25:00.000Z");
      const result = formatRelativeTime(fiveMinutesAgo);
      expect(result).toBe("5 minutes ago");
    });

    it("should format seconds for very recent times", () => {
      const thirtySecondsAgo = new Date("2024-01-15T14:29:30.000Z");
      const result = formatRelativeTime(thirtySecondsAgo);
      expect(result).toBe("1 minute ago");
    });

    it("should format days correctly", () => {
      const result = formatRelativeTime(YESTERDAY);
      expect(result).toBe("1 day ago");
    });

    it("should format weeks correctly", () => {
      const oneWeekAgo = new Date("2024-01-08T14:30:00.000Z");
      const result = formatRelativeTime(oneWeekAgo);
      expect(result).toBe("7 days ago");
    });

    it("should format months correctly", () => {
      const twoMonthsAgo = new Date("2023-11-15T14:30:00.000Z");
      const result = formatRelativeTime(twoMonthsAgo);
      expect(result).toBe("2 months ago");
    });

    it("should handle current time correctly", () => {
      const result = formatRelativeTime(MOCK_NOW);
      expect(result).toBe("less than a minute ago");
    });

    it("should throw on invalid date", () => {
      const invalidDate = new Date("invalid");
      expect(() => formatRelativeTime(invalidDate)).toThrow();
    });
  });

  describe("formatDuration", () => {
    it("should format duration in hours correctly", () => {
      const start = new Date("2024-01-15T12:00:00.000Z");
      const end = new Date("2024-01-15T14:00:00.000Z");
      const result = formatDuration(start, end);
      expect(result).toBe("about 2 hours");
    });

    it("should format duration in days correctly", () => {
      const start = new Date("2024-01-15T00:00:00.000Z");
      const end = new Date("2024-01-17T00:00:00.000Z");
      const result = formatDuration(start, end);
      expect(result).toBe("2 days");
    });

    it("should format duration in minutes correctly", () => {
      const start = new Date("2024-01-15T14:00:00.000Z");
      const end = new Date("2024-01-15T14:30:00.000Z");
      const result = formatDuration(start, end);
      expect(result).toBe("30 minutes");
    });

    it("should handle reversed start and end dates", () => {
      const start = new Date("2024-01-15T14:00:00.000Z");
      const end = new Date("2024-01-15T12:00:00.000Z");
      const result = formatDuration(start, end);
      expect(result).toBe("about 2 hours");
    });

    it("should handle same start and end dates", () => {
      const sameDate = new Date("2024-01-15T14:00:00.000Z");
      const result = formatDuration(sameDate, sameDate);
      expect(result).toBe("less than a minute");
    });

    it("should format very short durations", () => {
      const start = new Date("2024-01-15T14:00:00.000Z");
      const end = new Date("2024-01-15T14:00:30.000Z");
      const result = formatDuration(start, end);
      expect(result).toBe("1 minute");
    });

    it("should format weeks correctly", () => {
      const start = new Date("2024-01-01T00:00:00.000Z");
      const end = new Date("2024-01-15T00:00:00.000Z");
      const result = formatDuration(start, end);
      expect(result).toBe("14 days");
    });

    it("should format months correctly", () => {
      const start = new Date("2024-01-01T00:00:00.000Z");
      const end = new Date("2024-03-01T00:00:00.000Z");
      const result = formatDuration(start, end);
      expect(result).toBe("2 months");
    });

    it("should throw on invalid start date", () => {
      const invalidStart = new Date("invalid");
      const validEnd = new Date("2024-01-15T14:00:00.000Z");
      expect(() => formatDuration(invalidStart, validEnd)).toThrow();
    });

    it("should throw on invalid end date", () => {
      const validStart = new Date("2024-01-15T12:00:00.000Z");
      const invalidEnd = new Date("invalid");
      expect(() => formatDuration(validStart, invalidEnd)).toThrow();
    });
  });

  describe("formatSafely", () => {
    it("should format valid date correctly", () => {
      const result = formatSafely(MOCK_NOW);
      expect(result).toBe("January 15, 2024");
    });

    it("should return default fallback for invalid date", () => {
      const invalidDate = new Date("invalid");
      const result = formatSafely(invalidDate);
      expect(result).toBe("No date");
    });

    it("should return custom fallback for invalid date", () => {
      const invalidDate = new Date("invalid");
      const result = formatSafely(invalidDate, "Unknown date");
      expect(result).toBe("Unknown date");
    });

    it("should handle empty string fallback", () => {
      const invalidDate = new Date("invalid");
      const result = formatSafely(invalidDate, "");
      expect(result).toBe("");
    });

    it("should handle null-like dates", () => {
      // @ts-expect-error - Testing runtime behavior
      const result = formatSafely(null, "Null date");
      // null gets converted to the Unix epoch (January 1, 1970)
      expect(result).toMatch(/January 1, 1970|Null date/);
    });

    it("should handle undefined dates", () => {
      // @ts-expect-error - Testing runtime behavior
      const result = formatSafely(undefined, "Undefined date");
      expect(result).toBe("Undefined date");
    });

    it("should format edge case dates correctly", () => {
      const edgeDate = new Date("1970-01-01T00:00:00.000Z");
      const result = formatSafely(edgeDate);
      expect(result).toBe("January 1, 1970");
    });

    it("should handle very old dates", () => {
      const oldDate = new Date("1900-01-01T00:00:00.000Z");
      const result = formatSafely(oldDate);
      expect(result).toBe("January 1, 1900");
    });

    it("should handle far future dates", () => {
      const futureDate = new Date("2100-12-31T23:59:59.999Z");
      const result = formatSafely(futureDate);
      // Due to timezone, this might be December 31, 2100 or January 1, 2101
      expect(result).toMatch(/^(December 31, 2100|January 1, 2101)$/);
    });
  });

  describe("safeParseDate", () => {
    it("should parse valid date string correctly", () => {
      const result = safeParseDate("2024-01-15");
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January is month 0
      expect(result.getDate()).toBe(15);
    });

    it("should parse Date object correctly", () => {
      const inputDate = new Date("2024-01-15T14:30:00.000Z");
      const result = safeParseDate(inputDate);
      expect(result).toEqual(inputDate);
    });

    it("should return current date for invalid string", () => {
      const result = safeParseDate("invalid date string");
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(MOCK_NOW.getTime());
    });

    it("should return current date for null", () => {
      const result = safeParseDate(null);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(MOCK_NOW.getTime());
    });

    it("should return current date for undefined", () => {
      const result = safeParseDate(undefined);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(MOCK_NOW.getTime());
    });

    it("should return custom default for invalid input", () => {
      const customDefault = new Date("2023-01-01T00:00:00.000Z");
      const result = safeParseDate("invalid", customDefault);
      expect(result).toEqual(customDefault);
    });

    it("should handle number timestamps", () => {
      const timestamp = MOCK_NOW.getTime();
      const result = safeParseDate(timestamp);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(timestamp);
    });

    it("should handle ISO string formats", () => {
      const isoString = "2024-01-15T14:30:00.000Z";
      const result = safeParseDate(isoString);
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe(isoString);
    });

    it("should handle various date string formats", () => {
      const formats = [
        "2024-01-15",
        "01/15/2024",
        "January 15, 2024",
        "Jan 15 2024",
      ];

      formats.forEach((format) => {
        const result = safeParseDate(format);
        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(0); // January
        expect(result.getDate()).toBe(15);
      });
    });

    it("should handle boolean values gracefully", () => {
      const resultTrue = safeParseDate(true);
      const resultFalse = safeParseDate(false);

      expect(resultTrue).toBeInstanceOf(Date);
      expect(resultFalse).toBeInstanceOf(Date);
      expect(resultTrue.getTime()).toBe(MOCK_NOW.getTime());
      expect(resultFalse.getTime()).toBe(MOCK_NOW.getTime());
    });

    it("should handle objects gracefully", () => {
      const result = safeParseDate({ notADate: true });
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(MOCK_NOW.getTime());
    });

    it("should handle arrays gracefully", () => {
      const result = safeParseDate([2024, 0, 15]);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(MOCK_NOW.getTime());
    });

    it("should prefer custom default over current date", () => {
      const customDefault = new Date("2020-06-15T00:00:00.000Z");
      const result = safeParseDate("not a date", customDefault);
      expect(result).toEqual(customDefault);
      expect(result.getTime()).not.toBe(MOCK_NOW.getTime());
    });

    it("should handle edge case of empty string", () => {
      const result = safeParseDate("");
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(MOCK_NOW.getTime());
    });

    it("should handle whitespace-only string", () => {
      const result = safeParseDate("   ");
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(MOCK_NOW.getTime());
    });
  });

  describe("Integration Tests", () => {
    it("should work together for common date operations", () => {
      const testDate = new Date("2024-01-15T14:30:00.000Z");

      // Test that all functions can handle the same date
      expect(() => formatHumanDate(testDate)).not.toThrow();
      expect(() => formatHumanDateTime(testDate)).not.toThrow();
      expect(() => formatRelativeTime(testDate)).not.toThrow();
      expect(() => formatSafely(testDate)).not.toThrow();
    });

    it("should handle safe parsing followed by formatting", () => {
      const parsedDate = safeParseDate("2024-01-15T14:30:00.000Z");
      const formattedDate = formatSafely(parsedDate);

      expect(formattedDate).toBe("January 15, 2024");
    });

    it("should handle invalid input through the safe pipeline", () => {
      const parsedDate = safeParseDate("completely invalid");
      const formattedDate = formatSafely(parsedDate);

      // Should format the current date since parsing failed
      expect(formattedDate).toBe("January 15, 2024");
    });

    it("should maintain consistency across different time zones", () => {
      // This test ensures our functions handle UTC dates consistently
      const utcDate = new Date("2024-01-15T12:00:00.000Z");
      const humanDate = formatHumanDate(utcDate);
      const safeDate = formatSafely(utcDate);

      expect(humanDate).toBe(safeDate);
    });
  });

  describe("Error Boundaries", () => {
    it("should handle Date constructor edge cases", () => {
      // Test various edge cases that might create invalid dates
      const edgeCases = [
        new Date(NaN),
        new Date(""),
        new Date("not a date"),
        new Date(Infinity),
        new Date(-Infinity),
      ];

      edgeCases.forEach((edgeCase) => {
        // Safe functions should handle these gracefully
        expect(() => formatSafely(edgeCase)).not.toThrow();

        // Non-safe functions should throw or handle appropriately
        if (isNaN(edgeCase.getTime())) {
          expect(() => formatHumanDate(edgeCase)).toThrow();
        }
      });
    });

    it("should handle timezone edge cases", () => {
      // Test dates around DST boundaries and other timezone edge cases
      const dstDate = new Date("2024-03-10T07:00:00.000Z"); // DST transition in US

      expect(() => formatSafely(dstDate)).not.toThrow();
      expect(formatSafely(dstDate)).toContain("2024");
    });
  });
});
