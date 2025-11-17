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
 * Example:
 * ```typescript
 * // In @repo/ui
 * export function Alert({ severity, children, onClose }: AlertProps) {
 *   return <div className={severityStyles[severity]}>{children}</div>;
 * }
 *
 * // In app (container component)
 * import { Alert } from '@repo/ui';
 * import { taskListViewModel } from './di/container';
 *
 * function TaskListContainer() {
 *   const { state } = useReactiveInstance(taskListViewModel, ...);
 *   return (
 *     <>
 *       {state.error && <Alert severity="error">{state.error}</Alert>}
 *       <TasksList tasks={state.tasks} onComplete={...} />
 *     </>
 *   );
 * }
 * ```
 */

// Atomic Components
export * from "./alert";
export * from "./loading";
export * from "./create-task-form";
export * from "./tasks-list";
