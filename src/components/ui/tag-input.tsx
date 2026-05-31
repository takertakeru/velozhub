import { useFocusRing, useHover } from "react-aria";
import type { InputProps } from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import { mergeProps, useId } from "@react-aria/utils";
import { normalizeProps, useMachine } from "@zag-js/react";
import * as tagsInput from "@zag-js/tags-input";
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
import { cn } from "./utils";

/**
 * @internal
 */
type OwnProps = Pick<InputProps, "placeholder"> /**
 * We override the machine's `id` requirement since we provide the value internally unless specified.
 */ & { id?: string };
type TagInputProps = Omit<tagsInput.Props, keyof OwnProps> &
  ControlOwnProps &
  OwnProps;

const filterHoverProps = (props: InputProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onHoverStart, onHoverChange, onHoverEnd, ...otherProps } = props;

  return otherProps;
};

export function TagInput({
  startEnhancer,
  endEnhancer,
  isClearable = false,
  adjoined,
  className,
  placeholder,
  ...props
}: TagInputProps) {
  const fieldProps = useFieldProps();
  const controller = useFieldController();
  const fieldControl = controller?.field;
  const isDisabled = fieldControl?.disabled || fieldProps?.isDisabled;

  const id = useId();
  const machineId = fieldProps?.id ?? id;

  const service = useMachine(tagsInput.machine, {
    ...mergeProps(props, {
      name: fieldControl?.name,
      id: machineId,
      disabled: isDisabled,
      value: fieldControl?.value,
      onValueChange(details) {
        fieldControl?.onChange(details.value);
      },
      onFocusOutside: () => {
        fieldControl?.onBlur();
      },
    } satisfies Partial<TagInputProps>),
  });

  const api = tagsInput.connect(service, normalizeProps);
  const { hoverProps, isHovered } = useHover({ isDisabled: props.disabled });
  const { isFocused, isFocusVisible, focusProps } = useFocusRing({
    isTextInput: true,
    autoFocus: props.autoFocus,
  });

  const { container, root, input, enhancerStart, enhancerEnd } =
    composedInputStyles({
      adjoined,
    });

  return (
    <div
      {...api.getRootProps()}
      data-slot="control"
      className={cn(["group", root({ className })])}
    >
      <div
        {...api.getControlProps()}
        data-slot="input-container"
        className={cn([container()])}
      >
        {Boolean(startEnhancer) && (
          <div data-slot="enhancer" className={cn([enhancerStart()])}>
            {startEnhancer}
          </div>
        )}
        <div
          className={cn([
            //
            "flex flex-1 flex-wrap gap-2 pr-2 group-data-empty:hidden",
            //
            "my-[calc(theme(spacing[2.5])-1px)] sm:my-[calc(theme(spacing[1.5])-1px)]",
          ])}
        >
          {api.value.map((value, index) => {
            return (
              <span
                key={value}
                {...api.getItemProps({ index, value })}
                className={cn([
                  "inline-flex shrink-0 items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline",
                  // Icon
                  "forced-colors:[--btn-icon:ButtonText] forced-colors:data-[hovered]:[--btn-icon:ButtonText] [&_[data-slot=icon]]:-mx-0.5 [&_[data-slot=icon]]:my-0.5 [&_[data-slot=icon]]:size-5 [&_[data-slot=icon]]:shrink-0 [&_[data-slot=icon]]:text-[--btn-icon] [&_[data-slot=icon]]:sm:my-1 [&_[data-slot=icon]]:sm:size-4",
                  //Color
                  "bg-neutral-600/10 text-neutral-700 group-data-[hovered]:bg-neutral-600/20 dark:bg-white/5 dark:text-neutral-400 dark:group-data-[hovered]:bg-white/10",
                ])}
              >
                <div
                  {...api.getItemPreviewProps({ index, value })}
                  className="flex items-center gap-2"
                >
                  <span className="shrink-0">{value}</span>
                  <button {...api.getItemDeleteTriggerProps({ index, value })}>
                    &#x2715;
                  </button>
                </div>
                <input {...api.getItemInputProps({ index, value })} />
              </span>
            );
          })}
        </div>
        <input
          {...mergeProps(
            filterHoverProps(api.getInputProps()),
            { id: machineId },
            focusProps,
            hoverProps,
          )}
          placeholder={placeholder}
          className={input()}
          data-focused={isFocused || undefined}
          data-disabled={props.disabled || undefined}
          data-hovered={isHovered || undefined}
          data-focus-visible={isFocusVisible || undefined}
        />
        {isClearable && (
          <ClearButton
            onClick={() => {
              if (controller) {
                controller.field.onChange(props.defaultValue ?? "");
              } else {
                api.clearInputValue();
              }
            }}
          />
        )}
        {Boolean(endEnhancer) && (
          <span data-slot="enhancer" className={enhancerEnd()}>
            {endEnhancer}
          </span>
        )}
      </div>
    </div>
  );
}

export function TagInputField<
  TControl extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TControl> = FieldPath<TControl>,
>({
  label,
  description,
  control,
  field,
  disabled,
  defaultFieldValue,
  className,
  ...props
}: WithComposedFieldControlProps<TagInputProps, TControl, TFieldName>) {
  if (control && field) {
    return (
      <FieldControl
        control={control}
        field={field}
        isDisabled={disabled}
        defaultFieldValue={defaultFieldValue}
        className={className}
      >
        {label ? <Label>{label}</Label> : null}
        <TagInput {...props} />
        {description ? <Description>{description}</Description> : null}
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={disabled} className={className}>
      {label ? <Label>{label}</Label> : null}
      <TagInput disabled={disabled} {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}
