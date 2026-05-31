import {
  DateInput,
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  DateSegment,
  type DateValue,
  Group,
} from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import { z } from "zod";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import { mergeProps } from "@react-aria/utils";
import { Button } from "./button";
import { Calendar, RangeCalendar } from "./calendar";
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
import { PopoverDialog } from "./popover";
import { cn } from "./utils";

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

const parseToDateRange = <T extends DateValue>(value: unknown) => {
  const parsedRange = z
    .object({ start: z.coerce.date(), end: z.coerce.date() })
    .safeParse(value);

  if (parsedRange.success) {
    return {
      start: parseAbsoluteToLocal(parsedRange.data.start.toISOString()),
      end: parseAbsoluteToLocal(parsedRange.data.end.toISOString()),
    } as AriaDateRangePickerProps<T>["value"];
  }

  return undefined;
};

type OwnProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControlOwnProps &
  ComposedFieldProps &
  Partial<WithFieldControlProps<TFieldValues, TName>>;

/**
 * TODO:
 * figure out error message display
 * - should `description` be shown when there is an error?
 */
export function DatePickerField<
  T extends DateValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  adjoined,
  label,
  description,
  control,
  field: fieldName,
  className,
  ...props
}: AriaDatePickerProps<T> & OwnProps<TFieldValues, TName>) {
  const controller = useFieldController();
  const fieldControl = controller?.field;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const fieldErrorMessage = controller?.fieldState?.error?.message;
  const field = useFieldProps();
  const styles = composedInputStyles({ adjoined });

  if (control && fieldName) {
    return (
      <FieldControl control={control} field={fieldName} className={className}>
        <DatePickerField label={label} description={description} {...props} />
      </FieldControl>
    );
  }

  return (
    <AriaDatePicker
      data-slot="control"
      granularity="day"
      {...mergeProps(props, {
        ...fieldControl,
        value: parseToDate(fieldControl?.value),
        onChange: (value: DateValue | null) => {
          fieldControl?.onChange(
            value?.toDate(getLocalTimeZone()).toISOString(),
          );
        },
      })}
      className={cn([className, fieldLayoutStyles])}
    >
      {label ? <Label>{label}</Label> : null}
      <div data-slot="control" className={styles.root({ className: "group" })}>
        <Group
          aria-labelledby={field?.id}
          aria-describedby={field?.["aria-describedby"]}
          className={styles.container()}
        >
          <DateInput className={styles.input()}>
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <span data-slot="enhancer" className={styles.enhancerEnd()}>
            <Button
              data-slot="action"
              size="sm"
              variant="plain"
              inset="right"
              className="self-stretch"
            >
              <CalendarBlankIcon />
            </Button>
          </span>
        </Group>
      </div>
      {description ? <Description>{description}</Description> : null}
      {fieldErrorMessage ? (
        <ErrorMessage>{fieldErrorMessage}</ErrorMessage>
      ) : null}
      <PopoverDialog density="compact">
        <Calendar />
      </PopoverDialog>
    </AriaDatePicker>
  );
}

export function DateRangePickerField<
  T extends DateValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  adjoined,
  control,
  className,
  label,
  description,
  field: fieldName,
  ...props
}: AriaDateRangePickerProps<T> & OwnProps<TFieldValues, TName>) {
  const controller = useFieldController();
  const fieldControl = controller?.field;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const fieldErrorMessage = controller?.fieldState?.error?.message;

  const styles = composedInputStyles({ adjoined });

  if (control && fieldName) {
    return (
      <FieldControl control={control} field={fieldName} className={className}>
        <DateRangePickerField
          label={label}
          description={description}
          {...props}
        />
      </FieldControl>
    );
  }

  return (
    <AriaDateRangePicker
      data-slot="control"
      granularity="day"
      {...mergeProps(props, {
        ...fieldControl,
        value: parseToDateRange(fieldControl?.value),
        onChange: (value) => {
          fieldControl?.onChange({
            start: value?.start.toDate(getLocalTimeZone()).toISOString(),
            end: value?.end.toDate(getLocalTimeZone()).toISOString(),
          });
        },
      } satisfies Partial<AriaDateRangePickerProps<T>>)}
      className={cn([className, fieldLayoutStyles])}
    >
      {label ? <Label>{label}</Label> : null}
      <div data-slot="control" className={styles.root({ className: "group" })}>
        <Group className={styles.container()}>
          <div className="flex flex-1 items-center gap-x-2">
            <DateInput slot="start" className={styles.input()}>
              {(segment) => <DateSegment segment={segment} />}
            </DateInput>
            <span>-</span>
            <DateInput slot="end" className={styles.input()}>
              {(segment) => <DateSegment segment={segment} />}
            </DateInput>
          </div>
          <span data-slot="enhancer" className={styles.enhancerEnd()}>
            <Button
              data-slot="action"
              size="sm"
              variant="plain"
              inset="right"
              className="self-stretch"
            >
              <CalendarBlankIcon />
            </Button>
          </span>
        </Group>
      </div>
      {description ? <Description>{description}</Description> : null}
      {fieldErrorMessage ? (
        <ErrorMessage>{fieldErrorMessage}</ErrorMessage>
      ) : null}
      <PopoverDialog density="compact">
        <RangeCalendar />
      </PopoverDialog>
    </AriaDateRangePicker>
  );
}
