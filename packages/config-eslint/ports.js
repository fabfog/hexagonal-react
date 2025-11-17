const { loadHexagonalConfig, createPackageRestrictionRule } = require('./hexagonal');

const config = loadHexagonalConfig();

module.exports = {
  extends: ['./base.js'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        // Ports CAN import domain types/entities since they define contracts using domain models
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@repo/adapter-*'],
                message: 'Ports layer cannot import adapters. Ports define contracts, not implementations.',
              },
              {
                group: ['@repo/ui'],
                message: 'Ports layer cannot import UI components.',
              },
            ],
          },
        ],
      },
    },
  ],
};
