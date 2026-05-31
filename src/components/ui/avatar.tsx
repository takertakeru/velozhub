import React from "react";
import { tv, type VariantProps } from "tailwind-variants/lite";
import { Button, type UnstyledButtonProps } from "./button";
import { cn } from "./utils";

export const avatarStyles = tv({
  base: [
    // Layout
    "inline-grid shrink-0 align-middle [--ring-opacity:20%] *:col-start-1 *:row-start-1",
    //
    "outline -outline-offset-1 outline-black/(--ring-opacity) dark:outline-white/(--ring-opacity)",
  ],
  variants: {
    shape: {
      square:
        "rounded-(--avatar-radius) *:rounded-(--avatar-radius) [--avatar-radius:20%]",
      circle: "rounded-full *:rounded-full",
    },
  },
  defaultVariants: {
    shape: "circle",
  },
});

/**
 * @internal
 */
type OwnProps = VariantProps<typeof avatarStyles>;
export type AvatarProps = {
  src?: string | null;
  initials?: string;
  alt?: string;
  className?: string;
} & OwnProps;

export function Avatar({
  src = null,
  shape = "circle",
  initials,
  alt = "",
  className,
  ...props
}: AvatarProps & React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      data-slot="avatar"
      {...props}
      className={avatarStyles({ shape, className })}
    >
      {initials && (
        <svg
          className="size-full fill-current p-[5%] text-[48px] font-medium uppercase select-none"
          viewBox="0 0 100 100"
          aria-hidden={alt ? undefined : "true"}
        >
          {alt && <title>{alt}</title>}
          <text
            x="50%"
            y="50%"
            alignmentBaseline="middle"
            dominantBaseline="middle"
            textAnchor="middle"
            dy=".125em"
          >
            {initials}
          </text>
        </svg>
      )}
      {src && <img className="size-full" src={src} alt={alt} />}
    </span>
  );
}

export const AvatarButton = React.forwardRef(function AvatarButton(
  {
    src,
    shape = "circle",
    initials,
    alt,
    className,
  }: AvatarProps & UnstyledButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  return (
    <Button
      variant="unstyled"
      ref={ref}
      className={cn(
        className,
        // Layout
        "relative inline-grid",
        // Focus
        "focus:outline-info-500 focus:outline-offset-2 focus:outline-none",
      )}
    >
      <Avatar src={src} shape={shape} initials={initials} alt={alt} />
    </Button>
  );
});
