import { z } from "zod";

const restAPIErrorSchema = z.object({
  statusText: z.string(),
  status: z.coerce.number(),
});

export type APIError = z.infer<typeof restAPIErrorSchema>;

export function isRESTAPIError(maybeError: unknown): maybeError is APIError {
  return restAPIErrorSchema.safeParse(maybeError).success;
}

export const hasError = (maybeError: unknown): boolean =>
  isRESTAPIError(maybeError);

export const getErrorMessage = (
  error: unknown,
  defaultMessage = "Unknown Error. Refresh page and try again."
): string => {
  if (isRESTAPIError(error)) {
    return error.statusText;
  }
  if (error instanceof Error && "message" in error) {
    return error.message;
  }

  return defaultMessage;
};

export const getErrorStatus = (maybeError: unknown): string | null => {
  if (isRESTAPIError(maybeError)) {
    return maybeError.statusText;
  }

  return null;
};
