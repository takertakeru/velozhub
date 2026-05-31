import { forwardRef } from "react";
import {
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  useSlottedContext,
} from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import { mergeRefs, useObjectRef } from "@react-aria/utils";
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
import { cn } from "./utils";

export type TextAreaProps = {
  className?: string;
  resizable?: boolean;
  isDisabled?: boolean;
} & Omit<AriaTextAreaProps, "className" | "disabled">;

export const Textarea = forwardRef(function Textarea(
  { className, resizable = true, ...props }: TextAreaProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
  const objectRef = useObjectRef(ref);
  const field = useSlottedContext(FieldContext);
  const fieldControl = useSlottedContext(FieldControllerContext)?.field;
  const mergedRef = mergeRefs(objectRef, fieldControl?.ref);
  const isDisabled = props.isDisabled || field?.isDisabled;

  return (
    <AriaTextField
      id={field?.id}
      aria-labelledby={field?.["aria-labelledby"]}
      aria-describedby={field?.["aria-describedby"]}
      isDisabled={isDisabled}
      isInvalid={field?.isInvalid}
      data-slot="control"
      value={fieldControl?.value}
      name={fieldControl?.name}
      className={cn([
        className,
        // Basic layout
        "relative isolate block w-full",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:absolute before:inset-px before:rounded-[calc(var(--radius-control)-1px)] before:bg-white before:shadow",
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",
        // Focus ring
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[var(--radius-control)] after:ring-transparent after:ring-inset sm:has-[[data-focus-visible]]:after:ring-2 sm:has-[[data-focus-visible]]:after:ring-blue-500",
        // Disabled state
        "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-neutral-950/5 before:has-[[data-disabled]]:shadow-none",
        // Invalid state
        "before:has-[[data-invalid]]:shadow-danger-500/10",
      ])}
      onChange={fieldControl?.onChange}
      onBlur={fieldControl?.onBlur}
    >
      <div
        data-slot="input-container"
        className={cn([
          // Basic layout
          "relative flex rounded-[var(--radius-control)]",
          // Border
          "border-control-border border has-[[data-hovered]]:border-neutral-950/20 dark:border-white/10 dark:has-[[data-hovered]]:border-white/20",
          // Background color
          "bg-transparent dark:bg-white/5",
          // Invalid state
          "group-data-[invalid]/field:border-danger-500 group-data-[invalid]/field:hover:border-danger-500 group-data-[invalid]/field:dark:border-danger-500 group-data-[invalid]/field:hover:dark:border-danger-500",
          // Disabled state
          "disabled:border-neutral-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:hover:disabled:border-white/15",
        ])}
      >
        <AriaTextArea
          ref={mergedRef}
          {...props}
          className={cn([
            // Layout
            "block w-full appearance-none bg-transparent",
            // Typography
            "text-base/6 text-neutral-950 placeholder:text-neutral-500 sm:text-sm/6 dark:text-white",
            // Hide default focus styles
            "focus-within:outline-none focus:outline-none focus-visible:outline-none",
            // Padding
            "px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
            // Resizable
            resizable ? "resize-y" : "resize-none",
          ])}
        />
      </div>
    </AriaTextField>
  );
});

export function TextareaField<
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
}: TextAreaProps &
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
        <TextareaField {...props} label={label} description={description} />
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={disabled} className={className}>
      {label ? <Label>{label}</Label> : null}
      <Textarea isDisabled={disabled} {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}
