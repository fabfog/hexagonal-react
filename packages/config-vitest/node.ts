import { defineConfig } from "vitest/config";
import { baseConfig } from "./base";

export const nodeConfig = defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: "node",
  },
});
