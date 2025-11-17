/**
 * @typedef {Object} HexagonalConfig
 * @property {string[]} compositionRoots - Paths where adapters can be imported (DI containers)
 * @property {Record<string, string[]>} packageRestrictions - Import restrictions per package
 * @property {Object} errorMessages - Custom error messages for violations
 * @property {string} errorMessages.compositionRoot - Error message for composition root violations
 * @property {string} errorMessages.packageRestriction - Error message for package restriction violations
 */

/**
 * Hexagonal Architecture Configuration
 *
 * This configuration enforces architectural boundaries via ESLint.
 * Core mantra: "If it compiles, it's architecturally correct"
 *
 * @see https://github.com/fabfog/use-less-react
 * @type {HexagonalConfig}
 */
module.exports = {
  /**
   * Composition Root Pattern
   * Adapters can ONLY be imported in these paths (Dependency Injection containers)
   */
  compositionRoots: [
    'apps/*/src/di/**'
  ],

  /**
   * Package Import Restrictions
   * Defines which packages cannot import from which other packages
   */
  packageRestrictions: {
    // Domain: Pure business logic - cannot import anything except external libs
    '@repo/domain': [
      '@repo/adapter-*',  // ❌ Domain cannot depend on adapters
      '@repo/ports',      // ❌ Domain cannot depend on ports (stays pure)
      '@repo/ui',         // ❌ Domain cannot depend on UI
    ],

    // Ports: Interfaces/contracts - CAN import domain types to define contracts
    '@repo/ports': [
      '@repo/adapter-*',  // ❌ Ports cannot depend on adapters
      // Note: Ports CAN import @repo/domain (they define contracts using domain types/entities)
      '@repo/ui',         // ❌ Ports cannot depend on UI
    ],

    // Adapters: Concrete implementations - isolated from each other
    '@repo/adapter-*': [
      '@repo/adapter-*',  // ❌ No cross-adapter dependencies (isolation)
      '@repo/ui',         // ❌ Adapters cannot depend on UI
    ],

    // UI: React components - receives ViewModels via DI
    '@repo/ui': [
      '@repo/adapter-*',  // ❌ UI cannot import adapters (including ViewModels - use DI)
      '@repo/domain',     // ❌ UI receives ViewModels via props, not domain directly
    ],
  },

  /**
   * Custom error messages for better DX
   */
  errorMessages: {
    compositionRoot: 'Adapters can only be imported in Composition Root (apps/*/src/di/**). This enforces proper dependency injection.',
    packageRestriction: 'This import violates hexagonal architecture boundaries. Check hexagonal.config.js for allowed dependencies.',
  }
};
