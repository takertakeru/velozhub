import React, { type ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants/lite";
import { match } from "ts-pattern";
import {
  createConfigOptions,
  type OptionsType,
  type ThemeColors,
} from "./constants";
import { tagStyles } from "./tag";
import { cn } from "./utils";

/**
 * This is a port of https://github.com/uber/baseweb/tree/main/src/badge.
 */

export const placementOptions = createConfigOptions(
  "topLeft",
  "topRight",
  "bottomRight",
  "bottomLeft",
  "topLeftEdge",
  "topEdge",
  "topRightEdge",
  "bottomRightEdge",
  "bottomEdge",
  "bottomLeftEdge",
  "leftTopEdge",
  "rightTopEdge",
  "rightBottomEdge",
  "leftBottomEdge",
);
export type Placement = OptionsType<typeof placementOptions>;

const roleOptions = createConfigOptions(
  "badge",
  "notificationCircle",
  "hintDot",
);

type BadgeType = OptionsType<typeof roleOptions>;

const DEFAULT_NOTIFICATION_CIRCLE_PLACEMENT = "-top-2.5 -right-2.5";
const DEFAULT_HINT_DOT_PLACEMENT = "-top-1.5 -right-1.5";

const badgeStyles = tv({
  base: "absolute leading-none",
  variants: {
    role: {
      [roleOptions.badge]: "",
      [roleOptions.notificationCircle]: "",
      [roleOptions.hintDot]: "",
    },
    color: {
      unset: "",
      primary: [
        "[--badge-content-color:var(--color-brand-primary-inverse)]",
        "[--badge-bg:var(--color-brand-primary-bold)]",
      ],
      neutral: [
        "[--badge-content-color:var(--color-brand-neutral-inverse)]",
        "[--badge-bg:var(--color-brand-neutral-bold)]",
      ],
      danger: [
        "[--badge-content-color:var(--color-brand-danger-inverse)]",
        "[--badge-bg:var(--color-brand-danger-bold)]",
      ],
      warning: [
        "[--badge-content-color:var(--color-brand-warning-inverse)]",
        "[--badge-bg:var(--color-brand-warning-bold)]",
      ],
      success: [
        "[--badge-content-color:var(--color-brand-success-inverse)]",
        "[--badge-bg:var(--color-brand-success-bold)]",
      ],
      info: [
        "[--badge-content-color:var(--color-brand-info-inverse)]",
        "[--badge-bg:var(--color-brand-info-bold)]",
      ],
    },

    placement: {
      [placementOptions.topEdge]: "",
      [placementOptions.bottomEdge]: "",
      [placementOptions.topLeft]: "",
      [placementOptions.topRight]: "",
      [placementOptions.bottomRight]: "",
      [placementOptions.bottomLeft]: "",
      [placementOptions.topLeftEdge]: "",
      [placementOptions.topRightEdge]: "",
      [placementOptions.bottomRightEdge]: "",
      [placementOptions.bottomLeftEdge]: "",
      [placementOptions.leftTopEdge]: "",
      [placementOptions.rightTopEdge]: "",
      [placementOptions.rightBottomEdge]: "",
      [placementOptions.leftBottomEdge]: "",
    },
  },
  compoundVariants: [
    {
      role: roleOptions.notificationCircle,
      placement: placementOptions.topLeft,
      className: "-top-2.5 -left-2.5",
    },
    // NotificationCircle can only be placed topLeft or topRight, other values fall back to topRight
    {
      role: roleOptions.notificationCircle,
      placement: [
        placementOptions.topRight,
        placementOptions.topEdge,
        placementOptions.bottomEdge,
        placementOptions.bottomRight,
        placementOptions.bottomLeft,
        placementOptions.topLeftEdge,
        placementOptions.topRightEdge,
        placementOptions.bottomRightEdge,
        placementOptions.bottomLeftEdge,
        placementOptions.leftTopEdge,
        placementOptions.rightTopEdge,
        placementOptions.rightBottomEdge,
        placementOptions.leftBottomEdge,
      ],
      className: DEFAULT_NOTIFICATION_CIRCLE_PLACEMENT,
    },
    // HintDot overrides - only topLeft and topRight, others fallback to topRight
    {
      role: roleOptions.hintDot,
      placement: placementOptions.topLeft,
      className: "-top-1 -left-1",
    },
    // HintDot can only be placed topLeft or topRight, other values fall back to topRight
    {
      role: roleOptions.hintDot,
      placement: [
        placementOptions.topRight,
        placementOptions.topEdge,
        placementOptions.bottomEdge,
        placementOptions.bottomRight,
        placementOptions.bottomLeft,
        placementOptions.topLeftEdge,
        placementOptions.topRightEdge,
        placementOptions.bottomRightEdge,
        placementOptions.bottomLeftEdge,
        placementOptions.leftTopEdge,
        placementOptions.rightTopEdge,
        placementOptions.rightBottomEdge,
        placementOptions.leftBottomEdge,
      ],
      className: DEFAULT_HINT_DOT_PLACEMENT,
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.topEdge,
      className: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.bottomEdge,
      className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.topLeft,
      className: "top-4 left-4",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.topRight,
      className: "top-4 right-4",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.bottomRight,
      className: "bottom-4 right-4",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.bottomLeft,
      className: "bottom-4 left-4",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.topLeftEdge,
      className: "-translate-y-1/2 top-0 left-4",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.topRightEdge,
      className: "top-0 -translate-y-1/2 right-4",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.bottomRightEdge,
      className: "bottom-0 translate-y-1/2 right-4",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.bottomLeftEdge,
      className: "bottom-0 translate-y-1/2 left-4",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.leftTopEdge,
      className: "top-4 -left-2",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.rightTopEdge,
      className: "top-4 -right-2",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.rightBottomEdge,
      className: "bottom-4 -right-2",
    },
    {
      role: roleOptions.badge,
      placement: placementOptions.leftBottomEdge,
      className: "bottom-4 -left-2",
    },
  ],
  defaultVariants: {
    role: "badge",
    color: "info",
  },
});

const getAnchorFromChildren = (children?: React.ReactNode | null) => {
  const childArray = React.Children.toArray(children);

  if (childArray.length > 1) {
    console.error(
      `No more than 1 child may be passed to Badge, found ${childArray.length} children`,
    );
  }

  return childArray[0];
};

export type BadgeProps = {
  content: React.ReactNode;
  type?: BadgeType;
  color?: ThemeColors;
  placement?: Placement;
  children?: React.ReactNode;
  className?: string;
};

export function Badge({
  children,
  content,
  color = "info",
  placement = placementOptions.topRightEdge,
  type = "badge",
  className,
}: BadgeProps) {
  const anchor = getAnchorFromChildren(children);

  // eslint-disable-next-line sonarjs/no-collapsible-if
  if (import.meta.env.DEV) {
    if (
      type === "notificationCircle" &&
      placement !== placementOptions.topLeft &&
      placement !== placementOptions.topRight
    ) {
      console.error(
        `NotificationCircle must be placed topLeft or topRight, found ${placement}`,
      );
    }
  }

  // If there's no anchor, render the badge inline
  if (!anchor) {
    return match({ type })
      .with({ type: "badge" }, () => (
        <span className={tagStyles({ color, className })}>{content}</span>
      ))
      .with({ type: "hintDot" }, () => <HintDot />)
      .with({ type: "notificationCircle" }, () => (
        <NotificationCircle className={className}>{content}</NotificationCircle>
      ))
      .otherwise(() => null);
  }

  return (
    <div className={cn("relative inline-block", className)}>
      {anchor}
      <div className={cn([badgeStyles({ placement, role: type, color })])}>
        {match({ type })
          .with({ type: "badge" }, () => (
            <span className={tagStyles({ color })}>{content}</span>
          ))
          .with({ type: "hintDot" }, () => <HintDot />)
          .with({ type: "notificationCircle" }, () => (
            <NotificationCircle>{content}</NotificationCircle>
          ))
          .otherwise(() => null)}
      </div>
    </div>
  );
}

function NotificationCircle({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"span">) {
  let content = getAnchorFromChildren(children);

  // eslint-disable-next-line sonarjs/no-collapsible-if
  if (import.meta.env.DEV) {
    if (typeof content === "string") {
      console.error(
        `NotificationCircle child must be number or icon, found string`,
      );
    }
  }

  if (typeof content === "number" && content > 9) {
    // let's add a number collator here so we can format this
    content = "9+";
  }

  return (
    <span
      {...props}
      className={cn([
        className,
        "inline-flex size-5 items-center justify-center rounded-full bg-[color:var(--badge-bg)] text-[color:var(--badge-content-color)]",
      ])}
    >
      {content}
    </span>
  );
}

function HintDot(props: ComponentPropsWithRef<"span">) {
  // TODO: figure out how to make this overridable
  // // if the anchor is a string, we supply default offsets
  // let horizontalOffset = horizontalOffsetProp;
  // let verticalOffset = verticalOffsetProp;
  // if (typeof anchor === 'string') {
  //   if (!horizontalOffset) {
  //     horizontalOffset = '-14px';
  //   }
  //   if (!verticalOffset) {
  //     verticalOffset = '-4px';
  //   }
  // }

  return (
    <span
      {...props}
      className={cn([
        "flex size-3 items-center justify-center rounded-full bg-[color:var(--badge-bg)]",
      ])}
    />
  );
}
