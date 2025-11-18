import { defineConfig } from "vitest/config";
import { baseConfig } from "./base";

export const reactConfig = defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
