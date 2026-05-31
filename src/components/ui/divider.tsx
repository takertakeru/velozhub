import { Children } from "react";
import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants/lite";
import { cn } from "./utils";

const dividerStyles = tv({
  base: "relative",
  slots: {
    // styles for when the divider haa children
    content: [
      // CSS Variables
      "[--child-position:50%] [--divider-gap:--spacing(2)]",
      // Base
      "relative flex items-center border-0 text-center whitespace-nowrap",
      // :before border styles
      "before:relative before:[margin-inline-end:min(var(--child-position)*999,var(--divider-gap))] before:basis-[var(--child-position)] before:[block-size:1px] before:bg-surface-border",
      // :after border styles
      "after:relative after:[margin-inline-start:min((100%-var(--child-position))*999,var(--divider-gap))] after:basis-[calc(100%-var(--child-position))] after:[block-size:1px] after:bg-surface-border",
    ],
    // placeholder for "no content" so that we can manage the classnames
    default: "",
  },
  variants: {
    orientation: {
      vertical: {
        content: "",
        // default: "block shrink-0 list-none self-stretch border-l",
        default:
          "block shrink-0 list-none border-0 [inline-size:1px] bg-[color:var(--divider-color)]",
      },
      horizontal: {
        content: "",
        default:
          "block shrink-0 list-none self-stretch border-t border-[color:var(--divider-color)] [block-size:1px]",
      },
    },
    subtle: {
      true: {
        content:
          "before:border-brand-neutral-subtle after:border-brand-neutral-subtle",
        default: "[--divider-color:var(--color-surface-border)]",
      },
      false: {
        content: "before:surface-border after:surface-border",
        default: "[--divider-color:var(--color-surface-border)]",
      },
    },
    inset: {
      unset: {
        base: "",
      },
      context: {
        base: "mx-(--inset) [--inset:calc(var(--gutter,var(--spacing-surface-gutter))*-1)]",
      },
    },
  },
  defaultVariants: {
    inset: "unset",
    orientation: "horizontal",
    subtle: false,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
type _OwnProps = VariantProps<typeof dividerStyles>;
export type DividerProps = _OwnProps &
  AriaSeparatorProps & { children?: React.ReactNode };

export function Divider({
  subtle = false,
  orientation = "horizontal",
  className,
  inset,
  ...props
}: DividerProps) {
  const hasChildren = Children.count(props.children) !== 0;
  const {
    content,
    default: defaultSlot,
    base,
  } = dividerStyles({
    subtle,
    orientation,
    inset,
  });

  if (orientation === "vertical") {
    if (hasChildren) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        elementType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        slot,
        ...nativeSpanProps
      } = props;

      return (
        <span
          {...nativeSpanProps}
          data-slot="divider"
          className={content({ className })}
        />
      );
    }

    return (
      <AriaSeparator
        data-slot="divider"
        {...props}
        className={cn([base(), defaultSlot({ className })])}
      />
    );
  }

  if (hasChildren) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      elementType,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      slot,
      ...nativeSpanProps
    } = props;

    return (
      <span
        {...nativeSpanProps}
        data-slot="divider"
        className={content({ className })}
        style={{
          unicodeBidi: "isolate",
        }}
      />
    );
  }

  return (
    <AriaSeparator
      data-slot="divider"
      {...props}
      className={cn([base(), defaultSlot({ className })])}
      style={{
        unicodeBidi: "isolate",
      }}
    />
  );
}
