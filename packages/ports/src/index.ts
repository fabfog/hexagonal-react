/**
 * Ports Layer - Interfaces & Contracts
 *
 * This layer contains:
 * - Repository interfaces
 * - Service interfaces
 * - Gateway interfaces
 *
 * Rules:
 * - ONLY interfaces and types
 * - Can import types from Domain (for method signatures)
 * - NO implementations
 * - NO dependencies on Use-cases, Adapters, or UI
 *
 * Organization:
 * - Each module (demo, user, product, etc.) has its own folder
 * - Modules mirror the domain structure
 */


export * from "./demo";
