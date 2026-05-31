import {
  composeRenderProps,
  LabelContext,
  ListBoxItem,
  type ListBoxItemProps,
  Provider,
} from "react-aria-components";
import { tv } from "tailwind-variants/lite";
import { textStyles } from "./text";

/**
 * Picker utility for building collection components.
 *
 * This file provides styling utilities and components for building dropdown menus,
 * select boxes, comboboxes, and other collection-based UI components. It should not
 * be used directly as a standalone component, but rather as a foundation for creating
 * more specific collection components.
 *
 * Key features:
 * - Consistent styling across all collection components
 * - Support for various color variants (primary, neutral, danger, etc.)
 * - Accessible grid layout with subgrid support
 * - Built-in support for icons, avatars, labels, and descriptions
 * - Responsive design with mobile-first approach.
 *
 * Usage:
 * Import `pickerStyles` and `Option` to build custom collection components like
 * Select, Combobox, Menu, etc. The styles are designed to work with React Aria's
 * collection components (ListBox, Menu, ComboBox, etc.).
 */

export const pickerStyles = tv({
  base: "",
  slots: {
    list: [
      // Base styles
      "isolate w-max min-w-[var(--trigger-width)] scroll-py-1 rounded-surface py-1 select-none",
      // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
      "outline outline-transparent focus:outline-none",
      // Handle scrolling when menu won't fit in viewport
      "overflow-y-auto overscroll-contain",
      // Define grid at the menu level if subgrid is supported
      "supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]",
      // Popover background
      "bg-white/95 backdrop-blur-xl",
      // Shadows
      "shadow-lg ring-1 ring-neutral-950/10",
      // Divider
      "*:data-[slot=divider]:col-span-full",
    ],
    section: [
      // Define grid at the section level instead of the item level if subgrid is supported
      "col-span-full supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]",
    ],
    option: [
      // Base styles
      "group/option cursor-default px-3.5 py-2.5 focus:outline-hidden",
      // Typography styles
      textStyles({
        label: "sm",
        color: "unset",
        className: "forced-colors:text-[CanvasText]",
      }),
      // Text Color
      "bg-[color:var(--picker-item-bg)] text-[color:var(--picker-item-text)]",
      // Disabled state
      "disabled:opacity-50",
      // Forced colors mode
      "forced-color-adjust-none forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText] forced-colors:focus:*:data-[slot=icon]:text-[HighlightText]",
      // Use subgrid when available but fallback to an explicit grid layout if not
      "col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
      // Icons
      "*:data-[slot=icon]:col-start-1 *:data-[slot=icon]:row-start-1 *:data-[slot=icon]:mr-2.5 *:data-[slot=icon]:-ml-0.5 *:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:mr-2 sm:*:data-[slot=icon]:size-4",
      "*:data-[slot=icon]:text-[color:var(--picker-color-text)] data-focus:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-neutral-400 dark:data-focus:*:data-[slot=icon]:text-white",
      // Avatar
      "*:data-[slot=avatar]:mr-2.5 *:data-[slot=avatar]:-ml-1 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:mr-2 sm:*:data-[slot=avatar]:size-5",
      // Label
      "*:data-[slot=label]:col-start-2 *:data-[slot=label]:row-start-1 *:data-[slot=label]:font-medium *:data-[slot=label]:text-[color:var(--picker-item-text)]",
      // Description
      "*:data-[slot=description]:col-start-2 *:data-[slot=description]:row-start-2 *:data-[slot=description]:col-span-2 *:data-[slot=description]:text-[color:var(--picker-item-text)]",
    ],
  },
  variants: {
    color: {
      unset: { option: "" },
      primary: {
        option: [
          "[--picker-item-text:var(--color-brand-primary-text)]",
          // Active
          "focus:[--picker-item-bg:var(--color-brand-primary-muted)] focus:[--picker-item-text:var(--color-brand-primary-text)]",
        ],
      },
      neutral: {
        option: [
          "[--picker-item-text:var(--color-brand-neutral-text)]",
          // Active
          "focus:[--picker-item-bg:var(--color-brand-neutral-muted)] focus:[--picker-item-text:var(--color-brand-neutral-text)]",
        ],
      },
      danger: {
        option: [
          "[--picker-item-text:var(--color-brand-danger-text)]",
          // Active
          "focus:[--picker-item-bg:var(--color-brand-danger-muted)] focus:[--picker-item-text:var(--color-brand-danger-text)]",
        ],
      },
      warning: {
        option: [
          "[--picker-item-text:var(--color-brand-warning-text)]",
          // Active
          "focus:[--picker-item-bg:var(--color-brand-warning-muted)] focus:[--picker-item-text:var(--color-brand-warning-text)]",
        ],
      },
      success: {
        option: [
          "[--picker-item-text:var(--color-brand-success-text)]",
          // Active
          "focus:[--picker-item-bg:var(--color-brand-success-muted)] focus:[--picker-item-text:var(--color-brand-success-text)]",
        ],
      },
      info: {
        option: [
          "[--picker-item-text:var(--color-brand-info-text)]",
          // Active
          "focus:[--picker-item-bg:var(--color-brand-info-muted)] focus:[--picker-item-text:var(--color-brand-info-text)]",
        ],
      },
    },
  },
  defaultVariants: {
    color: "neutral",
  },
});

export function Option({ className, ...props }: ListBoxItemProps) {
  const { option: optionStyles } = pickerStyles({ color: "neutral" });

  return (
    <Provider values={[[LabelContext, { elementType: "span" }]]}>
      <ListBoxItem
        {...props}
        className={composeRenderProps(className, (resolvedClassName) =>
          optionStyles({ className: resolvedClassName }),
        )}
      />
    </Provider>
  );
}
