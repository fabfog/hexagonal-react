import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.next/**", "**/build/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // Hexagonal Architecture - Domain Layer
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@repo/adapter-*"],
              message: "Domain layer cannot import adapters. Domain must remain pure.",
            },
            {
              group: ["@repo/ports"],
              message: "Domain layer cannot import ports. Domain must remain pure.",
            },
            {
              group: ["@repo/ui"],
              message: "Domain layer cannot import UI components.",
            },
          ],
        },
      ],
    },
  },
];
