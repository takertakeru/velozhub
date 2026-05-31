/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-useless-assignment */
/* eslint-disable no-param-reassign */

/* eslint-disable unicorn/consistent-destructuring */
import { clsx } from "clsx";
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  useContext,
} from "react";
import {
  mergeProps,
  useCheckbox,
  useCheckboxGroupItem,
  useFocusRing,
  useHover,
} from "react-aria";
import {
  CheckboxContext as AriaCheckboxContext,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  CheckboxGroupStateContext,
  type CheckboxProps as AriaCheckboxProps,
  Provider,
  useContextProps,
  useSlottedContext,
} from "react-aria-components";
import { useToggleState } from "react-stately";
import { filterDOMProps, mergeRefs, useObjectRef } from "@react-aria/utils";
import type { ThemeColors } from "./constants";
import {
  type ComposedFieldProps,
  Description,
  FieldContext,
  FieldControllerContext,
  HeadlessField,
  Label,
} from "./fieldset";

const base = [
  // Basic layout
  "relative isolate flex size-[1.125rem] items-center justify-center rounded-[0.3125rem] sm:size-4",
  // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
  "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(0.3125rem-1px)] before:bg-white before:shadow",
  // Background color when checked
  "group-data-selected:before:bg-(--checkbox-checked-bg)",
  // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
  "dark:before:hidden",
  // Background color applied to control in dark mode
  "dark:bg-white/5 dark:group-data-selected:bg-(--checkbox-checked-bg)",
  // Border
  "border border-neutral-950/15 group-data-[selected]:border-transparent group-data-[selected]:group-data-[hovered]:border-transparent group-data-[hovered]:border-neutral-950/30 group-data-selected:bg-(--checkbox-checked-border)",
  "dark:border-white/15 dark:group-data-[selected]:border-white/5 dark:group-data-[selected]:group-data-[hovered]:border-white/5 dark:group-data-[hovered]:border-white/30",
  // Inner highlight shadow
  "after:absolute after:inset-0 after:rounded-[calc(0.3125rem-1px)] after:shadow-[inset_0_1px_theme(colors.white/15%)]",
  "dark:after:-inset-px dark:after:hidden dark:after:rounded-[0.3125rem] dark:group-data-[selected]:after:block",
  // Focus ring
  "group-data-[focused]:outline group-data-[focused]:outline-2 group-data-[focused]:outline-offset-2 group-data-[focused]:outline-blue-500",
  // Disabled state
  "group-data-[disabled]:opacity-50",
  "group-data-[disabled]:border-neutral-950/25 group-data-[disabled]:bg-neutral-950/5 group-data-[disabled]:[--checkbox-check:var(--color-neutral-950)]/50 group-data-[disabled]:before:bg-transparent",
  "dark:group-data-[disabled]:border-white/20 dark:group-data-[disabled]:bg-white/[2.5%] dark:group-data-[disabled]:[--checkbox-check:var(--color-white)]/50 dark:group-data-[disabled]:group-data-[selected]:after:hidden",
  // Forced colors mode
  "forced-colors:[--checkbox-check:HighlightText] forced-colors:[--checkbox-checked-bg:Highlight] forced-colors:group-data-[disabled]:[--checkbox-check:Highlight]",
  "dark:forced-colors:[--checkbox-check:HighlightText] dark:forced-colors:[--checkbox-checked-bg:Highlight] dark:forced-colors:group-data-[disabled]:[--checkbox-check:Highlight]",
];

const colors = {
  unset: "",
  primary:
    "[--checkbox-check:var(--color-brand-primary-inverse)] [--checkbox-checked-bg:var(--color-brand-primary)] [--checkbox-checked-border:var(--color-brand-primary-border)]",
  neutral:
    "[--checkbox-check:var(--color-brand-neutral-inverse)] [--checkbox-checked-bg:var(--color-brand-neutral)] [--checkbox-checked-border:var(--color-brand-neutral-border)]",
  danger:
    "[--checkbox-check:var(--color-brand-danger-inverse)] [--checkbox-checked-bg:var(--color-brand-danger)] [--checkbox-checked-border:var(--color-brand-danger-border)]",
  warning:
    "[--checkbox-check:var(--color-brand-warning-inverse)] [--checkbox-checked-bg:var(--color-brand-warning)] [--checkbox-checked-border:var(--color-brand-warning-border)]",
  success:
    "[--checkbox-check:var(--color-brand-success-inverse)] [--checkbox-checked-bg:var(--color-brand-success)] [--checkbox-checked-border:var(--color-brand-success-border)]",
  info: "[--checkbox-check:var(--color-brand-info-inverse)] [--checkbox-checked-bg:var(--color-brand-info)] [--checkbox-checked-border:var(--color-brand-info-border)]",
};

export function CheckboxGroup({ className, ...props }: AriaCheckboxGroupProps) {
  return (
    <AriaCheckboxGroup
      data-slot="control"
      {...props}
      className={clsx(
        className,
        // Basic groups
        "group space-y-3",
        // With descriptions
        "has-[[data-slot=description]]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium",
      )}
    />
  );
}

export const checkboxLayoutStyles = [
  // Base layout
  "group grid grid-cols-[1.125rem_1fr] items-center gap-x-4 gap-y-2 sm:grid-cols-[1rem_1fr] relative",
  // Control layout
  "[&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:row-start-1 [&>[data-slot=control]]:justify-self-center",
  // Label layout
  "[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
  // Description layout
  "[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2",
  // With description
  "has-data-[slot=description]:**:data-[slot=label]:font-medium",
];

type FieldProps = Omit<AriaCheckboxProps, "isDisabled" | "isIndeterminate">;

export function HeadlessCheckboxField({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & Omit<
  AriaCheckboxProps,
  "children" | "className"
>) {
  return (
    <Provider values={[[AriaCheckboxContext, props]]}>
      <HeadlessField className={className}>{children}</HeadlessField>
    </Provider>
  );
}

export function CheckboxField({
  color,
  label,
  description,
  className,
  ...props
}: Omit<AriaCheckboxProps, "children" | "className"> &
  Omit<FieldProps, "children"> &
  ComposedFieldProps & { color?: ThemeColors }) {
  return (
    <HeadlessCheckboxField
      {...props}
      className={clsx(className, checkboxLayoutStyles)}
    >
      <Checkbox color={color} />
      {label ? <Label>{label}</Label> : null}
      {description ? <Description>{description}</Description> : null}
    </HeadlessCheckboxField>
  );
}

export function CheckboxMark({
  color,
  ...props
}: ComponentPropsWithoutRef<"span"> & { color: ThemeColors }) {
  return (
    <span {...props} className={clsx([props.className, base, colors[color]])}>
      <svg
        className="size-4 stroke-(--checkbox-check) opacity-0 group-data-selected:opacity-100 sm:h-3.5 sm:w-3.5"
        viewBox="0 0 14 14"
        fill="none"
      >
        {/* Checkmark icon */}
        <path
          className="opacity-100 group-data-indeterminate:opacity-0"
          d="M3 8L6 11L11 3.5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Indeterminate icon */}
        <path
          className="opacity-0 group-data-indeterminate:opacity-100"
          d="M3 7H11"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * We are creating a own implementation of Checkbox that is RAC compliant.
 * So we do not have to create invalid html markup(double `labels`).
 */
export const Checkbox = forwardRef(function Checkbox(
  props: AriaCheckboxProps & { color?: ThemeColors },
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const { color = "neutral", ...racProps } = props;
  const { inputRef: userProvidedInputRef = null } = props;

  // Merge the local props and ref with the ones provided via context.
  [props, ref] = useContextProps(racProps, ref, AriaCheckboxContext);
  // Get field props to wire this input to a label
  const field = useSlottedContext(FieldContext);
  // Get controller to control field value via RHF
  const fieldControl = useSlottedContext(FieldControllerContext)?.field;

  const inputRef = useObjectRef(
    mergeRefs(userProvidedInputRef, props.inputRef ?? null),
  );
  const groupState = useContext(CheckboxGroupStateContext);

  const {
    inputProps,
    isSelected,
    isDisabled,
    isReadOnly,
    isPressed,
    isInvalid,
  } = groupState
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckboxGroupItem(
        {
          ...field,
          ...mergeProps(props, {
            onChange: fieldControl?.onChange,
            onBlur: fieldControl?.onBlur,
            isSelected: fieldControl?.value,
            name: fieldControl?.name,
          }),

          // Value is optional for standalone checkboxes, but required for CheckboxGroup items;
          // it's passed explicitly here to avoid typescript error (requires ignore).
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value: props.value,
          // ReactNode type doesn't allow function children.
          children:
            typeof props.children === "function" ? true : props.children,
        },
        groupState,
        inputRef,
      )
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckbox(
        {
          ...field,
          ...mergeProps(props, {
            onChange: fieldControl?.onChange,
            onBlur: fieldControl?.onBlur,
            isSelected: fieldControl?.value,
            name: fieldControl?.name,
          }),
          children:
            typeof props.children === "function" ? true : props.children,
        },
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useToggleState(props),
        inputRef,
      );

  const { isFocused, isFocusVisible, focusProps } = useFocusRing();
  const isInteractionDisabled = isDisabled || isReadOnly;

  const { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: isInteractionDisabled,
  });

  const DOMProps = filterDOMProps(props);

  // eslint-disable-next-line no-restricted-syntax/noDeleteOperator
  delete DOMProps.id;

  return (
    <div
      {...mergeProps(DOMProps, hoverProps)}
      slot={props.slot || undefined}
      data-selected={isSelected || props.isIndeterminate || undefined}
      data-indeterminate={props.isIndeterminate || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={isReadOnly || undefined}
      data-invalid={isInvalid || undefined}
      data-required={props.isRequired || undefined}
      aria-checked={isSelected || undefined}
      data-rac=""
      className={clsx(
        props.className,
        "group relative inline-flex focus:outline-none",
      )}
    >
      <CheckboxMark color={color} />
      <input
        className="absolute inset-0 size-full opacity-0"
        {...mergeProps(inputProps, focusProps)}
        ref={inputRef}
      />
    </div>
  );
});

export const CheckboxOverlay = forwardRef(function CheckboxOverlay(
  props: AriaCheckboxProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const { inputRef: userProvidedInputRef = null } = props;

  // Merge the local props and ref with the ones provided via context.
  [props, ref] = useContextProps(props, ref, AriaCheckboxContext);

  // Get field props to wire this input to a label
  const field = useSlottedContext(FieldContext);
  // Get controller to control field value via RHF
  const controller = useSlottedContext(FieldControllerContext);

  const inputRef = useObjectRef(
    mergeRefs(userProvidedInputRef, props.inputRef ?? null),
  );
  const groupState = useContext(CheckboxGroupStateContext);

  const {
    inputProps,
    labelProps,
    isSelected,
    isDisabled,
    isReadOnly,
    isPressed,
    isInvalid,
  } = groupState
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckboxGroupItem(
        {
          ...field,
          onChange: controller?.field.onChange,
          onBlur: controller?.field.onBlur,
          isSelected: controller?.field.value,
          name: controller?.field.name,
          ...props,
          // Value is optional for standalone checkboxes, but required for CheckboxGroup items;
          // it's passed explicitly here to avoid typescript error (requires ignore).
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value: props.value,
          // ReactNode type doesn't allow function children.
          children:
            typeof props.children === "function" ? true : props.children,
        },
        groupState,
        inputRef,
      )
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckbox(
        {
          ...props,
          onChange: controller?.field.onChange,
          onBlur: controller?.field.onBlur,
          isSelected: controller?.field.value,
          name: controller?.field.name,
          children:
            typeof props.children === "function" ? true : props.children,
        },
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useToggleState(
          mergeProps(
            props,
            controller?.field
              ? ({
                  onChange: controller.field.onChange,
                  isSelected: controller.field.value,
                } satisfies AriaCheckboxProps)
              : Object.freeze({}),
          ),
        ),
        inputRef,
      );

  const { isFocused, isFocusVisible, focusProps } = useFocusRing();
  const isInteractionDisabled = isDisabled || isReadOnly;

  const { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: isInteractionDisabled,
  });

  const DOMProps = filterDOMProps(props);

  // eslint-disable-next-line no-restricted-syntax/noDeleteOperator
  delete DOMProps.id;

  return (
    <div
      {...mergeProps(DOMProps, labelProps, hoverProps)}
      slot={props.slot || undefined}
      data-selected={isSelected || undefined}
      data-indeterminate={props.isIndeterminate || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={isReadOnly || undefined}
      data-invalid={isInvalid || undefined}
      data-required={props.isRequired || undefined}
      aria-checked={isSelected || undefined}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className={clsx(props.className, "group outline-none")}
    >
      <span className="absolute inset-0">
        <input
          ref={inputRef}
          {...mergeProps(inputProps, focusProps)}
          className="absolute inset-0 m-0 size-full cursor-pointer opacity-0"
        />
      </span>
      {typeof props.children !== "function" && props.children}
    </div>
  );
});
