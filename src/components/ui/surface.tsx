import type { ComponentPropsWithoutRef } from "react";
import { cn, createSplitProps, createStyles, type VariantProps } from "./utils";

/**
 * @internal
 *
 * use `composeSurfaceStyles`
 */
const surfaceStyles = createStyles({
  base: [
    // Base
    "forced-colors:outline",
    // Layout
    "flex gap-[var(--gap)]",
    //
    "[&>[data-slot=header]+[data-slot=content]]:mt-4",
    "[&>[data-slot=content]+[data-slot=footer]]:mt-8",
    // Variables that insets inherit to work properly
    "[--inset-padding-top:calc(var(--spacing-surface-gutter)-var(--spacing-surface-border))]",
    "[--inset-padding-right:calc(var(--spacing-surface-gutter)-var(--spacing-surface-border))]",
    "[--inset-padding-bottom:calc(var(--spacing-surface-gutter)-var(--spacing-surface-border))]",
    "[--inset-padding-left:calc(var(--spacing-surface-gutter)-var(--spacing-surface-border))]",
  ],
  variants: {
    border: {
      unset: "",
      default: [
        "[--inset-border-width:var(--spacing-surface-border)]",
        // Border
        "ring-1 ring-[var(--surface-border-color,var(--color-surface-border))]",
      ],
    },
    radius: {
      unset: "",
      default: [
        "[--inset-border-radius:var(--radius-surface)]",
        //
        "rounded-[var(--surface-radius,var(--radius-surface))]",
      ],
    },
    padding: {
      unset: "",
      default: "p-(--gutter)",
    },
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    color: {
      default: "bg-surface-background",
      unset: "",
    },
    offset: {
      top: "pt-[var(--gutter)]",
      right: "pr-[var(--gutter)]",
      bottom: "pb-[var(--gutter)]",
      left: "pl-[var(--gutter)]",
      unset: "",
    },
    bleed: {
      true: ["[--gutter:0]"],
      false: "",
    },
    gapless: {
      true: ["[--gap:0]"],
      false: "",
    },
    /**
     * Experimental
     * Might be removed.
     */
    density: {
      unset: "",
      compact: "",
      default: "",
      spacious: "",
    },
  },
  compoundVariants: [
    {
      bleed: true,
      className: "",
    },
    {
      bleed: false,
      density: "default",
      className:
        "[--gutter:var(--spacing-surface-gutter)] [--gap:var(--spacing-surface-gap)]",
    },
    {
      bleed: false,
      density: "compact",
      className:
        "[--gutter:calc(var(--spacing-surface-gutter)/2.25)] [--gap:calc(var(--spacing-surface-gap)/2.25)]",
    },
    {
      bleed: false,
      density: "spacious",
      className:
        "[--gutter:calc(var(--spacing-surface-gutter)*1.125)] [--gap:calc(var(--spacing-surface-gap)*1.125)]",
    },
  ],
  defaultVariants: {
    orientation: "vertical",
    color: "default",
    inset: "unset",
    offset: "unset",
    border: "default",
    padding: "default",
    radius: "default",
    gapless: false,
    bleed: false,
    density: "default",
  },
});

/**
 * @internal
 * use `composeSurfaceStyles`
 *
 * a clone of https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/inset.css
 */
const insetStyles = createStyles({
  base: [
    "[--inset-padding-top-calc:calc(var(--inset-padding-top,0px)+var(--inset-border-width,0px))]",
    "[--inset-padding-right-calc:calc(var(--inset-padding-right,0px)+var(--inset-border-width,0px))]",
    "[--inset-padding-bottom-calc:calc(var(--inset-padding-bottom,0px)+var(--inset-border-width,0px))]",
    "[--inset-padding-left-calc:calc(var(--inset-padding-left,0px)+var(--inset-border-width,0px))]",
    // for inset to work
    "before:after:pointer-events-none before:after:absolute before:after:inset-[var(--spacing-surface-border)]",
  ],
  variants: {
    inset: {
      top: [
        "[--margin-top-override:calc(var(--margin-top)-var(--inset-padding-top-calc))]",
        // Radius
        "rounded-tr-(--inset-border-radius) rounded-tl-(--inset-border-radius)",
      ],
      right: [
        "[--margin-right-override:calc(var(--margin-right)-var(--inset-padding-right-calc))]",
        // Radius
        "rounded-tr-(--inset-border-radius)",
      ],
      bottom: [
        "[--margin-bottom-override:calc(var(--margin-bottom)-var(--inset-padding-bottom-calc))]",
        // Radius
        "rounded-br-(--inset-border-radius) rounded-bl-(--inset-border-radius)",
      ],
      left: [
        "[--margin-left-override:calc(var(--margin-left)-var(--inset-padding-left-calc))]",
        // Radius
        "rounded-bl-(--inset-border-radius)",
      ],
      unset: [""],
    },
  },
  defaultVariants: {
    inset: "unset",
  },
});

export { surfaceStyles };
export type SurfaceVariants = VariantProps<typeof surfaceStyles>;

/**
 * TODO: Document usage and purpose.
 */

export function splitSurfaceStyleProps<T extends SurfaceVariants>(props: T) {
  return createSplitProps<SurfaceVariants>()(props, surfaceStyles.variantKeys);
}

export function SurfaceActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        className,
        "flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto",
      )}
    />
  );
}

type SurfaceInset = NonNullable<VariantProps<typeof insetStyles>["inset"]>;
export const composeInsetStyles = ({
  inset = "unset",
}: {
  inset?: Array<SurfaceInset> | SurfaceInset;
}) => {
  const resolvedInsetConfig = Array.isArray(inset) ? inset : [inset];
  const insetResolvedStyles = resolvedInsetConfig.map(
    (v) => insetStyles.variants.inset[v],
  );

  return cn(insetStyles({ className: "surface-inset" }), insetResolvedStyles);
};
export function SurfaceInset({
  className,
  inset = "unset",
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  inset?: Array<SurfaceInset> | SurfaceInset;
}) {
  const styles = composeInsetStyles({
    inset,
  });

  return <div {...props} className={cn(styles, className)} />;
}
