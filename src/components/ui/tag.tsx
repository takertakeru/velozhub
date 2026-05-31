import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  TagList as AriaTagList,
  type TagListProps as AriaTagListProps,
  type TagProps as AriaTagProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants/lite";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "./button";
import { cn } from "./utils";

export const tagStyles = tv({
  base: [
    "inline-flex items-center gap-x-1.5 rounded-control px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline",
    //
    "forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText]",
    // Icon
    "[&_[data-slot=icon]]:-mx-0.5 [&_[data-slot=icon]]:shrink-0 [&_[data-slot=icon]]:text-[--btn-icon] [&_[data-slot=icon]]:size-3",
  ],
  variants: {
    color: {
      unset: "",
      primary: [
        //
        "not-selected:bg-brand-primary-muted not-selected:text-brand-primary-text not-selected:hover:bg-brand-primary/25",
        // Selected
        "selected:bg-brand-primary-bold selected:text-brand-primary-inverse selected:hover:bg-brand-primary-bold/90",
      ],
      neutral: [
        "not-selected:bg-brand-neutral-muted not-selected:text-brand-neutral-text not-selected:hover:bg-brand-neutral/25",
        // Selected
        "selected:bg-brand-neutral-bold selected:text-brand-neutral-inverse selected:hover:bg-brand-neutral-bold/90",
      ],
      danger: [
        "not-selected:bg-brand-danger-muted not-selected:text-brand-danger-text not-selected:hover:bg-brand-danger/25",
        // Selected
        "selected:bg-brand-danger-bold selected:text-brand-danger-inverse selected:hover:bg-brand-danger-bold/90",
      ],
      warning: [
        "not-selected:bg-brand-warning-muted not-selected:text-brand-warning-text not-selected:hover:bg-brand-warning/25",
        // Selected
        "selected:bg-brand-warning-bold selected:text-brand-warning-inverse selected:hover:bg-brand-warning-bold/90",
      ],
      success: [
        "not-selected:bg-brand-success-muted not-selected:text-brand-success-text not-selected:hover:bg-brand-success/25",
        // Selected
        "selected:bg-brand-success-bold selected:text-brand-success-inverse selected:hover:bg-brand-success-bold/90",
      ],
      info: [
        "not-selected:bg-brand-info-muted not-selected:text-brand-info-text not-selected:hover:bg-brand-info/25",
        // Selected
        "selected:bg-brand-info-bold selected:text-brand-info-inverse selected:hover:bg-brand-info-bold/90",
      ],
    },
  },
});

type TagVariants = VariantProps<typeof tagStyles>;
// eslint-disable-next-line @typescript-eslint/naming-convention
type _OwnProps = TagVariants;
type TagProps = _OwnProps & AriaTagProps;

export function TagGroup(props: AriaTagGroupProps) {
  return <AriaTagGroup {...props} />;
}

export function TagList<T extends object>(props: AriaTagListProps<T>) {
  return <AriaTagList data-slot="control" {...props} />;
}

export function Tag({
  color = "neutral",
  className,
  children,
  ...props
}: TagProps) {
  return (
    <AriaTag
      {...props}
      className={cn(
        className,
        //
        tagStyles({ color }),
      )}
    >
      {(renderProps) => {
        return (
          <>
            {typeof children === "function" ? children(renderProps) : children}
            {renderProps.allowsRemoving && (
              <Button
                slot="remove"
                variant="unstyled"
                className="hover:opacity-50"
              >
                <XIcon className="size-2" />
              </Button>
            )}
          </>
        );
      }}
    </AriaTag>
  );
}
