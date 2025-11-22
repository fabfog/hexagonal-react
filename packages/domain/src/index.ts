/**
 * Domain Layer - Pure Business Logic
 *
 * This layer contains:
 * - Entities (business objects)
 * - Value Objects
 * - Domain Events
 * - Commands & Queries
 *
 * Rules:
 * - NO dependencies on adapters, ports, or UI
 * - Pure TypeScript/JavaScript
 * - Framework-agnostic
 * - Testable without mocks
 *
 * Organization:
 * - Each module (demo, user, product, etc.) has its own folder
 * - Modules are self-contained and can be easily removed
 */


export * from "./demo";
