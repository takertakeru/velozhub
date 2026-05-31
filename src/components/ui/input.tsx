import { forwardRef, useState } from "react";
import {
  Input as AriaInput,
  type InputProps as AriaInputProps,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
  TextField as AriaTextField,
} from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import { tv, type VariantProps } from "tailwind-variants/lite";
import { EyeIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { mergeProps, mergeRefs, useObjectRef } from "@react-aria/utils";
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
import { cn, type forwardRefType } from "./utils";

/**
 * @internal
 */
const inputStyles = tv({
  base: [],
  slots: {
    root: [
      // Basic layout
      "relative isolate block w-full",
      // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
      "bg-transparent before:absolute before:inset-0 before:bg-white before:shadow-sm",
      // Focus ring
      "after:pointer-events-none after:absolute after:inset-0 after:ring after:ring-transparent sm:has-focus:after:ring-2 sm:has-focus:after:ring-info-500",
      // Disabled state
      "data-disabled:opacity-50 disabled:border-neutral-950/20 before:data-disabled:bg-neutral-950/5 before:data-disabled:shadow-none",
      // Invalid state
      "before:group-data-invalid/field:shadow-danger-500/10 group-data-invalid/field:border-danger-500 group-data-invalid/field:hover:border-danger-500",
    ],
    container: [
      // Layout
      "flex relative",
    ],
    input: [
      // Layout
      "block w-full appearance-none bg-transparent",
      // Typography
      "text-base/6 text-neutral-950 placeholder:text-neutral-500 sm:text-sm/6",
      // Hide default focus styles
      "focus-within:outline-none focus:outline-none focus-visible:outline-none",
      // Vertical Padding - we only apply the vertical padding to the input itself to have consistent dimensions
      // when the padding is applied on the wrapper the padding does not collapse properly
      "py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
    ],
    enhancerStart: [
      // Base
      "relative flex justify-center items-center pr-1.5 *:text-neutral-500",
      // Icon
      "[&>[data-slot=icon]]:pointer-events-none [&>[data-slot=icon]]:z-10 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:size-4",
    ],
    enhancerEnd: [
      // Base
      "relative flex justify-center items-center pl-1.5 *:text-neutral-500",
      // Icon
      "[&>[data-slot=icon]]:pointer-events-none [&>[data-slot=icon]]:z-10 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:size-4",
    ],
  },
  variants: {
    margin: {
      default: "",
      unset: "",
    },
    padding: {
      default: {
        container: [
          // Horizontal Padding - moved the horizontal padding here to handle enhancers
          "px-[calc(theme(spacing[3.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)]",
        ],
      },
      unset: {
        root: [""],
      },
    },
    border: {
      default: {
        root: [
          // Border
          "border-control-border border has-data-hovered:border-neutral-950/20",
        ],
      },
      unset: {
        root: [""],
      },
    },
    radius: {
      default: {
        root: [
          // Base
          "rounded-[var(--input-radius,var(--radius-control))]",
          //
          "before:rounded-[calc(var(--input-radius,var(--radius-control))-1px)]",
          //
          "after:rounded-[calc(var(--input-radius,var(--radius-control))-1px)]",
        ],
      },
      unset: {
        root: [""],
      },
    },
    adjoined: {
      top: {
        root: [
          // Base
          "data-[adjoined*=top]:rounded-t-none",
          // Border
          "data-[adjoined*=top]:border-t-0",
          //
          "data-[adjoined*=top]:before:rounded-t-none",
          //
          "data-[adjoined*=top]:after:rounded-t-none",
        ],
      },
      right: {
        root: [
          // Base
          "data-[adjoined*=right]:rounded-r-none",
          // Border
          "data-[adjoined*=right]:border-r-0",
          //
          "data-[adjoined*=right]:before:rounded-r-none",
          //
          "data-[adjoined*=right]:after:rounded-r-none",
        ],
      },
      bottom: {
        root: [
          // Base
          "data-[adjoined*=bottom]:rounded-b-none",
          // Border
          "data-[adjoined*=bottom]:border-b-0",
          //
          "data-[adjoined*=bottom]:before:rounded-b-none",
          //
          "data-[adjoined*=bottom]:after:rounded-b-none",
        ],
      },
      left: {
        root: [
          // Base
          "data-[adjoined*=left]:rounded-l-none",
          // Border
          "data-[adjoined*=left]:border-l-0",
          //
          "data-[adjoined*=left]:before:rounded-l-none",
          //
          "data-[adjoined*=left]:after:rounded-l-none",
        ],
      },
      unset: {
        root: [""],
      },
    },
  },
  defaultVariants: {
    adjoined: "unset",
    padding: "default",
    border: "default",
    radius: "default",
  },
});

type InputVariants = VariantProps<typeof inputStyles>;
type AdjoinedVariants = VariantProps<typeof inputStyles>["adjoined"];
type AdjoinedConfig = Array<AdjoinedVariants> | AdjoinedVariants;
export type ControlOwnProps = Omit<InputVariants, "adjoined"> & {
  /** React node to display at the start (left) of the input. */
  startEnhancer?: React.ReactNode;
  /** React node to display at the end (right) of the input. */
  endEnhancer?: React.ReactNode;
  /** Additional CSS classes to apply. */
  className?: string;
  /** Whether to show a clear button when input has content. */
  isClearable?: boolean;
  /**
   * Controls which sides should have their borders/radius removed for adjoined layouts.
   *
   * @example
   * // Single side
   * adjoined="right"
   * // Multiple sides
   * adjoined=\{["top", "right"]\}
   */
  adjoined?: AdjoinedConfig;
};
type InputProps = Omit<AriaInputProps, "className"> &
  ControlOwnProps & {
    className?: string;
  };

const matchMultipleAdjoined = (insets: AdjoinedConfig) => {
  const resolvedInsets = Array.isArray(insets) ? insets : [insets];

  return resolvedInsets.reduce((all, inset) => {
    if (inset) {
      // eslint-disable-next-line no-param-reassign
      all = cn(all, inputStyles.variants.adjoined[inset].root);
    }

    return all;
  }, "");
};

/**
 * Exported so it can be composed with other 'tv' styles using
 * `extend`.
 */
export { inputStyles as baseInputStyles };
/**
 * This is just to composes all the needed configuration that cannot be supported by tv
 * and encapsulates it in thie function to be consistent.
 *
 */
export const composedInputStyles = (
  opts?: Omit<VariantProps<typeof inputStyles>, "adjoined"> & {
    adjoined: AdjoinedConfig;
  },
) => {
  const { adjoined: adjoinedConfig = "unset", ...args } = opts ?? {};

  const {
    root: resolvedRoot,
    /**
     * Removing this so it does not cause confusion. Is not used by any component.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    base,
    ...styles
  } = inputStyles(args);
  /**
   * We are combining the `root` resolved styles and `adjoined` styles
   * since they are always applied together. This can't be accomplished
   * via tailwind-variants so we are manually resolving this. This also
   * helps with consistency.
   */
  const root = (config?: Parameters<typeof resolvedRoot>[0]) => {
    return cn(resolvedRoot(config), matchMultipleAdjoined(adjoinedConfig));
  };

  return {
    ...styles,
    root,
  };
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const _BaseInput = forwardRef(function BaseInput(
  {
    className,
    startEnhancer,
    endEnhancer,
    isClearable = false,
    adjoined,
    ...props
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const objectRef = useObjectRef(ref);
  const controller = useFieldController();
  const fieldControl = controller?.field;
  const mergedRef = mergeRefs(objectRef, fieldControl?.ref);

  const { container, enhancerStart, enhancerEnd, input } = composedInputStyles({
    adjoined,
  });

  return (
    <div data-slot="input-container" className={container()}>
      {Boolean(startEnhancer) && (
        <div data-slot="enhancer" className={enhancerStart()}>
          {startEnhancer}
        </div>
      )}
      <AriaInput ref={mergedRef} {...props} className={input({ className })} />
      {isClearable && (
        <ClearButton
          onClick={() => {
            controller?.field.onChange(props.defaultValue ?? "");
          }}
        />
      )}
      {Boolean(endEnhancer) && (
        <span data-slot="enhancer" className={enhancerEnd()}>
          {endEnhancer}
        </span>
      )}
    </div>
  );
});

export const Input = forwardRef(function Input(
  {
    className,
    startEnhancer,
    endEnhancer,
    isClearable = false,
    adjoined = "unset",
    ...props
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const field = useFieldProps();

  const objectRef = useObjectRef(ref);
  const controller = useFieldController();
  const fieldControl = controller?.field;
  const mergedRef = mergeRefs(objectRef, fieldControl?.ref);

  const { root } = composedInputStyles({ adjoined });

  return (
    <AriaTextField
      id={field?.id}
      value={fieldControl?.value}
      aria-labelledby={field?.["aria-labelledby"]}
      aria-describedby={field?.["aria-describedby"]}
      isDisabled={field?.isDisabled}
      isInvalid={field?.isInvalid}
      data-slot="control"
      data-adjoined={adjoined}
      className={cn([root({ className, padding: "default" })])}
      onChange={fieldControl?.onChange}
      onBlur={fieldControl?.onBlur}
    >
      <_BaseInput
        ref={mergedRef}
        {...props}
        endEnhancer={endEnhancer}
        startEnhancer={startEnhancer}
        isClearable={isClearable}
      />
    </AriaTextField>
  );
});

export function ClearButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      variant="plain"
      size="sm"
      slot="clear"
      inset="right"
      onPress={onClick}
    >
      <XIcon />
    </Button>
  );
}

export function InputField<
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
}: WithComposedFieldControlProps<InputProps, TControl, TFieldName>) {
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
        <Input {...props} />
        {description ? <Description>{description}</Description> : null}
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={disabled} className={className}>
      {label ? <Label>{label}</Label> : null}
      <Input disabled={disabled} {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function _PasswordInput(
  props: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      ref={ref}
      {...props}
      type={isVisible ? "text" : "password"}
      autoComplete="password"
      endEnhancer={
        <Button
          variant="plain"
          data-slot="action"
          inset="right"
          onPress={() => {
            setIsVisible((prev) => !prev);
          }}
        >
          <EyeIcon />
        </Button>
      }
    />
  );
}

export const PasswordInput = (forwardRef as forwardRefType)(_PasswordInput);

export function PasswordInputField<
  TControl extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TControl> = FieldPath<TControl>,
>({
  className,
  label,
  description,
  control,
  field,
  disabled,
  defaultFieldValue,
  ...props
}: WithComposedFieldControlProps<InputProps, TControl, TFieldName>) {
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
        <PasswordInput {...props} />
        {description ? <Description>{description}</Description> : null}
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={disabled} className={className}>
      {label ? <Label>{label}</Label> : null}
      <PasswordInput {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}

type SearchInputProps = Omit<
  InputProps,
  keyof AriaSearchFieldProps | "clearable"
> &
  AriaSearchFieldProps &
  ControlOwnProps;

export const SearchInput = forwardRef(function SearchInput(
  { className, adjoined = "unset", placeholder, ...props }: SearchInputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const objectRef = useObjectRef(ref);
  const fieldProps = useFieldProps();
  const controller = useFieldController();
  const fieldController = controller?.field;

  const mergedRef = mergeRefs(objectRef, fieldController?.ref);

  const { root } = composedInputStyles({ adjoined });

  return (
    <AriaSearchField
      ref={mergedRef}
      aria-label="Search"
      defaultValue={props.defaultValue?.toString()}
      data-slot="control"
      data-adjoined={adjoined}
      isDisabled={props.disabled}
      className={cn(className, "group", root())}
      {...mergeProps(props, fieldProps, {
        onChange: fieldController?.onChange,
        onBlur: fieldController?.onBlur,
        onClear: fieldController
          ? () => {
              fieldController.onChange("");
            }
          : undefined,
      })}
    >
      <_BaseInput
        adjoined="right"
        startEnhancer={<MagnifyingGlassIcon />}
        placeholder={placeholder}
        endEnhancer={
          <span className="in-data-empty:opacity-0">
            <ClearButton />
          </span>
        }
      />
    </AriaSearchField>
  );
});

export function SearchField<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  className,
  control,
  label,
  description,
  field,
  placeholder,
  ...props
}: WithComposedFieldControlProps<SearchInputProps, TFieldValues, TFieldName>) {
  if (control && field) {
    return (
      <FieldControl control={control} field={field} className={className}>
        {label ? <Label>{label}</Label> : null}
        <SearchInput placeholder={placeholder} {...props} />
        {description ? <Description>{description}</Description> : null}
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={props.isDisabled} className={className}>
      {label ? <Label>{label}</Label> : null}
      <SearchInput placeholder={placeholder} {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}
