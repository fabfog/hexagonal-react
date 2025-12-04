/**
 * ViewModels Adapter (Inbound Adapter)
 *
 * In hexagonal architecture, there are two types of adapters:
 * - **Outbound adapters**: From domain TO external world (e.g., database, API)
 * - **Inbound adapters**: From external world TO domain (e.g., UI, CLI, API controllers)
 *
 * ViewModels are **inbound adapters** that:
 * 1. Receive user interactions from UI components
 * 2. Convert them into domain commands/queries
 * 3. Dispatch them via command/query buses
 * 4. Manage UI state and notify components of changes
 *
 * Architecture rules:
 * - ✅ Can be imported ONLY in composition roots (apps/[*]/src/di/container.ts)
 * - ✅ Depend on domain (for commands/queries) and buses (for dispatching)
 * - ✅ Are consumed by UI components (not the other way around)
 * - ❌ Cannot import other adapters
 * - ❌ Cannot be imported directly in UI components (must go through DI)
 *
 */

export * from "./task-list.viewmodel";
export * from "./new-task-form.viewmodel";
