import { forwardRef } from "react";
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components";
import { tv } from "tailwind-variants/lite";
import {
  type ButtonStyleVariants,
  buttonVariantConfig,
  composeButtonStyles,
  type ExtendedVariant,
} from "./button";
import { supportedColors, type ThemeColors } from "./constants";
import { cn } from "./utils";

const toggleButtonStyles = tv({
  base: "",
  slots: { default: "" },
  variants: {
    /**
     * We are just initializing the variants and colors
     * so we can configure them via `compoundVariants`.
     * And have typesafety.
     */
    variant: Object.keys(buttonVariantConfig).reduce(
      (all, v) => {
        all[v as ExtendedVariant] = v as ExtendedVariant;

        return all;
      },
      {} as Record<ExtendedVariant, string>,
    ),
    color: Object.keys(supportedColors).reduce(
      (all, v) => {
        all[v as ThemeColors] = { base: "" };

        return all;
      },
      {} as Record<ThemeColors, { base: string }>,
    ),
  },
  compoundVariants: [
    // Solid variant selected styles
    {
      color: "primary",
      variant: "solid",
      className: {
        base: [
          "selected:[--btn-bg:var(--color-brand-primary-bold)] selected:[--btn-border:var(--color-brand-primary-bold)]",
        ],
      },
    },
    {
      color: "neutral",
      variant: "solid",
      className: {
        base: [
          "selected:[--btn-bg:var(--color-brand-neutral-bold)] selected:[--btn-border:var(--color-brand-neutral-bold)]",
        ],
      },
    },
    {
      color: "danger",
      variant: "solid",
      className: {
        base: [
          "selected:[--btn-bg:var(--color-brand-danger-bold)] selected:[--btn-border:var(--color-brand-danger-bold)]",
        ],
      },
    },
    {
      color: "warning",
      variant: "solid",
      className: {
        base: [
          "selected:[--btn-bg:var(--color-brand-warning-bold)] selected:[--btn-border:var(--color-brand-warning-bold)]",
        ],
      },
    },
    {
      color: "success",
      variant: "solid",
      className: {
        base: [
          "selected:[--btn-bg:var(--color-brand-success-bold)] selected:[--btn-border:var(--color-brand-success-bold)]",
        ],
      },
    },
    {
      color: "info",
      variant: "solid",
      className: {
        base: [
          "selected:[--btn-bg:var(--color-brand-info-bold)] selected:[--btn-border:var(--color-brand-info-bold)]",
        ],
      },
    },
    // Outline variant selected styles
    {
      color: "primary",
      variant: "outline",
      className: {
        base: "selected:bg-brand-primary-subtle selected:text-brand-primary-inverse selected:border-brand-primary",
      },
    },
    {
      color: "neutral",
      variant: "outline",
      className: {
        base: "selected:bg-brand-neutral selected:text-brand-neutral-inverse selected:border-brand-neutral",
      },
    },
    {
      color: "danger",
      variant: "outline",
      className: {
        base: "selected:bg-brand-danger selected:text-brand-danger-inverse selected:border-brand-danger",
      },
    },
    {
      color: "warning",
      variant: "outline",
      className: {
        base: "selected:bg-brand-warning selected:text-brand-warning-inverse selected:border-brand-warning",
      },
    },
    {
      color: "success",
      variant: "outline",
      className: {
        base: "selected:bg-brand-success selected:text-brand-success-inverse selected:border-brand-success",
      },
    },
    {
      color: "info",
      variant: "outline",
      className: {
        base: "selected:bg-brand-info selected:text-brand-info-inverse selected:border-brand-info",
      },
    },
    // Plain variant selected styles
    {
      color: "primary",
      variant: "plain",
      className: {
        base: "selected:text-brand-primary-text selected:hover:[--btn-hover-overlay:var(--color-brand-primary-muted)] selected:[--btn-pressed:var(--color-brand-primary-subtle)]",
      },
    },
    {
      color: "neutral",
      variant: "plain",
      className: {
        base: "selected:before:bg-brand-neutral-muted selected:text-brand-neutral-text",
      },
    },
    {
      color: "danger",
      variant: "plain",
      className: {
        base: "selected:before:bg-brand-danger-muted selected:text-brand-danger-text",
      },
    },
    {
      color: "warning",
      variant: "plain",
      className: {
        base: "selected:before:bg-brand-warning-muted selected:text-brand-warning-text",
      },
    },
    {
      color: "success",
      variant: "plain",
      className: {
        base: "selected:before:bg-brand-success-muted selected:text-brand-success-text",
      },
    },
    {
      color: "info",
      variant: "plain",
      className: {
        base: "selected:before:bg-brand-info-muted selected:text-brand-info-text",
      },
    },
  ],

  defaultVariants: {
    color: "primary",
    variant: "solid",
  },
});

type ToggleButtonProps = AriaToggleButtonProps & ButtonStyleVariants;
export const ToggleButton = forwardRef(function ToggleButton(
  {
    shape = "default",
    inset = "unset",
    size = "md",
    variant = "solid",
    adjoined = "unset",
    color,
    className,
    ...props
  }: ToggleButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const styles = composeButtonStyles(variant, {
    color,
    shape,
    inset,
    size,
    adjoined,
  });
  const selectedStyles = toggleButtonStyles({ color, variant }).base();

  return (
    <AriaToggleButton
      ref={ref}
      {...props}
      data-adjoined={adjoined}
      className={cn(styles, selectedStyles, className)}
    />
  );
});

export const ToggleButtonGroup = forwardRef(function ToggleButtonGroup(
  props: AriaToggleButtonGroupProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaToggleButtonGroup ref={ref} data-slot="button-group" {...props} />
  );
});
