import type React from "react";
import { LabelContext, Provider } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants/lite";
import { supportedColors, type ThemeColors } from "./constants";
import { surfaceStyles, type SurfaceVariants } from "./surface";
import { cn } from "./utils";

const bannerStyles = tv({
  // extend: surfaceStyles,
  base: [
    // Define grid at the root level if subgrid is supported
    "supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_auto]",
    // Icons
    "[&>[data-slot=icon]]:col-start-1 [&>[data-slot=icon]]:row-start-1 [&>[data-slot=icon]]:h-[1lh]",
    "[&>[data-slot=icon]]:text-[color:var(--banner-color-text)] ",
    // Emphasis
    "bg-[color:var(--banner-color-background)] text-[color:var(--banner-color-text)]",
    // Footer
    "[&>[data-slot=footer]]:col-start-2 [&>[data-slot=footer]]:row-start-2",
  ],
  slots: { default: "" },
  variants: {
    ...surfaceStyles.variants,
    // this is necessary so we can "explicitly" support colors when we try to add new ones
    color: Object.keys(supportedColors).reduce(
      (all, v) => {
        all[v as ThemeColors] = { base: "" };

        return all;
      },
      {} as Record<ThemeColors, { base: string }>,
    ),
    emphasis: {
      muted: "",
      subtle: "",
      bold: "",
    },
  },
  compoundVariants: [
    {
      emphasis: "muted",
      color: "primary",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-primary-muted)] [--banner-color-text:var(--color-brand-primary-text)]",
        ],
      },
    },
    {
      emphasis: "subtle",
      color: "primary",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-primary-subtle)] [--banner-color-text:var(--color-brand-warning-text)]",
        ],
      },
    },
    {
      emphasis: "bold",
      color: "primary",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-primary-bold)] [--banner-color-text:var(--color-brand-primary-inverse)]",
        ],
      },
    },
    {
      emphasis: "muted",
      color: "warning",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-warning-muted)] [--banner-color-text:var(--color-brand-warning-text)]",
        ],
      },
    },
    {
      emphasis: "subtle",
      color: "warning",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-warning-subtle)] [--banner-color-text:var(--color-brand-warning-text)]",
        ],
      },
    },
    {
      emphasis: "bold",
      color: "warning",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-warning-bold)] [--banner-color-text:var(--color-brand-warning-inverse)]",
        ],
      },
    },
    {
      emphasis: "muted",
      color: "danger",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-danger-muted)] [--banner-color-text:var(--color-brand-danger-text)]",
        ],
      },
    },
    {
      emphasis: "subtle",
      color: "danger",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-danger-subtle)] [--banner-color-text:var(--color-brand-danger-text)]",
        ],
      },
    },
    {
      emphasis: "bold",
      color: "danger",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-danger-bold)] [--banner-color-text:var(--color-brand-danger-inverse)]",
        ],
      },
    },
    // Success
    {
      emphasis: "muted",
      color: "success",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-success-muted)] [--banner-color-text:var(--color-brand-success-text)]",
        ],
      },
    },
    {
      emphasis: "subtle",
      color: "success",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-success-subtle)] [--banner-color-text:var(--color-brand-success-text)]",
        ],
      },
    },
    {
      emphasis: "bold",
      color: "success",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-success-bold)] [--banner-color-text:var(--color-brand-success-inverse)]",
        ],
      },
    },
    // Neutral
    {
      emphasis: "muted",
      color: "neutral",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-neutral-muted)] [--banner-color-text:var(--color-brand-neutral-text)]",
        ],
      },
    },
    {
      emphasis: "subtle",
      color: "neutral",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-neutral-subtle)] [--banner-color-text:var(--color-brand-neutral-text)]",
        ],
      },
    },
    {
      emphasis: "bold",
      color: "neutral",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-neutral-bold)] [--banner-color-text:var(--color-brand-neutral-inverse)]",
        ],
      },
    },
    //Info
    {
      emphasis: "muted",
      color: "info",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-info-muted)] [--banner-color-text:var(--color-brand-info-text)]",
        ],
      },
    },
    {
      emphasis: "subtle",
      color: "info",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-info-subtle)] [--banner-color-text:var(--color-brand-info-text)]",
        ],
      },
    },
    {
      emphasis: "bold",
      color: "info",
      className: {
        base: [
          "[--banner-color-background:var(--color-brand-info-bold)] [--banner-color-text:var(--color-brand-info-inverse)]",
        ],
      },
    },
  ],
  defaultVariants: {
    ...surfaceStyles.defaultVariants,
    density: "default",
    color: "primary",
    emphasis: "muted",
  },
});

type BannerStyles = VariantProps<typeof bannerStyles>;

export function Banner({
  orientation,
  color = "info",
  emphasis = "muted",
  ...props
}: React.ComponentPropsWithoutRef<"section"> &
  Omit<SurfaceVariants, "color"> &
  BannerStyles) {
  return (
    <Provider values={[[LabelContext, { elementType: "span" }]]}>
      <section
        {...props}
        className={cn([
          props.className,
          //
          surfaceStyles({
            orientation,
            color: "unset",
            className: "[--gutter:--spacing(3)]",
          }),
          //
          bannerStyles({ color, emphasis }).base(),
          // Override surface border color
          "[--surface-border-color:var(--banner-color-text)]",
        ])}
      />
    </Provider>
  );
}
