/**
 * Creates a frozen string literal object where keys match their values.
 * Useful for creating consistent option constants with type safety.
 *
 * @param values - String values to create options from.
 * @returns Frozen object with keys matching values.
 * @example
 * // Basic usage
 * const colors = createConfigOptions("red", "blue", "green");
 * // Result: \{ red: "red", blue: "blue", green: "green" \}
 * @example
 * // Advanced usage with type extraction
 * const statusOptions = createConfigOptions("pending", "approved", "rejected");
 * type Status = OptionsType\<typeof statusOptions\>; // "pending" | "approved" | "rejected"
 */
export function createConfigOptions<T extends Readonly<Array<string>>>(
  ...values: T
): Record<T[number], T[number]> {
  return Object.freeze(
    Object.fromEntries(values.map((v) => [v, v])) as Record<
      T[number],
      T[number]
    >,
  );
}

/**
 * Extends core options with additional values while preserving type safety.
 * Useful for non-core components that need to add custom options to base sets.
 *
 * @param baseOptions - Base options object to extend.
 * @param extensions - Additional key-value pairs to add.
 * @returns Frozen object combining base options with extensions.
 * @example
 * // Basic extension - adding "unset" to colors
 * const extendedColors = extendOptions(supportedColors, \{ unset: "unset" \});
 * @example
 * // Advanced extension - custom component variants
 * const customVariants = extendOptions(variantOptions, \{
 *   ghost: "ghost",
 *   gradient: "gradient"
 * \});
 */
export function extendOptions<
  T extends Record<string, string>,
  U extends Record<string, string>,
>(baseOptions: T, extensions: U) {
  return Object.freeze({
    ...baseOptions,
    ...extensions,
  } as const);
}

/**
 * Extracts union type from option object values.
 * Provides consistent type derivation across all constants.
 *
 * @example
 * // Basic usage
 * const sizes = \{ sm: "sm", lg: "lg" \};
 * type Size = OptionsType\<typeof sizes\>; // "sm" | "lg"
 * @example
 * // Advanced usage with complex objects
 * type ColorVariant = OptionsType\<typeof supportedColors\>; // "primary" | "neutral" | ...
 */
export type OptionsType<T> = T[keyof T];

/**
 * Core theme colors used throughout the design system.
 * These are the base colors for semantic UI elements.
 */
export const supportedColors = createConfigOptions(
  "primary",
  "neutral",
  "danger",
  "warning",
  "success",
  "info",
);

/**
 * Theme color options including "unset" value.
 * Use for dropdowns, selectors, or when extending base colors.
 */
export const themeColorsOptions = extendOptions(supportedColors, {
  unset: "unset",
});

/**
 * Extended theme color type that includes "unset" for optional color props.
 * Use this when a component can have no color applied.
 */
export type ThemeColors = keyof typeof themeColorsOptions;

/**
 * Component visual style variants.
 * Determines how a component should look and behave visually.
 */
export const variantOptions = createConfigOptions(
  "solid",
  "outline",
  "plain",
  "unstyled",
);

/**
 * Visual style variants for components.
 */
export type Variant = OptionsType<typeof variantOptions>;

/**
 * Component shape and border radius options.
 * Controls the visual geometry of UI elements.
 */
export const shapeOptions = createConfigOptions(
  "unset",
  "square",
  "circle",
  "rounded",
);

/**
 * Shape styles for components.
 */
export type Shape = OptionsType<typeof shapeOptions>;

/**
 * Text and content emphasis levels.
 * Controls the visual weight and prominence of elements.
 */
export const emphasisOptions = createConfigOptions("muted", "subtle", "bold");

/**
 * Content emphasis levels.
 */
export type Emphasis = OptionsType<typeof emphasisOptions>;

/**
 * Directional inset options for spacing and positioning.
 * Used for margins, padding, or directional styling.
 */
export const insetOptions = createConfigOptions(
  "top",
  "right",
  "bottom",
  "left",
  "unset",
);

/**
 * Directional inset positions.
 * Defines which side(s) an effect should be applied to.
 */
export type Inset = OptionsType<typeof insetOptions>;

/**
 * Layout density options for spacing control.
 * Adjusts the amount of whitespace in components.
 */
export const densityOptions = createConfigOptions(
  "compact",
  "default",
  "spacious",
);

/**
 * Spacing density levels.
 * - compact: Tight spacing for dense layouts
 * - default: Standard spacing for general use
 * - spacious: Loose spacing for comfortable reading.
 */
export type Density = OptionsType<typeof densityOptions>;

/**
 * Component adjacency options for connected layouts.
 * Defines which sides connect to adjacent elements.
 */
export const adjoinedOptions = createConfigOptions(
  "unset",
  "top",
  "right",
  "bottom",
  "left",
);

/**
 * Adjacency positions for connected components.
 * Used when components should visually connect or align.
 */
export type Adjoined = OptionsType<typeof adjoinedOptions>;

/**
 * Layout orientation options.
 * Controls the primary axis direction for flex layouts and components.
 */
export const orientationOptions = createConfigOptions("horizontal", "vertical");

/**
 * Component orientation directions.
 * - horizontal: Left-to-right layout (row direction)
 * - vertical: Top-to-bottom layout (column direction).
 */
export type Orientation = OptionsType<typeof orientationOptions>;

/**
 * Standard component size options.
 * Provides consistent sizing across the design system.
 */
export const sizeOptions = createConfigOptions("sm", "md", "lg");

/**
 * Component size variants.
 */
export type Sizes = OptionsType<typeof sizeOptions>;
