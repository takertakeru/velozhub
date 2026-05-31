import { Amplify, type ResourcesConfig } from "aws-amplify";
import { z } from "zod";
import { authProvider } from "./provider";

type CognitoPasswordSettings = NonNullable<
  NonNullable<NonNullable<ResourcesConfig["Auth"]>["Cognito"]>["passwordFormat"]
>;

// AWS Cognito default password length
const DEFAULT_COGNITO_PASSWORD_MIN_LENGTH = 8;

/**
 * Special characters Cognito recognizes as "symbol" for its password policy.
 * Adapted from https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html.
 */
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/naming-convention
const ALLOWED_SPECIAL_CHARACTERS = [
  '^',  '$', '*', '.', '[', ']',
  '{',  '}', '(', ')', '?', '"',
  '!',  '@', '#', '%', '&', '/',
  '\\', ',', '>', '<', "'", ':',
  ';',  '|', '_', '~', '`', '=',
  '+',  '-', ' ',
];

function buildCognitoPasswordSchema(config: CognitoPasswordSettings) {
  const minLength = config.minLength ?? DEFAULT_COGNITO_PASSWORD_MIN_LENGTH;
  let passwordSchema = z
    .string()
    .min(minLength, `Password must be at least ${minLength} characters long.`);

  if (config.requireLowercase) {
    passwordSchema = passwordSchema.regex(
      /[a-z]/,
      "Password must contain at least one lowercase letter.",
    );
  }
  if (config.requireUppercase) {
    passwordSchema = passwordSchema.regex(
      /[A-Z]/,
      "Password must contain at least one uppercase letter.",
    );
  }
  if (config.requireNumbers) {
    passwordSchema = passwordSchema.regex(
      /\d/,
      "Password must contain at least one number.",
    );
  }
  if (config.requireSpecialCharacters) {
    passwordSchema = passwordSchema.regex(
      new RegExp(
        ALLOWED_SPECIAL_CHARACTERS.map((str) =>
          str.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        ).join("|"),
      ),
      "Password must contain at least one symbol.",
    );
  }

  return passwordSchema;
}

function buildDefaultPasswordSchema() {
  return z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/\d/, "Password must contain at least one number.")
    .regex(/[^a-z0-9]/i, "Password must contain at least one symbol.");
}

/**
 * Returns the active provider's password-policy zod schema. For Cognito,
 * reads the pool's actual `passwordFormat` so client validation tracks the
 * server's policy automatically. For other providers, returns a sensible
 * static default, tighten it in this file if your backend differs.
 */
export function buildPasswordSchema() {
  if (authProvider.name === "cognito") {
    return buildCognitoPasswordSchema(
      Amplify.getConfig().Auth?.Cognito.passwordFormat ?? {},
    );
  }

  return buildDefaultPasswordSchema();
}
