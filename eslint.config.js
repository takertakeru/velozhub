// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { sheriff, tseslint } from "eslint-config-sheriff";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";

const sheriffOptions = {
  react: true,
  lodash: false,
  remeda: false,
  next: false,
  astro: false,
  playwright: false,
  storybook: false,
  jest: false,
  vitest: true,
  pathsOverrides: {
    tsconfigLocation: ["./tsconfig.json"],
  },
};

export default tseslint.config(sheriff(sheriffOptions), {
  extends: [
    ...pluginQuery.configs["flat/recommended"],
    ...pluginRouter.configs["flat/recommended"],
    reactYouMightNotNeedAnEffect.configs.recommended,
  ],
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "fsecond/prefer-destructured-optionals": "off",
    "no-void": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "sonarjs/no-duplicate-string": "off",
    "unicorn/no-array-reduce": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "react-refresh/only-export-components": "off",
    "unicorn/prefer-top-level-await": "off",
    "prefer-arrow-callback": "off",
    "func-style": "off",
    "no-use-before-define": "off",
    "no-console": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/array-type": [
      "error",
      {
        default: "generic",
        readonly: "generic",
      },
    ],
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        /** Whether to allow `number` typed values in template expressions. */
        allowNumber: true,
      },
    ],
    "react/no-multi-comp": [0],
    "react/function-component-definition": [
      2,
      { namedComponents: "function-declaration" },
    ],
    // Modular Monolith Architecture Rules
    // "no-restricted-imports": [
    //   "error",
    //   {
    //     patterns: [
    //       {
    //         group: [
    //           "@/features/*/api/*",
    //           "@/features/*/types/*",
    //           "@/features/*/utils/*",
    //         ],
    //         message:
    //           "Direct imports from feature internals are not allowed. Use the feature's public interface through its index.ts file.",
    //       },
    //       {
    //         group: ["@/features/*/*", "!@/features/*/index"],
    //         message:
    //           "Deep imports into features are not allowed. Import from the feature's public interface (@/features/[feature-name]).",
    //       },
    //     ],
    //   },
    // ],
  },
});
