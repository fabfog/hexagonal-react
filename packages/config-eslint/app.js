const { loadHexagonalConfig } = require('./hexagonal');

const config = loadHexagonalConfig();

module.exports = {
  extends: [
    './base.js',
    'next/core-web-vitals',
  ],
  overrides: [
    {
      // Files OUTSIDE composition root cannot import adapters
      files: ['**/*.ts', '**/*.tsx'],
      excludedFiles: ['**/src/di/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@repo/adapter-*'],
                message: config.errorMessages?.compositionRoot ||
                  'Adapters can only be imported in Composition Root (apps/*/src/di/**). This enforces proper dependency injection.',
              },
            ],
          },
        ],
      },
    },
    {
      // Files INSIDE composition root CAN import adapters
      files: ['**/src/di/**/*.ts', '**/src/di/**/*.tsx'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
};
