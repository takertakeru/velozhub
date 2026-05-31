import {
  composeRenderProps,
  Tab as AriaTab,
  TabList as AriaTabList,
  type TabListProps,
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  Tabs as AriaTabs,
  type TabsProps,
} from "react-aria-components";
import { createLink } from "@tanstack/react-router";
import { composeButtonStyles } from "./button";
import { surfaceStyles, type SurfaceVariants } from "./surface";
import { cn } from "./utils";

export function Tabs(props: TabsProps) {
  // eslint-disable-next-line react/destructuring-assignment
  return <AriaTabs {...props} className={cn([props.className])} />;
}

export function TabList<T extends object>({ ...props }: TabListProps<T>) {
  return (
    <AriaTabList
      {...props}
      className={cn([
        props.className,
        [
          // Base
          "border-surface-border flex border-b",
        ],
      ])}
    />
  );
}

/**
 * @internal
 */
type OwnTabProps = { children: React.ReactNode };
type TabProps = Omit<AriaTabProps, keyof OwnTabProps> & OwnTabProps;
export function Tab({ children, className, ...props }: TabProps) {
  const styles = composeButtonStyles("plain");

  return (
    <AriaTab
      {...props}
      className={composeRenderProps(className, (v) => {
        return cn([
          v,
          // Extend Button
          styles,
          //
          "cursor-default",
          //
          "group/tab",
        ]);
      })}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          // Base
          "absolute inset-x-0 bottom-0 h-0.5 translate-y-1/2",
          // Selected
          "group-data-selected/tab:bg-brand-primary group-not-data-selected/tab:border-transparent",
        )}
      />
    </AriaTab>
  );
}
export const TabLink = createLink(Tab);

type TabPanelProps = AriaTabPanelProps &
  Pick<SurfaceVariants, "bleed" | "gapless">;
export function TabPanel({
  bleed = false,
  gapless = false,
  ...props
}: TabPanelProps) {
  return (
    <AriaTabPanel
      {...props}
      className={cn(
        props.className,
        // Inherit surface styles
        surfaceStyles({
          color: "unset",
          border: "unset",
          density: "compact",
          bleed,
          gapless,
        }),
      )}
    />
  );
}
