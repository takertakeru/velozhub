import { z } from "zod";

export const anyObjectSchema = z.object({}).loose();

/**
 * ISO validation.
 */
export const looseIsoDateSchema = z.preprocess((input) => {
  if (typeof input !== "string") {
    return input;
  }

  // Improved regex: Non-capturing group, strict date-like check
  const isDateLike =
    /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})?$/.test(
      input,
    );

  if (isDateLike) {
    return input.replace(" ", "T"); // Fix space -> T
  }

  return input; // Let Zod handle invalid cases
}, z.coerce.date());
