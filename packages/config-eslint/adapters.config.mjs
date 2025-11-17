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

      // Hexagonal Architecture - Adapters Layer
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@repo/adapter-*"],
              message: "Adapters cannot import other adapters. Each adapter must be isolated.",
            },
            {
              group: ["@repo/ui"],
              message: "Adapters layer cannot import UI components.",
            },
          ],
        },
      ],
    },
  }
];
