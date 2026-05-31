import {
  type CSSProperties,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";
import { mergeProps } from "react-aria";
import {
  ComboBox as AriaCombobox,
  type ComboBoxProps as AriaComboboxProps,
  Input as AriaInput,
  ListBox,
} from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import { CaretUpDownIcon } from "@phosphor-icons/react";
import { useResizeObserver } from "@react-aria/utils";
import { Button } from "./button";
import {
  Description,
  Field,
  FieldControl,
  Label,
  useFieldController,
  useFieldProps,
  type WithComposedFieldControlProps,
} from "./fieldset";
import {
  ClearButton,
  composedInputStyles,
  type ControlOwnProps,
} from "./input";
import { pickerStyles } from "./picker";
import { Popover } from "./popover";
import { cn, type forwardRefType } from "./utils";

/**
 * @internal
 */
type OwnProps<T extends object> = {
  className?: string;
  items?: Iterable<T>;
  placeholder?: string;
  children: React.ReactNode | ((item: T) => React.ReactNode);
} & Pick<ControlOwnProps, "adjoined" | "isClearable" | "startEnhancer">;

export type ComboBoxProps<T extends object> = OwnProps<T> &
  Omit<AriaComboboxProps<T>, keyof OwnProps<T>>;

/**
 *Internal.
 *
 * @internal
 */
function ComboboxInternal<T extends object>(
  {
    className,
    children,
    adjoined = "unset",
    isDisabled: isDisabledConfig = false,
    isClearable,
    startEnhancer,
    items,
    placeholder,
    ...props
  }: ComboBoxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { root, container, input, enhancerEnd, enhancerStart } =
    composedInputStyles({ adjoined });
  const field = useFieldProps();
  const isDisabled = isDisabledConfig || field?.isDisabled;

  const controller = useFieldController();
  const fieldControl = controller?.field;

  const controlRef = useRef<HTMLDivElement>(null);
  const [controlWidth, setControlWidth] = useState(0);
  const onResize = useCallback(() => {
    if (controlRef.current) {
      setControlWidth(controlRef.current.offsetWidth);
    }
  }, []);

  useResizeObserver({
    ref: controlRef,
    onResize,
  });

  return (
    <AriaCombobox
      ref={ref}
      {...mergeProps(props, { isDisabled }, field, {
        onSelectionChange: fieldControl?.onChange,
        onBlur: fieldControl?.onBlur,
        selectedKey: fieldControl?.value,
      } satisfies Partial<ComboBoxProps<T>>)}
      data-adjoined={adjoined}
      data-slot="control"
      className={className}
    >
      <div className={root()} ref={controlRef}>
        <div className={container()}>
          {Boolean(startEnhancer) && (
            <div data-slot="enhancer" className={enhancerStart()}>
              {startEnhancer}
            </div>
          )}
          <AriaInput placeholder={placeholder} className={input()} />
          {isClearable && (
            <ClearButton
              onClick={() => {
                controller?.field.onChange(props.defaultSelectedKey ?? "");
              }}
            />
          )}
          <span data-slot="enhancer" className={enhancerEnd()}>
            <Button
              data-slot="enhancer"
              size="unset"
              variant="plain"
              inset="right"
              className={cn([
                "[--btn-padding-x:--spacing(2.5))] [--btn-padding-y:--spacing(0.5)]",
              ])}
            >
              <CaretUpDownIcon />
            </Button>
          </span>
        </div>
      </div>

      <Popover
        bleed
        color="unset"
        triggerRef={controlRef}
        style={
          {
            /**
             * We are overriding the default width RAC is writing.
             * Because we are implementing a different layout structure
             * the default RAC measuring will not account for the added
             * elements we added.
             */
            "--trigger-width": `${controlWidth}px`,
          } as CSSProperties
        }
      >
        <ListBox
          items={items}
          className={cn(pickerStyles().list({ className: "max-h-64" }))}
        >
          {children}
        </ListBox>
      </Popover>
    </AriaCombobox>
  );
}

export const Combobox = (forwardRef as forwardRefType)(ComboboxInternal);

export function ComboboxField<
  T extends object,
  TControl extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TControl> = FieldPath<TControl>,
>({
  label,
  description,
  control,
  field,
  isDisabled,
  defaultFieldValue,
  className,
  ...props
}: WithComposedFieldControlProps<ComboBoxProps<T>, TControl, TFieldName>) {
  if (control && field) {
    return (
      <FieldControl
        control={control}
        field={field}
        isDisabled={isDisabled}
        defaultFieldValue={defaultFieldValue}
        className={className}
      >
        {label ? <Label>{label}</Label> : null}
        <Combobox {...props} />
        {description ? <Description>{description}</Description> : null}
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={isDisabled} className={className}>
      {label ? <Label>{label}</Label> : null}
      <Combobox isDisabled={isDisabled} {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}
