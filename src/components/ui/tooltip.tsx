import { forwardRef } from "react";
import {
  OverlayArrow,
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger,
} from "react-aria-components";
import { mergeProps } from "@react-aria/utils";
import {
  overlayStyles,
  type PopoverOwnProps,
  splitPopoverStyleProps,
} from "./popover";
import { Paragraph } from "./text";
import { cn } from "./utils";

/**
 * @internal
 */
type OwnProps = Omit<PopoverOwnProps, "children">;
export type TooltipProps = Omit<AriaTooltipProps, keyof OwnProps> & {
  tootlipOffset?: AriaTooltipProps["offset"];
} & OwnProps;

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip({ children, className, ...props }, ref) {
    const [variantsProps, tooltipProps] = splitPopoverStyleProps(props);
    const { tootlipOffset = 6, crossOffset, placement = "top" } = tooltipProps;

    const isTopOrBottomLeft = [
      "top left",
      "top end",
      "bottom left",
      "bottom end",
    ].includes(placement);
    const isTopOrBottomRight = [
      "top right",
      "top start",
      "bottom right",
      "bottom start",
    ].includes(placement);
    // Set negative cross offset for left and right placement to visually balance the tooltip.
    // eslint-disable-next-line no-nested-ternary
    const calculatedCrossOffset = isTopOrBottomLeft
      ? -12
      : isTopOrBottomRight
        ? 12
        : 0;

    return (
      <AriaTooltip
        ref={ref}
        {...mergeProps(tooltipProps, {
          offset: tootlipOffset,
          placement,
          crossOffset: crossOffset ?? calculatedCrossOffset,
        } satisfies AriaTooltipProps)}
        className={cn([
          overlayStyles({
            ...variantsProps,
            density: "compact",
            className,
          }),
        ])}
      >
        {(renderProps) => {
          return (
            <>
              <OverlayArrow className="group">
                <svg
                  width={8}
                  height={8}
                  viewBox="0 0 8 8"
                  className={cn([
                    "text-surface-background block",
                    // Rotate
                    "group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:translate-y-1/2",
                  ])}
                >
                  <path fill="currentColor" d="M0 0 L4 4 L8 0" />
                </svg>
              </OverlayArrow>
              {typeof children === "function"
                ? children(renderProps)
                : children}
            </>
          );
        }}
      </AriaTooltip>
    );
  },
);

export type WithTooltipProps = Omit<TooltipProps, "children"> & {
  content: React.ReactNode;
  children: React.ReactNode;
};
export function WithTooltip({ content, children, ...props }: WithTooltipProps) {
  return (
    <TooltipTrigger>
      {children}
      <Tooltip {...props}>
        {typeof content === "string" ? (
          <Paragraph>{content}</Paragraph>
        ) : (
          content
        )}
      </Tooltip>
    </TooltipTrigger>
  );
}
