/**
 * Messaging Module - Message-Based Architecture Infrastructure
 *
 * This module provides the core message buses for CQRS + Event Sourcing:
 * - commandBus: Dispatches commands (write operations)
 * - queryBus: Dispatches queries (read operations)
 * - eventBus: Publishes domain events
 *
 * These buses form the foundation of the message-driven architecture.
 */

import { HybridCommandBus, QueryBus, HybridEventBus } from "@dxbox/use-less-react/classes";

/**
 * Event Bus - Publishes domain events
 */
export const eventBus = new HybridEventBus({
  remotePublisher: {
    sendRemote: async () => void 0,
  },
});

/**
 * Command Bus - Dispatches commands to handlers
 */
export const commandBus = new HybridCommandBus({});

/**
 * Query Bus - Dispatches queries to handlers
 */
export const queryBus = new QueryBus({});
