const { loadHexagonalConfig, createPackageRestrictionRule } = require('./hexagonal');

const config = loadHexagonalConfig();

module.exports = {
  extends: ['./base.js'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@repo/adapter-*'],
                message: 'Adapters cannot import other adapters. Each adapter must be isolated.',
              },
              {
                group: ['@repo/ui'],
                message: 'Adapters layer cannot import UI components.',
              },
            ],
          },
        ],
      },
    },
  ],
};
