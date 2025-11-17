const { loadHexagonalConfig } = require("./hexagonal");

const config = loadHexagonalConfig();

module.exports = {
  extends: ["./base.js"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@repo/adapter-*"],
                message:
                  "Use-cases layer cannot import adapters. Use ports/interfaces instead.",
              },
              {
                group: ["@repo/ui"],
                message: "Use-cases layer cannot import UI components.",
              },
            ],
          },
        ],
      },
    },
  ],
};
