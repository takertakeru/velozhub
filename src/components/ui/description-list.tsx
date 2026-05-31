import { tv } from "tailwind-variants/lite";
import type { Orientation } from "./constants";
import { textStyles } from "./text";
import { cn } from "./utils";

const descriptionListStyles = tv({
  base: "",
  slots: {
    root: [
      "group",
      // Layout, use a different layout when a there are items that are grouped
      "grid has-not-data-[slot=group]:grid-cols-1 has-not-data-[slot=group]:sm:grid-cols-[min(50%,--spacing(80))_auto] has-data-[slot=group]:grid-cols-[repeat(var(--cols,2),minmax(0,1fr))]",
    ],
    term: [
      // Typography
      textStyles({
        label: "sm",
        color: "unset",
        className: "text-neutral-500 dark:text-neutral-400",
      }),
      // Layout
      "col-start-1",
      // Border
      "border-t border-surface-border group-data-[slot=group]:border-0 first:border-none",
      // Spacing
      "pt-3 group-data-[slot=group]:py-0 group-data-[slot=group]:pt-0 sm:py-3",
    ],
    description: [
      // Typography
      textStyles({
        paragraph: "sm",
        color: "neutral",
        className: "font-medium",
      }),
      // Border
      "border-surface-border group-not-data-[component=description-group]:sm:border-t sm:[&:nth-child(2)]:border-none",
      // Spacing
      "pt-1 pb-3 group-data-[slot=group]:py-0 group-data-[slot=group]:pt-0 sm:py-3",
    ],
  },
});

export function DescriptionList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dl">) {
  const { root } = descriptionListStyles();

  return <dl {...props} className={root({ className })} />;
}

export function DescriptionGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  orientation?: Orientation;
}) {
  return (
    <div
      {...props}
      data-orientation={orientation}
      data-component="description-group"
      className={cn([className, "group/dl-group"])}
    />
  );
}

export function DescriptionTerm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dt">) {
  const { term } = descriptionListStyles();

  return <dt {...props} className={term({ className })} />;
}

export function DescriptionDetails({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dd">) {
  const { description } = descriptionListStyles();

  return <dd {...props} className={description({ className })} />;
}
