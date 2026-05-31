import { format, formatDistance, formatDistanceToNow } from "date-fns";
import z from "zod";

const DEFAULT_DATE_FORMAT_TOKEN = "MMMM d, yyyy";
const DEFAULT_TIME_FORMAT_TOKEN = "h:mm a";

/**
 * Formats a date into a human-readable format.
 *
 * @param date - The date to format.
 * @returns A formatted date string (e.g., "January 15, 2024").
 * @example
 * formatHumanDate(new Date('2024-01-15')) // "January 15, 2024"
 */
export function formatHumanDate(date: Date) {
  return format(date, DEFAULT_DATE_FORMAT_TOKEN);
}

/**
 * Formats a date with time into a human-readable format.
 *
 * @param date - The date to format.
 * @returns A formatted date and time string (e.g., "January 15, 2024, 2:30 PM").
 * @example
 * formatHumanDateTime(new Date('2024-01-15T14:30:00')) // "January 15, 2024, 2:30 PM"
 */
export function formatHumanDateTime(date: Date) {
  return format(
    date,
    `${DEFAULT_DATE_FORMAT_TOKEN}, ${DEFAULT_TIME_FORMAT_TOKEN}`,
  );
}

/**
 * Formats a date as relative time from now.
 *
 * @param date - The date to format.
 * @returns A relative time string (e.g., "2 hours ago", "in 3 days").
 * @example
 * formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000)) // "2 hours ago"
 */
export function formatRelativeTime(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Formats the duration between two dates in human-readable format.
 *
 * @param start - The start date.
 * @param end - The end date.
 * @returns A duration string (e.g., "2 hours", "3 days").
 * @example
 * formatDuration(new Date('2024-01-15'), new Date('2024-01-17')) // "2 days"
 */
export function formatDuration(start: Date, end: Date): string {
  return formatDistance(start, end);
}

/**
 * Safely formats a date with error handling and fallback.
 *
 * @param date - The date to format.
 * @param fallback - The fallback string to return if formatting fails.
 * @returns A formatted date string or the fallback value.
 * @example
 * formatSafely(new Date('2024-01-15')) // "January 15, 2024"
 * formatSafely(new Date('invalid'), "Unknown date") // "Unknown date"
 * TODO: Add localization support for the fallback parameter.
 */
export function formatSafely(date: Date, fallback = "No date"): string {
  try {
    return formatHumanDate(date);
  } catch {
    return fallback;
  }
}

/**
 * Safely parses an unknown value into a Date object with fallback.
 *
 * @param maybeDate - The value that might be a date.
 * @param defaultValue - Optional default date to use if parsing fails (defaults to current date).
 * @returns A valid Date object.
 * @example
 * safeParseDate('2024-01-15') // Date object for January 15, 2024
 * safeParseDate('invalid') // Current date
 * safeParseDate('invalid', new Date('2024-01-01')) // January 1, 2024
 */
export function safeParseDate(maybeDate: unknown, defaultValue?: Date) {
  const resolvedDefaultValue = defaultValue ?? new Date();

  return z.date().catch(resolvedDefaultValue).parse(maybeDate);
}
