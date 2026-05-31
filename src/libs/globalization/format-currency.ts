// You can override these constants to use a different locale/currency
// Configurable locale  constants
// For complete list of supported locales, see: https://simplelocalize.io/data/locales/
// Common examples: "en-US", "en-PH", "fil-PH", "ja-JP", "de-DE", "fr-FR", "zh-CN", "es-ES"
export const CURRENCY_LOCALE = "en-PH";
// For possible currency codes, see: https://en.wikipedia.org/wiki/ISO_4217
// Common examples: "USD", "EUR", "JPY", "PHP", "GBP", "CAD", "AUD"
export const CURRENCY_CODE = "PHP";

// Currency formatting options type
type CurrencyDisplayOptions = "symbol" | "code" | "name";

/**
 * Formats a number as currency using the configured locale and currency.
 *
 * @param amount - The numeric amount to format.
 * @param options - Optional formatting options.
 * @returns A formatted currency string (e.g., "1,234.56").
 * @example
 * formatCurrency(1234.56) // "1,234.56"
 * formatCurrency(1234.56, { display: "code" }) // "PHP 1,234.56"
 */
export function formatCurrency(
  amount: number,
  options: {
    locale?: string;
    currency?: string;
    display?: CurrencyDisplayOptions;
  } = {},
): string {
  // Validate numeric input
  if (!isFinite(amount) || isNaN(amount)) {
    throw new TypeError(
      "Invalid numeric input: amount must be a finite number",
    );
  }

  const {
    locale = CURRENCY_LOCALE,
    currency = CURRENCY_CODE,
    display = "symbol",
  } = options;

  try {
    // Validate locale
    if (locale && Intl.NumberFormat.supportedLocalesOf(locale).length === 0) {
      throw new Error(`Invalid locale: ${locale}`);
    }

    // Intl.NumberFormat documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    // For supported options, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: display,
    }).format(amount);
  } catch (error) {
    // Re-throw with more specific error message for locale/currency issues
    throw new Error(
      `Currency formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Formats a number as compact currency notation for large amounts.
 *
 * @param amount - The numeric amount to format.
 * @param options - Optional formatting options.
 * @returns A compact currency string (e.g., "1.2K", "1.2M").
 * @example
 * formatCurrencyCompact(1200) // "1.2K"
 * formatCurrencyCompact(1200000) // "1.2M"
 */
export function formatCurrencyCompact(
  amount: number,
  options: {
    locale?: string;
    currency?: string;
    display?: CurrencyDisplayOptions;
  } = {},
): string {
  const {
    locale = CURRENCY_LOCALE,
    currency = CURRENCY_CODE,
    display = "symbol",
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: display,
    notation: "compact",
    compactDisplay: "short",
  }).format(amount);
}

/**
 * Safely formats a number as currency with error handling and fallback.
 *
 * @param amount - The numeric amount to format.
 * @param fallback - The fallback string to return if formatting fails.
 * @param options - Optional formatting options.
 * @returns A formatted currency string or the fallback value.
 * @example
 * formatCurrencySafely(1234.56) // "1,234.56"
 * formatCurrencySafely(NaN, "Invalid amount") // "Invalid amount"
 */
export function formatCurrencySafely(
  amount: number,
  fallback = "₱0.00",
  options: {
    locale?: string;
    currency?: string;
    display?: CurrencyDisplayOptions;
  } = {},
): string {
  try {
    if (!isFinite(amount) || isNaN(amount)) {
      return fallback;
    }

    return formatCurrency(amount, options);
  } catch {
    return fallback;
  }
}

/**
 * Formats currency with specific precision (decimal places).
 *
 * @param amount - The numeric amount to format.
 * @param precision - Number of decimal places (0-20).
 * @param options - Optional formatting options.
 * @returns A formatted currency string with specified precision.
 * @example
 * formatCurrencyWithPrecision(1234.5, 0) // "1,235"
 * formatCurrencyWithPrecision(1234.5, 3) // "1,234.500"
 */
export function formatCurrencyWithPrecision(
  amount: number,
  precision: number,
  options: {
    locale?: string;
    currency?: string;
    display?: CurrencyDisplayOptions;
  } = {},
): string {
  const {
    locale = CURRENCY_LOCALE,
    currency = CURRENCY_CODE,
    display = "symbol",
  } = options;

  const clampedPrecision = Math.max(0, Math.min(20, Math.floor(precision)));

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: display,
    minimumFractionDigits: clampedPrecision,
    maximumFractionDigits: clampedPrecision,
  }).format(amount);
}
