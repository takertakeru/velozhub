import {
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell,
  type CalendarProps as AriaCalendarProps,
  type DateValue,
  Heading,
  RangeCalendar as AriaRangeCalendar,
  type RangeCalendarProps as AriaRangeCalendarProps,
  useLocale,
} from "react-aria-components";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Button } from "./button";
import { textStyles } from "./text";
import { cn } from "./utils";
import { Header } from "./view";

export type CalendarProps<T extends DateValue> = {} & Omit<
  AriaCalendarProps<T>,
  "visibleDuration"
>;

export function Calendar<T extends DateValue>({
  className,
  ...props
}: CalendarProps<T>) {
  const now = today(getLocalTimeZone());

  return (
    <AriaCalendar {...props} data-slot="control">
      <CalendarHeader />
      <CalendarGrid className="[&_td]:border-collapse [&_td]:px-0 [&_td]:py-0.5">
        <CalendarGridHeader />
        <CalendarGridBody>
          {(date) => {
            return (
              <CalendarCell
                date={date}
                className={cn(
                  "not-selected:hover:bg-brand-primary-muted not-selected:hover:text-brand-primary relative flex size-11 cursor-default items-center justify-center rounded-lg text-black tabular-nums outline-hidden sm:size-10 sm:text-sm/6 forced-colors:text-[ButtonText] forced-colors:outline-0",
                  // Selected
                  "selected:bg-brand-primary selected:text-brand-primary-inverse selected:hover:bg-brand-primary/90 selected:pressed:bg-brand-primary-subtle selected:forced-colors:bg-[Highlight] selected:forced-colors:text-[Highlight] selected:forced-colors:data-invalid:bg-[Mark]",
                  // Invalid
                  "invalid:bg-danger invalid:text-danger-fg",
                  // Disabled
                  "disabled:text-brand-neutral-subtle disabled:forced-colors:text-[GrayText]",
                  date.compare(now) === 0 &&
                    "after:bg-brand-primary after:focus-visible:bg-brand-primary-50 selected:after:bg-brand-primary-50 after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full",
                  className,
                )}
              />
            );
          }}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  );
}

export function RangeCalendar<T extends DateValue>({
  className,
  ...props
}: AriaRangeCalendarProps<T>) {
  const now = today(getLocalTimeZone());
  const { visibleDuration } = props;

  return (
    <AriaRangeCalendar {...props} data-slot="control">
      <CalendarHeader />
      <div className="flex snap-x items-start justify-stretch gap-6 overflow-auto sm:gap-10">
        {Array.from({ length: visibleDuration?.months ?? 1 }).map(
          // eslint-disable-next-line @typescript-eslint/naming-convention
          (_, index) => {
            // FIXME: think of another way to generate key
            const id = index + 1;

            return (
              <CalendarGrid
                key={id}
                offset={{ months: index }}
                className="[&_td]:border-collapse [&_td]:px-0 [&_td]:py-0.5"
              >
                <CalendarGridHeader />
                <CalendarGridBody>
                  {(date) => {
                    return (
                      <CalendarCell
                        date={date}
                        className={cn(
                          "not-selected:hover:bg-brand-primary-muted not-selected:rounded-control not-selected:hover:text-brand-primary relative flex size-11 cursor-default items-center justify-center text-black tabular-nums outline-hidden sm:size-10 sm:text-sm/6 forced-colors:text-[ButtonText] forced-colors:outline-0",
                          // Selected
                          "selection-start:rounded-tl-control selection-start:rounded-bl-control selection-start:bg-brand-primary selection-start:text-brand-primary-inverse selection-start:hover:bg-brand-primary/90 selection-start:pressed:bg-brand-primary-subtle selection-start:forced-colors:bg-[Highlight] selection-start:forced-colors:text-[Highlight] selection-start:forced-colors:data-invalid:bg-[Mark]",
                          "selection-end:rounded-tr-control selection-end:rounded-br-control selection-end:bg-brand-primary selection-end:text-brand-primary-inverse selection-end:hover:bg-brand-primary/90 selection-end:pressed:bg-brand-primary-subtle selection-end:forced-colors:bg-[Highlight] selection-end:forced-colors:text-[Highlight] selection-end:forced-colors:data-invalid:bg-[Mark]",
                          // // Selection in-between
                          "selected:bg-brand-primary-muted selected:text-brand-primary selected:hover:bg-primary-200/90 selected:pressed:bg-brand-primary-subtle",
                          // Invalid
                          "invalid:bg-danger invalid:text-danger-fg",
                          // Disabled
                          "disabled:text-brand-neutral-subtle disabled:forced-colors:text-[GrayText]",
                          date.compare(now) === 0 &&
                            "after:bg-brand-primary after:focus-visible:bg-brand-primary-50 selected:after:bg-brand-primary-50 after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full",
                          className,
                        )}
                      />
                    );
                  }}
                </CalendarGridBody>
              </CalendarGrid>
            );
          },
        )}
      </div>
    </AriaRangeCalendar>
  );
}

export function CalendarHeader() {
  const { direction } = useLocale();

  return (
    <Header className="flex w-full items-center justify-between gap-1 px-1 pb-4">
      <Heading
        className={cn([
          //
          textStyles({ label: "md" }),
          //
          "font-medium",
        ])}
      />
      <div className="flex items-center gap-1">
        <Button slot="previous" size="sm" variant="outline" className="h-8">
          {direction === "rtl" ? (
            <CaretRightIcon aria-hidden />
          ) : (
            <CaretLeftIcon aria-hidden />
          )}
        </Button>
        <Button slot="next" size="sm" variant="outline" className="h-8">
          {direction === "rtl" ? (
            <CaretLeftIcon aria-hidden />
          ) : (
            <CaretRightIcon aria-hidden />
          )}
        </Button>
      </div>
    </Header>
  );
}

export function CalendarGridHeader() {
  return (
    <AriaCalendarGridHeader>
      {(day) => {
        return (
          <CalendarHeaderCell className="text-brand-neutral text-xs font-semibold">
            {day}
          </CalendarHeaderCell>
        );
      }}
    </AriaCalendarGridHeader>
  );
}
