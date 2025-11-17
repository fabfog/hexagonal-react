const path = require('path');
const fs = require('fs');

/**
 * Load hexagonal.config.js from the workspace root
 */
function loadHexagonalConfig() {
  // Resolve workspace root from this package location
  // __dirname = /path/to/workspace/packages/config-eslint
  // workspaceRoot = /path/to/workspace
  const workspaceRoot = path.resolve(__dirname, '../..');
  const configPath = path.join(workspaceRoot, 'hexagonal.config.js');

  if (fs.existsSync(configPath)) {
    return require(configPath);
  }

  throw new Error(
    `hexagonal.config.js not found at ${configPath}. Please create it in the workspace root.`
  );
}

/**
 * Create ESLint rule for package restrictions
 */
function createPackageRestrictionRule(config) {
  const { packageRestrictions = {}, errorMessages = {} } = config;

  return {
    'no-restricted-imports': [
      'error',
      {
        patterns: Object.entries(packageRestrictions).flatMap(([pkg, restrictions]) =>
          restrictions.map(restriction => ({
            group: [restriction],
            message: errorMessages.packageRestriction ||
              `Package ${pkg} cannot import from ${restriction}. Check hexagonal.config.js`,
          }))
        ),
      },
    ],
  };
}

/**
 * Create ESLint rule for composition root enforcement
 */
function createCompositionRootRule(config) {
  const { compositionRoots = [], errorMessages = {} } = config;

  return {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@repo/adapter-*'],
            message: errorMessages.compositionRoot ||
              'Adapters can only be imported in Composition Root (apps/*/src/di/**)',
          },
        ],
      },
    ],
  };
}

module.exports = {
  loadHexagonalConfig,
  createPackageRestrictionRule,
  createCompositionRootRule,
};
