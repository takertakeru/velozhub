import { type FieldValues, useForm, type UseFormProps } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Hook to integrate `react-hook-form` with `zod`.
 */
export function useZodForm<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  TSchema extends z.ZodObject<{}>,
  TFieldValues extends z.input<TSchema>,
>({
  schema,
  ...options
}: { schema: TSchema } & Omit<UseFormProps<TFieldValues>, "resolver">) {
  return useForm({
    // @ts-expect-error
    resolver: zodResolver(schema),
    ...options,
  });
}

/**
 * Represents a composed form that can be shared.
 * Provides a consistent API for form extraction and submission handling.
 */
export type ComposedForm<TFieldValues extends FieldValues> = {
  /** Default values for the form, can be a function for dynamic defaults. */
  defaultValues?: Partial<TFieldValues>;

  /** Submit handler that receives validated form data. */
  onSubmit: (data: TFieldValues) => void | PromiseLike<void>;
};
