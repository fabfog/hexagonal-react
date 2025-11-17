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

      // Hexagonal Architecture - Ports Layer
      // Ports CAN import domain types/entities since they define contracts using domain models
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@repo/adapter-*"],
              message: "Ports layer cannot import adapters. Ports define contracts, not implementations.",
            },
            {
              group: ["@repo/ui"],
              message: "Ports layer cannot import UI components.",
            },
          ],
        },
      ],
    },
  }
];
