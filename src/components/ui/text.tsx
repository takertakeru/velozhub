import { clsx } from "clsx";
import { createContext, useContext } from "react";
import { mergeProps } from "react-aria";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
  Heading,
  type HeadingProps,
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  Text as AriaText,
  TextContext,
  type TextProps as AriaTextProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants/lite";
import { createLink } from "@tanstack/react-router";
import type { ThemeColors } from "./constants";
import { cn, useSlottedContextExists } from "./utils";

export const textStyles = tv({
  base: "",
  variants: {
    metric: {
      lg: "text-metric-lg",
      md: "text-metric-md",
      sm: "text-metric-sm",
      xs: "text-metric-xs",
      // using inherit means we want to "inherit" the styles from parent
      inherit: "",
    },
    title: {
      xxl: "text-title-xxl",
      xl: "text-title-xl",
      lg: "text-title-lg",
      md: "text-title-md",
      sm: "text-title-sm",
      xs: "text-title-xs",
      // using inherit means we want to "inherit" the styles from parent
      inherit: "",
    },
    heading: {
      // Display
      lg: "text-heading-lg",
      md: "text-heading-md",
      sm: "text-heading-sm",
      xs: "text-heading-xs",
      // using inherit means we want to "inherit" the styles from parent
      inherit: "",
    },
    label: {
      // Labels
      lg: "text-label-lg",
      md: "text-label-md",
      sm: "text-label-sm",
      xs: "text-label-xs",
      // using inherit means we want to "inherit" the styles from parent
      inherit: "",
    },
    paragraph: {
      // Paragraph
      lg: "text-paragraph-lg",
      md: "text-paragraph-md",
      sm: "text-paragraph-sm",
      xs: "text-paragraph-xs",
      // using inherit means we want to "inherit" the styles from parent
      inherit: "",
    },
    color: {
      unset: "",
      primary: [
        "text-[color:var(--text-color)] [--text-color:var(--color-brand-primary-text)]",
      ],
      neutral: [
        "text-[color:var(--text-color)] [--text-color:var(--color-brand-neutral-text)]",
      ],
      danger: [
        "text-[color:var(--text-color)] [--text-color:var(--color-brand-danger-text)]",
      ],
      success: [
        "text-[color:var(--text-color)] [--text-color:var(--color-brand-success-text)]",
      ],
      warning: [
        "text-[color:var(--text-color)] [--text-color:var(--color-brand-warning-text)]",
      ],
      info: [
        "text-[color:var(--text-color)] [--text-color:var(--color-brand-info-text)]",
      ],
    },
  },
  defaultVariants: {},
});

/**
 * @internal
 * For creating nested Typography to have inherit level (unless an explicit `level` prop is provided)
 * and change the HTML tag to `span` (unless an explicit `component` prop is provided).
 * https://github.com/mui/material-ui/blob/master/packages/mui-joy/src/Typography/Typography.tsx
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const _TextNestedContext = createContext(false);

/**
 * @internal
 * Typography's level will be inherit within this context unless an explicit `level` prop is provided.
 *
 * This is used in components, for example Table, to inherit the parent's size by default.
 * https://github.com/mui/material-ui/blob/master/packages/mui-joy/src/Typography/Typography.tsx
 */
export const TypographyInheritContext = createContext(false);

export type TextVariants = VariantProps<typeof textStyles>;

type OwnTextProps = {
  color?: Exclude<TextVariants["color"], "none"> | "inherit";
  size?: TextVariants["paragraph"];
};

export type TextProps = AriaTextProps & OwnTextProps;
export function Text({
  className,
  size = "sm",
  color = "neutral",
  ...props
}: TextProps /**
 * We are remapping the color prop from "none" to "inherit" to make it clearer that we want to inherit the parent's color
 * instead of "none" which would mean that we want to use the default browser color.
 */ & { color?: Exclude<TextVariants["color"], "none"> | "inherit" }) {
  const isNested = useContext(_TextNestedContext);
  const shouldInheritColor = color === "inherit";

  return (
    <_TextNestedContext.Provider value>
      <AriaText
        data-slot="text"
        elementType={isNested ? "span" : "p"}
        /**
         * We want to force `null` to be able to use this component without conflicts to RAC
         * components without `DEFAULT_SLOT` implemented.
         */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        slot={null}
        {...props}
        className={clsx(
          className,
          textStyles({
            paragraph: size,
            color: shouldInheritColor ? "unset" : color,
          }),
        )}
      />
    </_TextNestedContext.Provider>
  );
}
export { Text as Paragraph };

function TextLinkWrapper({
  color = "neutral",
  size = "sm",
  className,
  ...props
}: OwnTextProps & AriaLinkProps) {
  const isColor = typeof color === "string";
  const colorStyle = isColor
    ? textStyles.variants.color[color as ThemeColors]
    : color;

  return (
    <AriaLink
      {...props}
      className={composeRenderProps(className, (resolvedClassName) => {
        return cn(
          resolvedClassName,
          //
          "hover:underline",
          textStyles({
            paragraph: size,
            color: typeof color === "string" ? "unset" : color,
          }),
          //
          colorStyle,
        );
      })}
    />
  );
}
export const TextLink = createLink(TextLinkWrapper);

export function TextButton({
  className,
  color = "inherit",
  size = "md",
  ...props
}: Omit<AriaButtonProps, "color"> & OwnTextProps) {
  const shouldInherit = color === "inherit";

  return (
    <AriaButton
      {...props}
      className={composeRenderProps(className, (resolvedClassName) => {
        return textStyles({
          paragraph: shouldInherit ? undefined : size,
          color: shouldInherit ? undefined : color,
          className: [
            resolvedClassName,
            // Base
            "relative isolate cursor-pointer gap-x-2 focus:outline-none",
            // Hover
            "hover:opacity-70",
            // Forced colors
            "forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText]",
          ],
        });
      })}
    />
  );
}

export function Strong({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"strong">) {
  return (
    <strong
      {...props}
      className={clsx(
        className,
        "text-brand-neutral-text font-medium dark:text-white",
      )}
    />
  );
}

export function Code({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"code">) {
  return (
    <code
      {...props}
      className={clsx(
        className,
        "border-brand-neutral-text/10 bg-brand-neutral-text/[2.5%] text-brand-neutral-text rounded border px-0.5 text-sm font-medium sm:text-[0.8125rem] dark:border-white/20 dark:bg-white/5 dark:text-white",
      )}
    />
  );
}

export function Title({
  className,
  size = "xs",
  color,
  ...props
}: HeadingProps &
  Partial<{
    color: TextVariants["color"];
    size: TextVariants["title"];
  }>) {
  const hasSlot = useSlottedContextExists(TextContext, "title");

  return (
    <Heading
      {...props}
      {...mergeProps(
        { slot: hasSlot ? "title" : undefined },
        { slot: props.slot },
      )}
      data-slot="title"
      className={clsx(
        className,
        "font-semibold text-balance",
        //
        textStyles({ color, title: size }),
      )}
    />
  );
}

export function MetricText({
  className,
  size = "sm",
  color,
  ...props
}: Omit<AriaTextProps, keyof TextVariants> &
  Partial<{
    size: TextVariants["metric"];
    color: TextVariants["color"];
  }>) {
  return (
    <AriaText
      {...props}
      className={clsx(
        className,
        "font-semibold text-balance",
        //
        textStyles({ color, metric: size }),
      )}
    />
  );
}
