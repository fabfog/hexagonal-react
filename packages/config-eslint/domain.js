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
                message: 'Domain layer cannot import adapters. Domain must remain pure.',
              },
              {
                group: ['@repo/ports'],
                message: 'Domain layer cannot import ports. Domain must remain pure.',
              },
              {
                group: ['@repo/ui'],
                message: 'Domain layer cannot import UI components.',
              },
            ],
          },
        ],
      },
    },
  ],
};
