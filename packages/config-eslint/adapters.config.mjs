import js from "@eslint/js";
import tseslint from "typescript-eslint";
import useLessReact from "@dxbox/eslint-plugin-use-less-react";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.next/**", "**/build/**"],
  },
  // Type-aware linting for source files
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: {
      "use-less-react": useLessReact,
    },
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
  },
  // Use recommended preset for use-less-react (includes rules only, plugin is defined above)
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ...useLessReact.configs.recommended[0],
    rules: {
      ...useLessReact.configs.recommended[0].rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  // Type-aware linting for config files using tsconfig.vitest.json
  {
    files: ["*.config.ts", "*.config.mts", "*.config.cts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.vitest.json",
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
    },
  }
];
