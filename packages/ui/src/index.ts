/**
 * UI Layer - Pure Presentational Components
 *
 * This layer contains:
 * - Atomic, reusable React components
 * - Pure presentational - no business logic
 * - Receive data and callbacks via props
 *
 * Architecture Rules:
 * - ✅ Completely "dumb" - only props in, render out
 * - ❌ CANNOT import from @repo/adapter-* (ViewModels live in app layer)
 * - ❌ CANNOT import from @repo/use-cases
 * - ❌ CANNOT import from @repo/domain (except for shared types if needed)
 * - ✅ Define their own prop interfaces
 * - ✅ Composable in container components (app layer)
 *
 */

// Atomic Components
export * from "./alert";
export * from "./loading";
export * from "./create-task-form";
export * from "./tasks-list";
