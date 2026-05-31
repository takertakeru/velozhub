import { forwardRef } from "react";
import { mergeProps } from "react-aria";
import {
  Button,
  ListBox,
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectValue,
  useSlottedContext,
} from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import { CaretUpDownIcon } from "@phosphor-icons/react";
import {
  type ComposedFieldProps,
  Description,
  Field,
  FieldContext,
  FieldControl,
  FieldControllerContext,
  Label,
  type WithFieldControlProps,
} from "./fieldset";
import {
  ClearButton,
  composedInputStyles,
  type ControlOwnProps,
} from "./input";
import { pickerStyles } from "./picker";
import { Popover } from "./popover";
import { textStyles } from "./text";
import { cn, type forwardRefType } from "./utils";

export { Option } from "./picker";

/**
 * @internal
 */
type OwnProps<T extends object> = {
  className?: string;
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
} & ControlOwnProps;
export type SelectProps<T extends object> = OwnProps<T> &
  Omit<AriaSelectProps<T>, keyof OwnProps<T>>;

/**
 * Internal.
 *
 * @internal
 */
function SelectInternal<T extends object>(
  {
    className,
    children,
    startEnhancer,
    endEnhancer,
    isClearable = false,
    adjoined = "unset",
    isDisabled: isDisabledConfig = false,
    items,
    ...props
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const field = useSlottedContext(FieldContext);
  const isDisabled = isDisabledConfig || field?.isDisabled;

  const fieldControl = useSlottedContext(FieldControllerContext)?.field;
  const { root, container, enhancerStart, enhancerEnd, input } =
    composedInputStyles({
      adjoined,
    });

  return (
    <div data-slot="control" className={cn(className, "w-full")}>
      <AriaSelect
        ref={ref}
        {...field}
        {...mergeProps(props, { isDisabled }, field, {
          onSelectionChange: fieldControl?.onChange,
          onBlur: fieldControl?.onBlur,
          selectedKey: fieldControl?.value,
        })}
        data-adjoined={adjoined}
        placeholder={props.placeholder ?? "Select an option"}
        className={root({ padding: "unset" })}
      >
        <Button
          id={field?.id}
          data-component="select"
          className={cn(["w-full focus:outline-none", container()])}
        >
          {Boolean(startEnhancer) && (
            <div data-slot="enhancer" className={cn([enhancerStart()])}>
              {startEnhancer}
            </div>
          )}
          <div
            className={cn([
              "w-full",
              //
              input(),
              // Inherit text styles
              textStyles({
                color: "unset",
                label: "sm",
                className: "truncate text-left",
              }),
              //
            ])}
          >
            <SelectValue className="whitespace-nowrap data-placeholder:text-neutral-500" />
          </div>
          {isClearable && <ClearButton />}
          {endEnhancer ? (
            <span
              data-slot="enhancer"
              className={cn([
                "group/control",
                //
                enhancerEnd(),
              ])}
            >
              {endEnhancer}
            </span>
          ) : (
            <span
              data-slot="enhancer"
              className={cn(
                "group-has-data-disabled/control:stroke-danger-600 forced-colors:stroke-[CanvasText]",
                //
                enhancerEnd(),
              )}
            >
              <CaretUpDownIcon />
            </span>
          )}
        </Button>
        <Popover bleed>
          <ListBox
            items={items}
            className={pickerStyles().list({ className: "max-h-64" })}
          >
            {children}
          </ListBox>
        </Popover>
      </AriaSelect>
    </div>
  );
}

export const Select = (forwardRef as forwardRefType)(SelectInternal);

export function SelectField<
  T extends object,
  TControl extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TControl> = FieldPath<TControl>,
>({
  label,
  description,
  control,
  field,
  defaultFieldValue,
  disabled,
  className,
  ...props
}: /**
 * Removing `defaultValue` since this is a field wrapped component and the
 * field controller handles the values updates.
 */
Omit<SelectProps<T>, "defaultValue"> &
  ComposedFieldProps &
  Partial<WithFieldControlProps<TControl, TFieldName>>) {
  if (control && field) {
    return (
      <FieldControl
        control={control}
        field={field}
        isDisabled={disabled}
        defaultFieldValue={defaultFieldValue}
        className={className}
      >
        <Field>
          {label ? <Label>{label}</Label> : null}
          <Select {...props} />
          {description ? <Description>{description}</Description> : null}
        </Field>
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={disabled} className={className}>
      {label ? <Label>{label}</Label> : null}
      <Select {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}
