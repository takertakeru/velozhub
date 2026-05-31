import { createContext, type ForwardedRef, forwardRef } from "react";
import { useFocusRing, useHover, useSwitch, VisuallyHidden } from "react-aria";
import {
  type ContextValue,
  type SwitchProps as AriaSwitchProps,
  useContextProps,
  useSlottedContext,
} from "react-aria-components";
import { useToggleState } from "react-stately";
import {
  filterDOMProps,
  mergeProps,
  mergeRefs,
  useObjectRef,
} from "@react-aria/utils";
import {
  Description,
  FieldContext,
  type FieldProps,
  HeadlessField,
  Label,
  useFieldController,
} from "./fieldset";
import { cn, removeDataAttributes } from "./utils";

const colors = {
  unset: "",
  primary: [
    "[--switch-bg-ring:var(--color-brand-primary-bold)] [--switch-bg:var(--color-brand-primary)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:var(--color-brand-primary)]",
    "[--switch-ring:var(--color-brand-primary)] [--switch-shadow:theme(colors.black/10%)] [--switch:white] dark:[--switch-ring:theme(colors.brand.primary.700/90%)]",
  ],
  neutral: [
    "[--switch-bg-ring:var(--color-brand-neutral-bold)] [--switch-bg:var(--color-brand-neutral)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:var(--color-brand-neutral)]",
    "[--switch-ring:var(--color-brand-neutral)] [--switch-shadow:theme(colors.black/10%)] [--switch:white] dark:[--switch-ring:theme(colors.brand.neutral.700/90%)]",
  ],
  danger: [
    "[--switch-bg-ring:var(--color-brand-danger-bold)] [--switch-bg:var(--color-brand-danger)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:var(--color-brand-danger)]",
    "[--switch-ring:var(--color-brand-danger)] [--switch-shadow:theme(colors.black/10%)] [--switch:white] dark:[--switch-ring:theme(colors.brand.danger.700/90%)]",
  ],
  warning: [
    "[--switch-bg-ring:var(--color-brand-warning-bold)] [--switch-bg:var(--color-brand-warning)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:var(--color-brand-warning)]",
    "[--switch-ring:var(--color-brand-warning)] [--switch-shadow:theme(colors.black/10%)] [--switch:white] dark:[--switch-ring:theme(colors.brand.warning.700/90%)]",
  ],
  success: [
    "[--switch-bg-ring:var(--color-brand-success-bold)] [--switch-bg:var(--color-brand-success)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:var(--color-brand-success)]",
    "[--switch-ring:var(--color-brand-success)] [--switch-shadow:theme(colors.black/10%)] [--switch:white] dark:[--switch-ring:theme(colors.brand.success.700/90%)]",
  ],
  info: [
    "[--switch-bg-ring:var(--color-brand-info-bold)] [--switch-bg:var(--color-brand-info)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:var(--color-brand-info)]",
    "[--switch-ring:var(--color-brand-info)] [--switch-shadow:theme(colors.black/10%)] [--switch:white] dark:[--switch-ring:theme(colors.brand.info.700/90%)]",
  ],
};

type Color = keyof typeof colors;

export const switchFieldLayoutStyles = [
  // Base layout
  "grid grid-cols-[1fr_auto] items-center gap-x-8 gap-y-1 sm:grid-cols-[1fr_auto]",
  // Control layout
  "[&>[data-slot=control]]:col-start-2 [&>[data-slot=control]]:self-center",
  // Label layout
  "[&>[data-slot=label]]:col-start-1 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
  // Description layout
  "[&>[data-slot=description]]:col-start-1 [&>[data-slot=description]]:row-start-2",
  // With description
  "has-data-[slot=description]:**:data-[slot=label]:font-medium",
];

export function SwitchGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="control"
      {...props}
      className={cn(
        className,
        // Basic groups
        "space-y-3 [&_[data-slot=label]]:font-normal",
        // With descriptions
        "has-data-[slot=description]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium",
      )}
    />
  );
}

export function SwitchLayout({
  className,
  ...props
}: { className?: string } & FieldProps) {
  return (
    <HeadlessField
      data-slot="field"
      {...props}
      className={cn(className, "group", switchFieldLayoutStyles)}
    />
  );
}

/**
 * TODO: filter out and pass switch specific props to switch.
 */
export function SwitchField({
  className,
  label,
  description,
  color = "primary",
  isDisabled,
  ...props
}: {
  className?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  color?: Color;
} & Omit<FieldProps, "children">) {
  return (
    <SwitchLayout {...props} className={className} isDisabled={isDisabled}>
      <Switch color={color} isDisabled={isDisabled} />
      {
        // eslint-disable-next-line @eslint-react/no-leaked-conditional-rendering
        label && <Label>{label}</Label>
      }
      {
        // eslint-disable-next-line @eslint-react/no-leaked-conditional-rendering
        description && <Description>{description}</Description>
      }
    </SwitchLayout>
  );
}

export const SwitchContext =
  createContext<ContextValue<AriaSwitchProps, HTMLInputElement>>(null);
export const Switch = forwardRef(function Switch(
  props: AriaSwitchProps & {
    color?: Color;
  },
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { color = "neutral", ...racProps } = props;

  // Merge the local props and ref with the ones provided via context.
  // eslint-disable-next-line no-param-reassign
  [props, ref] = useContextProps(racProps, ref, SwitchContext);

  // Get field props to wire this input to a label
  const field = useSlottedContext(FieldContext);
  // Get controller to control field value via RHF
  const fieldControl = useFieldController()?.field;

  const inputRef = useObjectRef(mergeRefs(ref, fieldControl?.ref));

  const state = useToggleState(props);
  const {
    labelProps,
    inputProps,
    isSelected,
    isDisabled,
    isReadOnly,
    isPressed,
  } = useSwitch(
    {
      ...field,
      onChange: fieldControl?.onChange,
      onBlur: fieldControl?.onBlur,
      isSelected: fieldControl?.value,
      name: fieldControl?.name,
      ...removeDataAttributes(props),
      // ReactNode type doesn't allow function children.
      children: typeof props.children === "function" ? true : props.children,
    },
    state,
    inputRef,
  );

  const { isFocused, isFocusVisible, focusProps } = useFocusRing();
  const isInteractionDisabled = props.isDisabled || props.isReadOnly;

  const { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: isInteractionDisabled,
  });

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const DOMProps = filterDOMProps(props);

  // eslint-disable-next-line no-restricted-syntax/noDeleteOperator
  delete DOMProps.id;

  return (
    <div
      data-slot="control"
      {...mergeProps(DOMProps, labelProps, hoverProps)}
      slot={props.slot || undefined}
      data-selected={isSelected || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={isReadOnly || undefined}
      data-rac=""
    >
      <span
        data-selected={isSelected || undefined}
        data-pressed={isPressed || undefined}
        data-hovered={isHovered || undefined}
        data-focused={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-disabled={isDisabled || undefined}
        className={cn(
          props.className,
          // Base styles
          "group relative isolate inline-flex h-6 w-10 cursor-default rounded-full p-[3px] sm:h-5 sm:w-8",
          // Transitions
          "transition duration-0 duration-200 ease-in-out",
          // Outline and background color in forced-colors mode so switch is still visible
          "forced-colors:outline forced-colors:[--switch-bg:Highlight] dark:forced-colors:[--switch-bg:Highlight]",
          // Unchecked
          "bg-neutral-200 ring-1 ring-black/5 ring-inset dark:bg-white/5 dark:ring-white/15",
          // Checked
          "selected:bg-(--switch-bg) selected:ring-(--switch-bg-ring) dark:data-[selected]:bg-(--switch-bg) dark:data-[selected]:ring-(--switch-bg-ring)",
          // Focus
          "focus:outline focus:outline-offset-2 focus:outline-blue-500 focus:outline-none",
          // Hover
          "hover:ring-black/15 hover:data-[selected]:ring-[--switch-bg-ring]",
          "dark:hover:ring-white/25 dark:hover:data-[selected]:ring-[--switch-bg-ring]",
          // Disabled
          "data-[disabled]:bg-neutral-200 data-[disabled]:opacity-50 data-[disabled]:data-[selected]:bg-neutral-200 data-[disabled]:data-[selected]:ring-black/5",
          "dark:data-[disabled]:bg-white/15 dark:data-[disabled]:data-[selected]:bg-white/15 dark:data-[disabled]:data-[selected]:ring-white/15",
          // Color specific styles
          colors[color],
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            // Basic layout
            "pointer-events-none relative inline-block size-[1.125rem] rounded-full sm:size-3.5",
            // Transition
            "translate-x-0 transition duration-200 ease-in-out",
            // Invisible border so the switch is still visible in forced-colors mode
            "border border-transparent",
            // Unchecked
            "bg-white shadow ring-1 ring-black/5",
            // Checked
            "group-data-[selected]:bg-[--switch] group-data-[selected]:shadow-[--switch-shadow] group-data-[selected]:ring-[--switch-ring]",
            "group-data-[selected]:translate-x-4 sm:group-data-[selected]:translate-x-3",
            // Disabled
            "group-data-[disabled]:group-data-[selected]:bg-white group-data-[disabled]:group-data-[selected]:shadow group-data-[disabled]:group-data-[selected]:ring-black/5",
          )}
        />
      </span>
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
});
