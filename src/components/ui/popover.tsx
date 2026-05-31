import {
  Dialog,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants/lite";
import { surfaceStyles } from "./surface";
import { cn, createSplitProps } from "./utils";

export const overlayStyles = tv({
  extend: surfaceStyles,
  base: [
    // Base styles
    "isolate",
    // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
    "outline outline-transparent focus:outline-none",
    // Handle scrolling it won't fit in viewport
    "overflow-y-auto",
    // Shadows
    "ring-1 shadow-lg ring-neutral-950/10",
  ],
  variants: {
    animate: {
      true: [
        // Animation
        "slide-in-from-left-1 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out exiting:slide-out-to-bottom-1",
        // Placement aware animation
        "data-[placement=bottom]:entering:slide-in-from-top-1 data-[placement=left]:entering:slide-in-from-right-1 data-[placement=right]:entering:slide-in-from-left-1 data-[placement=top]:entering:slide-in-from-bottom-1",
      ],
      false: "",
    },
  },
  defaultVariants: {
    bleed: false,
    animate: true,
  },
});

type PopoverVariants = VariantProps<typeof overlayStyles>;
export type PopoverOwnProps = PopoverVariants & {
  className?: string;
  children: React.ReactNode;
};
export type PopoverProps = Omit<AriaPopoverProps, keyof PopoverOwnProps> &
  PopoverOwnProps;

/**
 * Popover props that are passed through to the underlying AriaPopover component
 * if we are composing it with another components (e.g. Menu,Combobox).
 */
export type PassThroughPopoverProps = Pick<
  AriaPopoverProps,
  | "placement"
  | "arrowBoundaryOffset"
  | "containerPadding"
  | "crossOffset"
  | "isKeyboardDismissDisabled"
>;
/**
 * Handles splitting the popover props when composing it with another components (e.g. Menu,Combobox).
 */
export const splitPopoverProps = <T extends PassThroughPopoverProps>(
  props: T,
) => {
  return createSplitProps<PassThroughPopoverProps>()(props, [
    "arrowBoundaryOffset",
    "placement",
    "containerPadding",
    "isKeyboardDismissDisabled",
    "crossOffset",
  ]);
};

/**
 * Handles splitting the popover props when composing it with another components (e.g. Menu,Combobox).
 */
export function splitPopoverStyleProps<T extends PopoverVariants>(props: T) {
  return createSplitProps<PopoverVariants>()(props, [
    ...overlayStyles.variantKeys,
    ...surfaceStyles.variantKeys,
  ]);
}

export function Popover({ children, className, ...props }: PopoverProps) {
  const [variantsProps, popoverProps] = splitPopoverStyleProps(props);

  return (
    <AriaPopover
      {...popoverProps}
      className={overlayStyles({ ...variantsProps, className })}
    >
      {children}
    </AriaPopover>
  );
}

export function PopoverDialog({ children, ...props }: PopoverProps) {
  const [variantsProps, { className, ...popoverProps }] =
    splitPopoverStyleProps(props);

  return (
    <AriaPopover
      {...popoverProps}
      className={cn(overlayStyles({ ...variantsProps, className }))}
    >
      <Dialog>{children}</Dialog>
    </AriaPopover>
  );
}
