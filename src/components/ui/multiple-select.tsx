import {
  type CSSProperties,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  Button as AriaButton,
  composeRenderProps,
  type Key,
  ListBox,
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectStateContext,
  SelectValue as AriaSelectValue,
  Tag as AriaTag,
  TagGroup,
  type TagGroupProps,
  TagList,
} from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import { CaretDownIcon, XIcon } from "@phosphor-icons/react";
import { mergeProps, useResizeObserver } from "@react-aria/utils";
import { Button } from "./button";
import {
  Description,
  Field,
  FieldControl,
  Label,
  type WithComposedFieldControlProps,
} from "./fieldset";
import { ClearButton, composedInputStyles } from "./input";
import { pickerStyles } from "./picker";
import { Popover } from "./popover";
import { cn } from "./utils";

type SelectedKeyShape = {
  id: Key;
  label: string;
  [key: string]: unknown;
};

export type SelectedValueRendererProps<T extends SelectedKeyShape> = {
  selectedKeys: Array<T>;
  onRemove?: (selectedKey: Key) => void;
};

type MultiSelectProps<T extends SelectedKeyShape> = Omit<
  AriaSelectProps<T, "multiple">,
  "children"
> & {
  isClearable?: boolean;
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
};

export function MultiSelect<T extends SelectedKeyShape>({
  items,
  isClearable,
  children,
  className,
  ...props
}: MultiSelectProps<T>) {
  const { root, container, enhancerEnd, input } = composedInputStyles();
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const [controlWidth, setControlWidth] = useState(0);
  const onResize = useCallback(() => {
    if (triggerRef.current) {
      setControlWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  useResizeObserver({
    ref: triggerRef,
    onResize,
  });

  return (
    <div data-slot="control" className="w-full">
      <AriaSelect
        {...props}
        selectionMode="multiple"
        className={composeRenderProps(className, (resolvedClassName) =>
          root({ className: resolvedClassName }),
        )}
      >
        <div ref={triggerRef} data-slot="trigger" className={container()}>
          <AriaSelectValue className={input()}>
            {({ selectedItems, isPlaceholder }) => {
              if (isPlaceholder) {
                return props.placeholder;
              }

              return (
                <SelectedKeysRenderer
                  selectedKeys={selectedItems as Array<T>}
                />
              );
            }}
          </AriaSelectValue>
          {isClearable && <ClearButton />}
          <AriaButton>
            <span data-slot="enhancer" className={cn(enhancerEnd())}>
              <CaretDownIcon />
            </span>
          </AriaButton>
        </div>
        <Popover
          bleed
          triggerRef={triggerRef}
          style={{ "--trigger-width": `${controlWidth}px` } as CSSProperties}
        >
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

function SelectedKeysRenderer<T extends SelectedKeyShape>({
  selectedKeys,
}: SelectedValueRendererProps<T>) {
  const state = useContext(SelectStateContext);

  return (
    <TagGroup
      aria-label="Selected items"
      className="group has-[data-empty]:hidden"
      {...mergeProps(
        {
          onRemove: (keysToRemove) => {
            const currentValue = state?.value;
            const keysArray = [...keysToRemove];

            if (Array.isArray(currentValue)) {
              // Since `Select` values are always the `ids` we just coerce this.
              state?.setValue(
                currentValue.filter((v) => !keysArray.includes(v)),
              );
            }
          },
        } as Partial<TagGroupProps>,
        {},
      )}
    >
      <TagList
        items={selectedKeys}
        className={cn(
          //
          "inline-flex flex-wrap gap-2 pr-2 empty:hidden",
        )}
      >
        {(item) => {
          return (
            <AriaTag
              className={cn([
                // base
                "inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline",
                // Color
                "bg-neutral-600/10 text-neutral-700 group-data-hovered:bg-neutral-600/20 dark:bg-white/5 dark:text-neutral-400 dark:group-data-hovered:bg-white/10",
              ])}
            >
              <span>{item.label}</span>
              <Button
                variant="unstyled"
                slot="remove"
                className="size-3 hover:opacity-50"
              >
                <XIcon data-slot="icon" />
              </Button>
            </AriaTag>
          );
        }}
      </TagList>
    </TagGroup>
  );
}

type MultiSelectFieldProps<T extends SelectedKeyShape> = Omit<
  MultiSelectProps<T>,
  "className"
> & { className?: string };

export function MultiSelectField<
  T extends SelectedKeyShape,
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
}: WithComposedFieldControlProps<
  MultiSelectFieldProps<T>,
  TControl,
  TFieldName
>) {
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
        <MultiSelect {...props} />
        {description ? <Description>{description}</Description> : null}
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={isDisabled} className={className}>
      {label ? <Label>{label}</Label> : null}
      <MultiSelect isDisabled={isDisabled} {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}
