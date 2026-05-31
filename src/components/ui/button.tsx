import React from "react";
import { mergeProps } from "react-aria";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Link,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants/lite";
import { match } from "ts-pattern";
import type { Adjoined, Inset, Variant } from "./constants";
import { ProgressCircle } from "./progress";
import { cn } from "./utils";

export const baseButtonStyles = tv({
  base: [
    // Base
    "relative isolate font-semibold",
    // Disabled
    "disabled:opacity-50",
    // Icon
    "forced-colors:(--btn-icon:ButtonText) forced-colors:hover:(--btn-icon:ButtonText) [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-(--btn-icon) [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:size-4",
    // Elevate button on focus when adjoined
    "focus:group-data-[adjoined]:z-10",
    // Focus - for now we bind this to a "data-focusable" attr so the state is within the element and can be agnostic.
    "data-focusable:focus:outline-2 data-focusable:focus:outline-offset-2 data-focusable:focus:outline-info-500",
  ],
  slots: { default: "" },
  variants: {
    layout: {
      unset: { base: "" },
      default: { base: "inline-flex items-center justify-center gap-x-2" },
    },
    /**
     * Content Model Primitives.
     */
    border: {
      unset: { base: "" },
      default: {
        base: "border",
      },
    },
    padding: {
      unset: { base: "" },
      // Default padding config
      default: {
        base: "px-[var(--btn-padding-x)] py-[var(--btn-padding-y)]",
      },
    },
    shape: {
      unset: { base: "" },
      pill: {
        base: "rounded-(--radius-btn) [--radius:9999px]",
      },
      default: { base: "rounded-(--radius-btn) [--radius:var(--radius-btn)]" },
    },
    size: {
      unset: { base: "" },
      sm: {
        base: [
          // Sizing (32px)
          "text-xs/6",
          "[--btn-padding-x:calc(theme(spacing[2.5])-1px)] [--btn-padding-y:calc(0)]",
        ],
      },
      md: {
        base: [
          // Sizing (36px)
          "text-sm/6",
          "[--btn-padding-x:calc(theme(spacing[3])-1px)] [--btn-padding-y:calc(--spacing(1.5)-1px)]",
        ],
      },
      lg: {
        base: [
          // Sizing (48px)
          "text-base",
          "[--btn-padding-x:calc(theme(spacing[5])-1px)] [--btn-padding-y:calc(theme(spacing[3])-1px)]",
        ],
      },
    },
    inset: {
      unset: { base: "" },
      top: { base: "mt-[calc(var(--btn-padding-y)*-1)]" },
      right: { base: "mr-[calc(var(--btn-padding-x)*-1)]" },
      bottom: { base: "mb-[calc(var(--btn-padding-y)*-1)]" },
      left: { base: "ml-[calc(var(--btn-padding-x)*-1)]" },
    },
    adjoined: {
      unset: { base: "" },
      top: { base: "" },
      right: { base: "" },
      bottom: { base: "" },
      left: { base: "" },
    },
  },
  defaultVariants: {
    layout: "default",
    inset: "unset",
    padding: "default",
    margin: "default",
    border: "default",
    intent: "default",
    size: "md",
    shape: "default",
  },
});

export const solidButtonStyles = tv({
  extend: baseButtonStyles,
  base: [
    // Optical border, implemented as the button background to avoid corner artifacts
    "border-transparent bg-(--btn-border)",
    // Dark mode: border is rendered on `after` so background is set to button background
    "dark:bg-(--btn-bg)",
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-btn)-1px)] before:bg-(--btn-bg)",
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    "before:shadow",
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    "dark:before:hidden",
    // Dark mode: Subtle white outline is applied using a border
    "dark:border-white/5",
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-btn)-1px)]",
    // Inner highlight shadow
    "after:shadow-[shadow:inset_0_1px_theme(colors.white/15%)]",
    // White overlay on hover
    "hover:after:bg-(--btn-hover-overlay) pressed:after:bg-(--btn-hover-overlay)",
    // Dark mode: `after` layer expands to cover entire button
    "dark:after:-inset-px dark:after:rounded-[var(--radius-btn)]",
    // Disabled
    "before:disabled:shadow-none after:disabled:shadow-none",
  ],
  slots: { default: "" },
  variants: {
    color: {
      unset: { base: "" },
      primary: {
        base: [
          "text-brand-primary-inverse [--btn-bg:var(--color-brand-primary)] [--btn-border:var(--color-brand-primary)]/90 [--btn-hover-overlay:var(--color-black)]/10",
          "[--btn-icon:white] hover:[--btn-icon:theme(colors.brand-neutral.200)] pressed:[--btn-icon:theme(colors.brand-neutral.100)]",
        ],
      },
      neutral: {
        base: [
          "text-brand-neutral-text [--btn-bg:var(--color-brand-neutral-subtle)] [--btn-border:var(--color-neutral)]/90 [--btn-hover-overlay:var(--color-white)]/10",
          "[--btn-icon:theme(colors.brand-neutral.500)] hover:[--btn-icon:theme(colors.brand-neutral.500)] pressed:[--btn-icon:theme(colors.brand-neutral.500)]",
        ],
      },
      danger: {
        base: [
          "text-brand-danger-inverse [--btn-bg:var(--color-brand-danger)] [--btn-border:var(--color-brand-danger)]/90 [--btn-hover-overlay:var(--color-white)]/10",
          "[--btn-icon:theme(colors.red.300)] hover:[--btn-icon:theme(colors.red.200)] pressed:[--btn-icon:theme(colors.red.200)]",
        ],
      },
      warning: {
        base: [
          "text-brand-warning-text [--btn-bg:var(--color-brand-warning-subtle)] [--btn-border:var(--color-brand-warning)]/90 [--btn-hover-overlay:var(--color-white)]/10",
          "[--btn-icon:theme(colors.yellow.600)] hover:[--btn-icon:theme(colors.yellow.700)] pressed:[--btn-icon:theme(colors.yellow.700)]",
        ],
      },
      success: {
        base: [
          "text-brand-success-inverse [--btn-bg:var(--color-brand-success)] [--btn-border:var(--color-brand-success)]/90 [--btn-hover-overlay:var(--color-white)]/10",
          "[--btn-icon:theme(colors.white/60%)] hover:[--btn-icon:theme(colors.white/80%)] pressed:[--btn-icon:theme(colors.white/80%)]",
        ],
      },
      info: {
        base: [
          "text-brand-info-inverse [--btn-bg:var(--color-brand-info)] [--btn-border:var(--color-brand-info-border)]/90 [--btn-hover-overlay:var(--color-white)]/10",
          "[--btn-icon:theme(colors.white/60%)] hover:[--btn-icon:theme(colors.white/80%)] pressed:[--btn-icon:theme(colors.white/80%)]",
        ],
      },
    },
    adjoined: {
      unset: { base: "" },
      left: {
        base: [
          "data-[adjoined*=left]:rounded-l-none data-[adjoined*=left]:border-l-0",
          "data-[adjoined*=left]:before:rounded-l-none",
          "data-[adjoined*=left]:after:rounded-l-none",
        ],
      },
      right: {
        base: [
          "data-[adjoined*=right]:rounded-r-none data-[adjoined*=right]:border-r-0",
          "data-[adjoined*=right]:before:rounded-r-none",
          "data-[adjoined*=right]:after:rounded-r-none",
        ],
      },
      top: {
        base: [
          "data-[adjoined*=top]:rounded-t-none data-[adjoined*=top]:border-t-0",
          "data-[adjoined*=top]:before:rounded-t-none",
          "data-[adjoined*=top]:after:rounded-t-none",
        ],
      },
      bottom: {
        base: [
          "data-[adjoined*=bottom]:rounded-b-none data-[adjoined*=bottom]:border-b-0",
          "data-[adjoined*=bottom]:before:rounded-b-none",
          "data-[adjoined*=bottom]:after:rounded-b-none",
        ],
      },
    },
  },
  defaultVariants: {
    color: "primary",
    adjoined: "unset",
  },
});

const outlineButton = tv({
  extend: baseButtonStyles,
  base: [],
  // TODO: Explain why this is important, mainly due to how tv parses extensions and merging
  slots: { default: "" },
  variants: {
    color: {
      unset: { base: "" },
      primary: {
        base: [
          // Base
          "border-brand-primary text-brand-primary-text hover:bg-brand-primary/5 pressed:bg-brand-primary-muted",
          // Icon
          "[--btn-icon:var(--color-brand-primary-text)]",
        ],
      },
      neutral: {
        base: [
          // Base
          "border-brand-neutral-border text-brand-neutral-text hover:bg-neutral-500/5 pressed:bg-brand-neutral-muted",
          // Icon
          "[--btn-icon:var(--color-brand-neutral-text)]",
        ],
      },
      danger: {
        base: [
          // Base
          "border-brand-danger text-brand-danger-text hover:bg-danger-500/5 pressed:bg-brand-danger-muted",
          // Icon
          "[--btn-icon:var(--color-brand-danger-text)]",
        ],
      },
      warning: {
        base: [
          // Base
          "border-brand-warning text-brand-warning-bold hover:bg-warning-500/5 pressed:bg-brand-warning-muted",
          // Icon
          "[--btn-icon:var(--color-brand-warning-text)]",
        ],
      },
      success: {
        base: [
          // Base
          "border-brand-success-text text-brand-success-bold hover:bg-success-500/5 pressed:bg-brand-success-muted",
          // Icon
          "[--btn-icon:var(--color-brand-success-text)]",
        ],
      },
      info: {
        base: [
          // Base
          "border-brand-info-text text-brand-info-bold hover:bg-info-500/5 pressed:bg-brand-info-muted",
          // Icon
          "[--btn-icon:var(--color-brand-info-text)]",
        ],
      },
    },
    adjoined: {
      unset: { base: "" },
      left: {
        base: [
          "rounded-l-none border-l-0",
          "before:rounded-l-none",
          "after:rounded-l-none",
        ],
      },
      right: {
        base: [
          "rounded-r-none border-r-0",
          "before:rounded-r-none",
          "after:rounded-r-none",
        ],
      },
      top: {
        base: [
          "rounded-t-none border-t-0",
          "before:rounded-t-none",
          "after:rounded-t-none",
        ],
      },
      bottom: {
        base: [
          "rounded-t-none border-t-0",
          "before:rounded-t-none",
          "after:rounded-t-none",
        ],
      },
    },
  },
  defaultVariants: {
    color: "neutral",
  },
});

const plainButton = tv({
  extend: baseButtonStyles,
  base: [
    // Optical border, implemented as the button background to avoid corner artifacts
    "border-transparent bg-[var(--btn-border)]",
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-btn)-1px)] hover:before:bg-[var(--btn-hover-overlay)] pressed:before:bg-[var(--btn-pressed)]",
  ],
  slots: { default: "" },
  variants: {
    color: {
      unset: "",
      primary: {
        base: [
          "text-brand-primary-text [--btn-hover-overlay:var(--color-brand-primary-muted)] [--btn-pressed:var(--color-primary-200)]",
          "[--btn-icon:var(--color-brand-primary-text)]",
        ],
      },
      neutral: {
        base: [
          "text-brand-neutral-text [--btn-hover-overlay:var(--color-brand-neutral-muted)] [--btn-pressed:var(--color-neutral-200)]",
          "[--btn-icon:var(--color-brand-neutral-text)]",
        ],
      },
      danger: {
        base: [
          "text-brand-danger-text [--btn-hover-overlay:var(--color-brand-danger-muted)] [--btn-pressed:var(--color-danger-200)]",
          "[--btn-icon:var(--color-brand-danger-text)]",
        ],
      },
      warning: {
        base: [
          "text-brand-warning-text [--btn-hover-overlay:var(--color-brand-warning-muted)] [--btn-pressed:var(--color-warning-200)]",
          "[--btn-icon:var(--color-brand-warning-text)]",
        ],
      },
      success: {
        base: [
          "text-brand-success-text [--btn-hover-overlay:var(--color-brand-success-muted)] [--btn-pressed:var(--color-success-200)]",
          "[--btn-icon:var(--color-brand-success-text)]",
        ],
      },
      info: {
        base: [
          "text-brand-info-text [--btn-hover-overlay:var(--color-brand-info-muted)] [--btn-pressed:var(--color-info-200)]",
          "[--btn-icon:var(--color-brand-info-text)]",
        ],
      },
    },
    adjoined: {
      unset: { base: "" },
      left: {
        base: [
          "rounded-l-none border-l-0",
          "before:rounded-l-none",
          "after:rounded-l-none",
        ],
      },
      right: {
        base: [
          "rounded-r-none border-r-0",
          "before:rounded-r-none",
          "after:rounded-r-none",
        ],
      },
      top: {
        base: [
          "rounded-t-none border-t-0",
          "before:rounded-t-none",
          "after:rounded-t-none",
        ],
      },
      bottom: {
        base: [
          "rounded-t-none border-t-0",
          "before:rounded-t-none",
          "after:rounded-t-none",
        ],
      },
    },
  },
  defaultVariants: {
    color: "neutral",
  },
});

export type ExtendedVariant = Variant;

export type ButtonStyleVariants = Omit<
  VariantProps<typeof solidButtonStyles>,
  "inset" | "adjoined"
> & {
  variant?: ExtendedVariant;
  inset?: Array<Inset> | Inset;
  adjoined?: Array<Adjoined> | Adjoined;
};

export type UnstyledButtonProps =
  | Omit<AriaButtonProps, "className">
  | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">;

// eslint-disable-next-line @typescript-eslint/naming-convention
type _OwnProps = UnstyledButtonProps & ButtonStyleVariants;

export const buttonVariantConfig: Record<ExtendedVariant, ExtendedVariant> = {
  solid: "solid",
  outline: "outline",
  plain: "plain",
  unstyled: "unstyled",
} as const;

export type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  /**
   * For backwards compatibility.
   */
  onClick?: AriaButtonProps["onPress"];
} & _OwnProps;

/**
 * Arbitrary description content.
 *
 * @internal
 */
const matchingInset = (
  insets: Exclude<ButtonStyleVariants["inset"], undefined>,
) => {
  return Array.isArray(insets)
    ? insets.map((item) => baseButtonStyles.variants.inset[item].base)
    : baseButtonStyles.variants.inset[insets].base;
};

/**
 * First.
 */
const matchingAdjoined = (
  type: ExtendedVariant,
  adjoined: Exclude<ButtonStyleVariants["adjoined"], undefined>,
) => {
  return Array.isArray(adjoined)
    ? adjoined.map((item) => {
        return match({ type })
          .with(
            { type: "solid" },
            () => solidButtonStyles.variants.adjoined[item].base,
          )
          .with(
            { type: "outline" },
            () => outlineButton.variants.adjoined[item].base,
          )
          .with(
            { type: "plain" },
            () => plainButton.variants.adjoined[item].base,
          )
          .with({ type: "unstyled" }, () => [""])
          .exhaustive();
      })
    : match({ type })
        .with(
          { type: "solid" },
          () => solidButtonStyles.variants.adjoined[adjoined].base,
        )
        .with(
          { type: "outline" },
          () => outlineButton.variants.adjoined[adjoined].base,
        )
        .with(
          { type: "plain" },
          () => plainButton.variants.adjoined[adjoined].base,
        )
        .with({ type: "unstyled" }, () => "")
        .exhaustive();
};

// for now we just manually merge the styles
type ComposedOptions = VariantProps<typeof solidButtonStyles> &
  VariantProps<typeof outlineButton> &
  VariantProps<typeof plainButton>;

/**
 * First.
 */
export const composeButtonStyles = (
  type: ExtendedVariant,
  opts?: Omit<ComposedOptions, "adjoined" | "inset"> & ButtonStyleVariants,
) => {
  const { adjoined, inset, ...args } = opts ?? {};
  const insetStyles = matchingInset(inset ?? "unset");
  const adjoinedStyles = matchingAdjoined(type, adjoined ?? "unset");
  const base = match({ type })
    .with({ type: "solid" }, () => solidButtonStyles(args).base())
    .with({ type: "outline" }, () => outlineButton(args).base())
    .with({ type: "plain" }, () => plainButton(args).base())
    .with({ type: "unstyled" }, () => undefined)
    .exhaustive();

  return cn(base, adjoinedStyles, insetStyles);
};

export const Button = React.forwardRef(function Button(
  {
    color,
    className,
    children,
    size = "md",
    variant = "solid",
    shape,
    inset = "unset",
    adjoined,
    onClick,
    layout,
    border,
    padding,
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const styles = composeButtonStyles(variant, {
    color,
    size,
    shape,
    adjoined,
    inset,
    layout,
    border,
    padding,
  });

  if ("href" in props) {
    return (
      <Link
        {...props}
        className={cn([styles, className])}
        data-component="button"
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
      >
        <TouchTarget>{children}</TouchTarget>
      </Link>
    );
  }

  const isPending = "isPending" in props ? props.isPending : false;

  return (
    <AriaButton
      {...mergeProps(props, { onPress: onClick })}
      data-component="button"
      data-adjoined={adjoined}
      data-focusable=""
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      style={props.style as AriaButtonProps["style"]}
      className={cn([styles, "cursor-default", className])}
    >
      <TouchTarget>
        {isPending ? (
          <>
            <ProgressCircle />
            Loading
          </>
        ) : (
          children
        )}
      </TouchTarget>
    </AriaButton>
  );
});

/**
 * Expand the hit area to at least 44×44px on touch devices.
 */
export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  );
}
