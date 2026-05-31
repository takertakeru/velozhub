import {
  composeRenderProps,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants/lite";
import { createLink } from "@tanstack/react-router";
import { pickerStyles } from "./picker";
import {
  type PassThroughPopoverProps,
  Popover,
  splitPopoverProps,
} from "./popover";

export { MenuTrigger } from "react-aria-components";

/**
 * @internal
 */
type OwnProps = PassThroughPopoverProps & {
  /**
   * Whether the menu is going to be used as-is, by default we wrap our menu in a popover
   * since the most common use-case would be a menu dropdown.
   */
  isStandalone?: boolean;
};

type MenuProps<T extends object> = AriaMenuProps<T> & OwnProps;
/**
 * Menu with forwardedRef.
 */
export function Menu<T extends object>({
  isStandalone = false,
  ...props
}: MenuProps<T>) {
  const [popoverProps, { className, ...menuProps }] = splitPopoverProps(props);
  const { list } = pickerStyles({ color: "neutral" });

  if (isStandalone) {
    return (
      <AriaMenu
        {...menuProps}
        className={composeRenderProps(className, (resolvedClassName) =>
          list({ className: resolvedClassName }),
        )}
      />
    );
  }

  return (
    <Popover
      bleed
      {...popoverProps}
      placement={popoverProps.placement ?? "bottom end"}
    >
      <AriaMenu
        {...menuProps}
        className={composeRenderProps(className, (resolvedClassName) =>
          list({ className: resolvedClassName }),
        )}
      />
    </Popover>
  );
}

type MenuItemVariants = VariantProps<typeof pickerStyles>;

export function MenuItem<T extends object>({
  className,
  color = "neutral",
  ...props
}: AriaMenuItemProps<T> & MenuItemVariants) {
  const { option: optionStyles } = pickerStyles({ color });

  return (
    <AriaMenuItem
      {...props}
      className={composeRenderProps(className, (resolvedClassName) =>
        optionStyles({ className: resolvedClassName }),
      )}
    />
  );
}
export const MenuItemLink = createLink(AriaMenuItem);

export function MenuSection<T extends object>({
  className,
  ...props
}: AriaMenuSectionProps<T>) {
  const { section: sectionStyles } = pickerStyles();

  return (
    <AriaMenuSection {...props} className={sectionStyles({ className })} />
  );
}
