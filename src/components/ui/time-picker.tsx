import { mergeProps } from "react-aria";
import {
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  TimeField as AriaTimeField,
  type TimeFieldProps as AriaTimeFieldProps,
  type TimeValue,
} from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import { z } from "zod";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { ClockIcon } from "@phosphor-icons/react";
import {
  type ComposedFieldProps,
  Description,
  ErrorMessage,
  FieldControl,
  fieldLayoutStyles,
  Label,
  useFieldController,
  useFieldProps,
  type WithFieldControlProps,
} from "./fieldset";
import { composedInputStyles, type ControlOwnProps } from "./input";
import { cn, Group } from "./utils";

const parseToDate = (value: unknown) => {
  const isDate = z.coerce.date().safeParse(value);

  if (isDate.success) {
    return parseAbsoluteToLocal(isDate.data.toISOString());
  }
  const isString = z.string().safeParse(value);

  if (isString.success) {
    return parseAbsoluteToLocal(isString.data);
  }

  return undefined;
};

type OwnProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControlOwnProps &
  ComposedFieldProps &
  Partial<WithFieldControlProps<TFieldValues, TName>>;

export function TimePickerField<
  T extends TimeValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  adjoined = "unset",
  label,
  description,
  control,
  field: fieldName,
  className,
  ...props
}: AriaTimeFieldProps<T> & OwnProps<TFieldValues, TName>) {
  const controller = useFieldController();
  const fieldController = controller?.field;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const fieldErrorMessage = controller?.fieldState?.error?.message;

  const field = useFieldProps();
  const styles = composedInputStyles({ adjoined });

  if (control && fieldName) {
    return (
      <FieldControl control={control} field={fieldName} className={className}>
        <TimePickerField
          label={label}
          description={description}
          {...props}
        />
      </FieldControl>
    );
  }

  return (
    <AriaTimeField
      {...props}
      data-slot="control"
      aria-labelledby={field?.["aria-labelledby"]}
      aria-describedby={field?.["aria-describedby"]}
      {...mergeProps(props, {
        ...fieldController,
        value: parseToDate(fieldController?.value),
        onChange: (value: TimeValue | null) => {
          fieldController?.onChange(value?.toString());
        },
      })}
      className={cn([className, fieldLayoutStyles, "relative isolate block"])}
    >
      {
        // eslint-disable-next-line @eslint-react/no-leaked-conditional-rendering
        label && <Label>{label}</Label>
      }
      <div data-slot="control" className={styles.root({ className: "group" })}>
        <Group className={styles.container()}>
          <AriaDateInput className={styles.input()}>
            {(segment) => <AriaDateSegment segment={segment} />}
          </AriaDateInput>
          <span data-slot="enhancer" className={styles.enhancerEnd()}>
            <ClockIcon />
          </span>
        </Group>
        {description ? <Description>{description}</Description> : null}
        {fieldErrorMessage ? (
          <ErrorMessage>{fieldErrorMessage}</ErrorMessage>
        ) : null}
      </div>
    </AriaTimeField>
  );
}
