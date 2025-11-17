/**
 * Adapters Layer - Demo Implementations
 *
 * This layer contains:
 * - In-memory Task Repository (with seed data)
 * - Demo implementations for testing
 *
 * Rules:
 * - Implements interfaces from @repo/ports
 * - NO dependencies on other adapters
 * - NO dependencies on UI
 * - Can be swapped with other adapters (e.g., @repo/adapter-prisma)
 *
 * Note: This adapter can ONLY be imported in the composition root (apps wildcard src/di wildcard)
 */

export { InMemoryTaskRepository } from "./repositories";
