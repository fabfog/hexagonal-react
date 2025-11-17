const { loadHexagonalConfig } = require('./hexagonal');

const config = loadHexagonalConfig();

module.exports = {
  extends: [
    './base.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
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
                message: 'UI components cannot import adapters directly. Use dependency injection via ViewModels.',
              },
              {
                group: ['@repo/domain'],
                message: 'UI components should not import domain directly. Use ViewModels instead.',
              },
            ],
          },
        ],
        'react/react-in-jsx-scope': 'off', // Not needed in React 19
        'react/prop-types': 'off', // Using TypeScript
      },
    },
  ],
};
