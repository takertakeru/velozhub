// eslint-disable-next-line import/no-named-as-default
import clsx, { type ClassValue } from "clsx";
import React, {
  type ComponentPropsWithoutRef,
  type RefCallback,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useObjectRef } from "react-aria";
import {
  DEFAULT_SLOT,
  Group as AriaGroup,
  GroupContext as AriaGroupContext,
  type GroupProps as AriaGroupProps,
  useContextProps,
  type useSlottedContext as useAriaSlottedContext,
} from "react-aria-components";
import { tv } from "tailwind-variants/lite";

export type { VariantProps } from "tailwind-variants/lite";
export { tv as createStyles };

export const baseStyleConfig = tv({
  base: "",
  slots: { default: "" },
  variants: {
    margin: {
      default: [""],
      unset: [""],
    },
    border: {
      default: [""],
      unset: [""],
    },
    padding: {
      default: [""],
      unset: [""],
    },
    radius: {
      default: [""],
      unset: [""],
    },
  },
  defaultVariants: {
    margin: "unset",
    border: "unset",
    padding: "unset",
    radius: "unset",
  },
});

export const cn = (...classes: Array<ClassValue>) => clsx(classes);

export const focusRing = tv({
  base: "outline outline-0 outline-offset-2 data-focusable:focus-visible:outline-2 data-focusable:outline-info-500 forced-colors:outline-[Highlight]",
});

/**
 * Wraps a group of elements in an EnhancerGroup component
 * and applies appropriate styles to enhancers(icons, badges, etc).
 */
export function EnhancerGroup({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <Group
      {...props}
      role="presentation"
      className={clsx([
        // Base
        "inline-flex gap-x-2",
        // Icon
        "*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:sm:size-4",
        //
        className,
      ])}
    />
  );
}

type GroupProps = AriaGroupProps & {
  adjoined?: boolean;
  orientation?: "horizontal" | "vertical";
};
export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  function Group(props, ref) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _ref = useObjectRef(ref);

    // eslint-disable-next-line no-param-reassign
    [props, ref] = useContextProps(props, _ref, AriaGroupContext);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { adjoined, orientation = "horizontal", ...groupProps } = props;

    return (
      <AriaGroup
        ref={ref}
        data-slot="group"
        {...groupProps}
        data-adjoined={adjoined ? "" : undefined}
        data-orientation={orientation}
      />
    );
  },
);

/**
 * Https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/utils.tsx#L209.
 */
export function useSlot(): [RefCallback<Element>, boolean] {
  // Assume we do have the slot in the initial render.
  const [hasSlot, setHasSlot] = useState(true);
  const hasRun = useRef(false);

  // A callback ref which will run when the slotted element mounts.
  // This should happen before the useLayoutEffect below.
  const ref = useCallback((el: unknown) => {
    hasRun.current = true;
    setHasSlot(Boolean(el));
  }, []);

  // If the callback hasn't been called, then reset to false.
  useLayoutEffect(() => {
    if (!hasRun.current) {
      setHasSlot(false);
    }
  }, []);

  return [ref, hasSlot];
}

//github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/utils.tsx#L309
/**
 * Filters out `data-*` attributes to keep them from being passed down and duplicated.
 *
 * @param props
 */
export function removeDataAttributes<T>(props: T): T {
  const prefix = /^(data-.*)$/;
  const filteredProps = {} as T;

  for (const prop in props) {
    if (!prefix.test(prop)) {
      filteredProps[prop] = props[prop];
    }
  }

  return filteredProps;
}

/**
 * Https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/s2/src/types.ts#L21.
 */
// Override forwardRef types so generics work.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare function forwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
): (props: P & React.RefAttributes<T>) => React.ReactElement | null;

export type forwardRefType = typeof forwardRef;

type SlottedContextValue<T> = Parameters<typeof useAriaSlottedContext<T>>[0];

/**
 * Check if the slotted context is available.
 */
export function useSlottedContextExists<T>(
  context: SlottedContextValue<T>,
  slot?: string | null,
): boolean {
  const ctx = useContext(context);

  if (slot === null) {
    // An explicit `null` slot means don't use context.
    return false;
  }
  if (ctx && typeof ctx === "object" && "slots" in ctx && ctx.slots) {
    const slotKey = slot || DEFAULT_SLOT;

    return !ctx.slots[slotKey];
  }

  return false;
}

/**
 * Https://github.com/chakra-ui/ark/blob/main/packages/react/src/utils/create-split-props.ts.
 */
type EnsureKeys<
  ExpectedKeys extends Array<keyof Target>,
  Target,
> = keyof Target extends ExpectedKeys[number]
  ? unknown
  : `Missing required keys: ${Exclude<keyof Target, ExpectedKeys[number]> & string}`;

export function createSplitProps<Target>() {
  return <Keys extends Array<keyof Target>, Props extends Target = Target>(
    props: Props,
    keys: Keys & EnsureKeys<Keys, Target>,
  ) => {
    return (keys as Array<string>).reduce<
      [Target, Omit<Props, Extract<(typeof keys)[number], string>>]
    >(
      (previousValue, currentValue) => {
        const [target, source] = previousValue;
        const key = currentValue as keyof Target & keyof typeof source;

        if (source[key] !== undefined) {
          target[key] = source[key];
        }
        // eslint-disable-next-line no-restricted-syntax/noDeleteOperator, @typescript-eslint/no-dynamic-delete
        delete source[key];

        return [target, source];
      },
      [{} as Target, { ...props }],
    );
  };
}
