import React from "react";
import { useMatchRoute } from "@tanstack/react-router";
import { Button, type ButtonProps } from "./button";
import { cn } from "./utils";

export function Navbar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      {...props}
      className={cn(
        className,
        "flex flex-1 items-center gap-4 bg-white py-2.5",
      )}
    />
  );
}

export function NavbarDivider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cn(className, "h-6 w-px bg-neutral-950/10")}
    />
  );
}

export function NavbarSection({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div {...props} className={cn(className, "flex items-center gap-3")} />
  );
}

export function NavbarSpacer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cn(className, "-ml-4 flex-1")}
    />
  );
}

export const NavbarItem = React.forwardRef(function NavbarItem(
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
  const matchRoute = useMatchRoute();

  const classes = cn(
    // Base
    "rounded-control relative flex min-w-0 items-center gap-3 p-2 text-left text-base/6 font-medium text-neutral-950 sm:text-sm/5",
    // Leading icon/icon-only
    "*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-neutral-500 sm:*:data-[slot=icon]:size-5",
    // Trailing icon (down chevron or similar)
    "*:not-nth-2:last:data-[slot=icon]:ml-auto *:not-nth-2:last:data-[slot=icon]:size-5 sm:*:not-nth-2:last:data-[slot=icon]:size-4",
    // Avatar
    "*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--avatar-radius:var(--radius)] *:data-[slot=avatar]:[--ring-opacity:10%] sm:*:data-[slot=avatar]:size-6",
    // Hover
    "hover:bg-neutral-950/5 hover:*:data-[slot=icon]:fill-neutral-950",
    // Active
    "pressed:bg-neutral-950/5 pressed:*:data-[slot=icon]:fill-neutral-950",
    // Dark mode
    "dark:text-white dark:*:data-[slot=icon]:fill-neutral-400",
    "dark:hover:bg-white/5 dark:hover:*:data-[slot=icon]:fill-white",
    "dark:pressed:bg-white/5 dark:pressed:*:data-[slot=icon]:fill-white",
  );

  const isActive =
    "href" in props
      ? Boolean(matchRoute({ to: props.href, fuzzy: true }))
      : false;
  const isCurrent = current || isActive;

  return (
    <span className={cn(className, "relative")}>
      {isCurrent && (
        <span className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-neutral-950 dark:bg-white" />
      )}
      <Button
        variant="unstyled"
        {...props}
        style={undefined}
        className={cn("cursor-default", classes)}
        data-current={isCurrent ? "true" : undefined}
        ref={ref}
      >
        {children}
      </Button>
    </span>
  );
});

export function NavbarLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return <span {...props} className={cn(className, "truncate")} />;
}
