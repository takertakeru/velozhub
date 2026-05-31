import React from "react";
import { tv, type VariantProps } from "tailwind-variants/lite";
import { splitSurfaceStyleProps, surfaceStyles } from "./surface";

const card = tv({
  extend: surfaceStyles,
  defaultVariants: {
    padding: "default",
    orientation: "vertical",
    color: "default",
    gutter: "default",
  },
});

export { card as cardStyles };
export type CardStyles = VariantProps<typeof card>;

type CardProps = Omit<
  React.ComponentPropsWithoutRef<"section">,
  keyof CardStyles
> &
  CardStyles;

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  props: CardProps,
  ref,
) {
  const [surfaceStyleProps, { className, ...componentProps }] =
    splitSurfaceStyleProps(props);

  return (
    <section
      ref={ref}
      {...componentProps}
      className={card({ ...surfaceStyleProps, className })}
    />
  );
});
