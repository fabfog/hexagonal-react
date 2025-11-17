/**
 * Use Cases Layer - Application Logic
 *
 * This layer contains:
 * - Handlers (use case implementations)
 * - Application services
 * - Business logic orchestration
 *
 * Rules:
 * - Orchestrates Domain entities and Ports interfaces
 * - Depends on Domain + Ports
 * - NO dependencies on Adapters or UI
 * - Implements the "what to do" logic
 *
 * Organization:
 * - Each module (demo, user, product, etc.) has its own folder
 * - Handlers implement the business use cases
 */

// Demo module (Task Manager example - can be deleted)
export * from "./demo";
