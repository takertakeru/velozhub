import React from "react";
import { Button, type ButtonProps } from "./button";
import { cn } from "./utils";
import { Header } from "./view";

export function Sidebar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return <nav {...props} className={cn(className, "flex h-full flex-col")} />;
}

export function SidebarHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <Header
      {...props}
      className={cn(
        className,
        "flex flex-col border-b border-neutral-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5",
      )}
    />
  );
}

export function SidebarBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        // Variables
        "[--gutter:var(--sidebar-gutter,--spacing(4))]",
        //
        "flex flex-1 flex-col overflow-y-auto p-(--gutter) [&>[data-slot=section]+[data-slot=section]]:mt-8",
        //
        className,
      )}
    />
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        className,
        // Variables
        "[--gutter:var(--sidebar-gutter,--spacing(4))]",
        //
        "flex flex-col border-t border-neutral-950/5 p-(--gutter) dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5",
      )}
    />
  );
}

export function SidebarSection({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      data-slot="section"
      className={cn(className, "flex flex-col gap-0.5")}
    />
  );
}

export function SidebarDivider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"hr">) {
  return (
    <hr
      {...props}
      className={cn(
        className,
        "my-4 border-t border-neutral-950/5 lg:-mx-4 dark:border-white/5",
      )}
    />
  );
}

export function SidebarSpacer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cn(className, "mt-8 flex-1")}
    />
  );
}

export function SidebarHeading({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h3">) {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h3
      {...props}
      className={cn(
        className,
        "mb-1 px-2 text-xs/6 font-medium text-neutral-500 dark:text-neutral-400",
      )}
    />
  );
}

export const SidebarItem = React.forwardRef(function SidebarItem(
  {
    current,
    className,
    children,
    ...props
  }: {
    current?: boolean;
  } & ButtonProps,
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
) {
  const classes = cn(
    // Base
    "rounded-control flex w-full items-center gap-3 px-2 py-2.5 text-left text-base/6 font-medium text-neutral-950 sm:py-2 sm:text-sm/5",
    // Leading icon/icon-only
    "*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-neutral-500 sm:*:data-[slot=icon]:size-5",
    // Trailing icon (down chevron or similar)
    "*:last:data-[slot=icon]:ml-auto *:last:data-[slot=icon]:size-5 sm:*:last:data-[slot=icon]:size-4",
    // Avatar
    "*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--ring-opacity:10%] sm:*:data-[slot=avatar]:size-6",
    // Hover
    "hover:bg-neutral-950/5 hover:*:data-[slot=icon]:fill-neutral-950",
    // Active
    "data-active:bg-neutral-950/5 data-active:*:data-[slot=icon]:fill-neutral-950",
    // Current
    "data-current:*:data-[slot=icon]:fill-neutral-950",
    // Dark mode
    "dark:text-white dark:*:data-[slot=icon]:fill-neutral-400",
    "dark:hover:bg-white/5 dark:hover:*:data-[slot=icon]:fill-white",
    "dark:data-active:bg-white/5 dark:data-active:*:data-[slot=icon]:fill-white",
    "dark:data-current:*:data-[slot=icon]:fill-white",
  );

  return (
    <span className={cn(className, "relative")}>
      {current && (
        <span className="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-neutral-950 dark:bg-white" />
      )}
      <Button
        variant="unstyled"
        {...props}
        style={undefined}
        className={cn("cursor-default", classes)}
        data-current={current ? "true" : undefined}
        ref={ref}
      >
        {children}
      </Button>
    </span>
  );
});

export function SidebarLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return <span {...props} className={cn(className, "truncate")} />;
}
