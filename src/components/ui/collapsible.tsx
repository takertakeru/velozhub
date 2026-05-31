import { useContext, useEffect, useRef } from "react";
import {
  composeRenderProps,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
  DisclosureStateContext,
  Heading,
} from "react-aria-components";
import { CaretRightIcon } from "@phosphor-icons/react";
import { Button, type ButtonProps } from "./button";
import { surfaceStyles, type SurfaceVariants } from "./surface";
import { cn } from "./utils";

export function Collapsible({ className, ...props }: AriaDisclosureProps) {
  return (
    <AriaDisclosure
      {...props}
      className={composeRenderProps(className, (value) =>
        cn("group/disclosure", value),
      )}
    />
  );
}

export function CollapsibleTrigger({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <Heading className="group-expanded/disclosure:border-surface-border border-b group-not-data-expanded/disclosure:border-transparent">
      <Button
        variant="plain"
        {...props}
        slot="trigger"
        layout="unset"
        className={cn([
          className,
          //
          "flex w-full items-center justify-between",
        ])}
      >
        {children}
        <CaretRightIcon className="group-expanded/disclosure:rotate-90 [display:var(--indicator-display,inline)] transition duration-150 ease-out" />
      </Button>
    </Heading>
  );
}

export type CollapsiblePanelProps = AriaDisclosurePanelProps &
  Pick<SurfaceVariants, "bleed" | "gapless">;
export function CollapsiblePanel({
  bleed = false,
  gapless = false,
  className,
  children,
  ...props
}: CollapsiblePanelProps) {
  const isExpanded = useContext(DisclosureStateContext)?.isExpanded ?? false;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;

    if (!el) {
      return;
    }
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        el.parentElement?.style.setProperty(
          "--collapsible-height",
          `${entry.target.clientHeight}px`,
        );
      }
    });

    ro.observe(el);

    return () => {
      ro.unobserve(el);
    };
  }, []);

  return (
    <AriaDisclosurePanel
      data-slot="disclosure-panel"
      {...props}
      data-expanded={isExpanded || undefined}
      className={composeRenderProps(className, (classNames) => {
        return cn([
          //
          classNames,
          "outline-hidden",
          //
          "data-expanded:animate-collapsible-expand",
          "not-data-expanded:animate-collapsible-collapse",
        ]);
      })}
    >
      <div
        ref={contentRef}
        className={cn([
          //
          surfaceStyles({
            bleed,
            gapless,
            density: "compact",
            border: "unset",
          }),
        ])}
      >
        {children}
      </div>
    </AriaDisclosurePanel>
  );
}

export function Accordion({ className, ...props }: AriaDisclosureGroupProps) {
  return (
    <AriaDisclosureGroup
      {...props}
      className={composeRenderProps(className, (resolvedClassname) =>
        cn(resolvedClassname, "w-full"),
      )}
    />
  );
}
