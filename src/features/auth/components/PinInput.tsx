/* eslint-disable react/destructuring-assignment */
import { useCallback, useEffect, useState } from "react";
import { Input } from "react-aria-components";
import MultiRef from "react-multi-ref";
import { z } from "zod";
import { useFieldController, useFieldProps } from "@/components/ui/fieldset";
import { cn, Group } from "@/components/ui/utils";

export interface PinCodeProps {
  /** Sets aria-label attribute for each input element. */
  "aria-label"?: string | undefined | null;
  /** Sets aria-labelledby attribute for each input element. */
  "aria-labelledby"?: string | undefined | null;
  /** Sets aria-describedby attribute for each input element. */
  "aria-describedby"?: string | undefined | null;
  /** Sets autocomplete attribute for each input element. */
  autoComplete?: string | undefined | null;
  /** If true, the first input will be focused upon mounting. */
  autoFocus?: boolean;
  /** Render the component in a disabled state. */
  disabled?: boolean;
  /** Renders the component in an error state. */
  // eslint-disable-next-line tsdoc/syntax
  /** Sets the base id string that will be applied to the id attribute of each input element. The index of the input will be appended to this base string. Ex: `id="foo"` -> `id="foo-1"`, `id="foo-2",` etc... */
  // id: string | undefined | null;
  /** Sets the name attribute of each input element. */
  // name: string | undefined | null;
  /** A handler for when any pin code input changes value. */
  //   onChange: (a: ChangeEvent) => unknown;
  /** Sets the placeholder text for each pin code input element. */
  // placeholder: string;
  /** Renders the component at a given size. */
  //   size: keyof typeof SIZE;
  /** If true, when a pin code input receives a valid value, focus will be transferred to the next pin code input (until the end of the inputs). */
  manageFocus?: boolean;
  /** An array of values respective to each pin code input. */
  values?: Array<string>;
  defaultValue?: Array<string>;
  /** Mask for pin code. Default is no mask. Set it true then mask is ".". Also accept string input as customized mask style. */
  mask: boolean | string;
}

const inputRefs = new MultiRef<number, HTMLInputElement>();

const defaultCodeValue = ["", "", "", "", ""];

export function PinCodeInput(props: PinCodeProps) {
  const fieldProps = useFieldProps();
  const fieldControl = useFieldController()?.field;

  const [values, setValues] = useState(
    () => props.defaultValue ?? defaultCodeValue
  );

  useEffect(() => {
    if (!props.autoFocus) {
      return;
    }
    const inputRef = inputRefs.map.get(0);

    if (inputRef?.focus) {
      inputRef.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMaskStyle = useCallback(
    (index: number) => {
      const resolvedValue = z
        .string()
        .optional()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .parse(fieldControl ? fieldControl.value?.[index] : values[index]);

      if (resolvedValue !== "" && typeof props.mask === "string") {
        return props.mask;
      }

      return resolvedValue ?? "";
    },
    [props.mask, values, fieldControl]
  );

  const onChangeHandler = useCallback(
    (newValues: Array<string>) => {
      //
      setValues(newValues);
      fieldControl?.onChange(newValues.join(""));
    },
    [fieldControl]
  );

  return (
    <Group className="flex  items-center gap-4" {...fieldProps}>
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        values.map((_, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="size-14 shrink-0">
              <div
                data-slot="input-container"
                className={cn([
                  // Basic layout
                  "relative flex h-full rounded-[var(--radius-control)]",
                  // Horizontal Padding - moved the horizontal padding here to handle enhancers
                  "px-[calc(theme(spacing[3.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)]",
                  // Border
                  "border-control-border border has-[[data-hovered]]:border-neutral-950/20 dark:border-white/10 dark:has-[[data-hovered]]:border-white/20",
                  // Background color
                  "bg-transparent dark:bg-white/5",
                  // Invalid state
                  "group-data-[invalid]/field:border-danger-500 group-data-[invalid]/field:hover:border-danger-500 group-data-[invalid]/field:dark:border-danger-500 group-data-[invalid]/field:hover:dark:border-danger-500",
                  // Disabled state
                  "disabled:border-neutral-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:hover:disabled:border-white/15",
                  // Adjoined
                ])}
              >
                <Input
                  ref={inputRefs.ref(i)}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  name={fieldControl?.name}
                  pattern="\d*"
                  value={getMaskStyle(i)}
                  className={cn([
                    // Layout
                    "block w-full h-full text-center appearance-none bg-transparent",
                    // Typography
                    "text-lg text-neutral-950 placeholder:text-neutral-500 sm:text-sm/6 dark:text-white",
                    // Hide default focus styles
                    "focus-within:outline-none focus:outline-none focus-visible:outline-none",
                    // Vertical Padding - we only apply the vertical padding to the input itself to have consistent dimensions
                    // when the padding is applied on the wrapper the padding does not collapse properly
                    "py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
                  ])}
                  // eslint-disable-next-line @regru/prefer-early-return/prefer-early-return
                  onKeyDown={(event) => {
                    // if we see a backspace/delete and the input is empty, transfer focus backward
                    if (
                      event.key === "Backspace" &&
                      values[i] === "" &&
                      i > 0
                    ) {
                      const inputRef = inputRefs.map.get(i - 1);

                      inputRef?.focus();
                    }
                  }}
                  onChange={(event) => {
                    const eventValue = event.target.value;

                    // in the case of an autocomplete or copy and paste
                    if (eventValue.length > 2) {
                      // see if we can use the string to fill out our values
                      if (
                        eventValue.length === values.length &&
                        eventValue.match(/\d/)
                      ) {
                        // eslint-disable-next-line unicorn/prefer-spread
                        onChangeHandler(eventValue.split(""));
                      }

                      return;
                    }
                    // digit was deleted
                    if (eventValue === "") {
                      const newValues = [...values];

                      newValues[i] = "";
                      onChangeHandler(newValues);

                      return;
                    }
                    // we want to override the input value with the last digit typed
                    const currentValue = values[i];
                    let newValue = eventValue;

                    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
                    if (currentValue[0] === eventValue[0]) {
                      newValue = eventValue[1];
                      // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
                    } else if (currentValue[0] === eventValue[1]) {
                      newValue = eventValue[0];
                    }
                    // only fire a change event if the new value is a digit
                    if (newValue.match(/\d/)) {
                      const newValues = [...values];

                      newValues[i] = newValue;
                      onChangeHandler(newValues);
                      // tab to next pin code input if we aren't at end already
                      if (i < values.length - 1) {
                        const inputRef = inputRefs.map.get(i + 1);

                        if (inputRef?.focus) {
                          inputRef.focus();
                        }
                      } else {
                        fieldControl?.onBlur();
                      }
                    }
                  }}
                />
              </div>
            </div>
          );
        })
      }
    </Group>
  );
}
