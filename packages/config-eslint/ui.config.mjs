import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.next/**", "**/build/**"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      ...reactHooks.configs.recommended.rules,

      // Hexagonal Architecture - UI Layer
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@repo/adapter-*"],
              message: "UI components cannot import adapters directly. Use dependency injection via ViewModels.",
            },
            {
              group: ["@repo/domain"],
              message: "UI components should not import domain directly. Use ViewModels instead.",
            },
          ],
        },
      ],
    },
  }
];
