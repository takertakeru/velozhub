/* eslint-disable tsdoc/syntax */
import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "./constants";

export const toPaginatedResponseSchema = <Data extends z.ZodType>(
  data: Data,
) => {
  // Update this schema based on how you backend structures their paginated response
  return z.object({
    data: z.array(data),
    total_records: z.number().catch(0),
    total_pages: z.number().catch(0),
    current_page: z.number().catch(1),
    records_per_page: z.number().catch(0),
  });
};

export const paginatedPayloadSchema = z.object({
  page: z.number().optional().default(DEFAULT_PAGE),
  perPage: z.number().optional().default(DEFAULT_PAGE_SIZE),
});

type FormDataContentValue = number | string | boolean | File | Blob;

/**
 * Converts a JavaScript object into a FormData instance for multipart form submissions.
 *
 * Handles various data types including primitives, files/blobs, and arrays. Arrays are
 * converted to indexed form fields (e.g., `key[0]`, `key[1]`).
 *
 * @param content - Object containing form data with string keys and various value types.
 * @param content.key - Form field name.
 * @param content.value - Form field value(s) - can be primitives, files, blobs, or arrays thereof.
 * @returns FormData instance ready for HTTP submission.
 * @example
 * ```typescript
 * // Basic usage with primitives
 * const formData = toFormData({
 *   name: 'John Doe',
 *   age: 30,
 *   active: true
 * });
 *
 * // With files and arrays
 * const formData = toFormData({
 *   files: [file1, file2],
 *   tags: ['typescript', 'react'],
 *   avatar: profileImage
 * });
 * ```
 */
export const toFormData = (
  content: Record<string, FormDataContentValue | Array<FormDataContentValue>>,
) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(content)) {
    if (Array.isArray(value)) {
      // Handle array values by appending each item with the same key
      value.forEach((item, index) => {
        // Handle array of files
        if (item instanceof Blob) {
          formData.append(`${key}[${index}]`, item);
        } else {
          // Handle array of primitives
          formData.append(`${key}[${index}]`, String(item));
        }
      });
    } else if (value instanceof Blob) {
      // Handle single file
      formData.append(key, value);
    } else {
      // Handle primitive values
      formData.append(key, String(value));
    }
  }

  return formData;
};
