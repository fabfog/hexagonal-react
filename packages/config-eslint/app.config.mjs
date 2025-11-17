import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/build/**",
      "**/next-env.d.ts",
      "**/next.config.js",
      "**/next.config.cjs",
      "**/vite.config.ts",
      "**/vite.config.js",
      "**/postcss.config.js",
      "**/postcss.config.mjs",
      "**/tailwind.config.js",
      "**/tailwind.config.ts",
    ],
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

      // Hexagonal Architecture - App Layer
      // Apps can import adapter-viewmodels (for container components)
      // but not other adapters (database, API, etc.)
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@repo/adapter-demo", "@repo/adapter-!(viewmodels)"],
              message: "Apps cannot import infrastructure adapters directly. Only adapter-viewmodels are allowed in container components. Use DI container for everything else.",
            },
          ],
        },
      ],
    },
  },
  // DI Container (Composition Root) - can import any adapters
  {
    files: ["**/src/di/**/*.{ts,tsx}", "**/di/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];
