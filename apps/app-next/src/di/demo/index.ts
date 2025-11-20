/**
 * Demo Module - Task Manager Demo Application
 *
 * This module wires up the task manager demo:
 * - Imports and instantiates repositories
 * - Creates command/query handlers with their dependencies
 * - Registers handlers with the messaging buses
 */

// Import buses from messaging module
import { commandBus, queryBus, eventBus } from "../messaging";

// Adapters (can ONLY be imported here)
import { InMemoryTaskRepository } from "@repo/adapter-demo";

// Domain (commands, queries, event payloads)
import {
  CreateTaskCommand,
  CompleteTaskCommand,
  UncompleteTaskCommand,
  DeleteTaskCommand,
  GetTaskQuery,
  ListTasksQuery,
} from "@repo/domain";

// Use Cases (handlers)
import {
  CreateTaskHandler,
  CompleteTaskHandler,
  UncompleteTaskHandler,
  DeleteTaskHandler,
  GetTaskHandler,
  ListTasksHandler,
} from "@repo/use-cases";

/**
 * Repositories
 */
const taskRepository = new InMemoryTaskRepository();

/**
 * Register Command Handlers
 */
commandBus.registerLocalHandler(
  CreateTaskCommand.prototype.type,
  new CreateTaskHandler(taskRepository, eventBus)
);
commandBus.registerLocalHandler(
  CompleteTaskCommand.prototype.type,
  new CompleteTaskHandler(taskRepository, eventBus)
);
commandBus.registerLocalHandler(
  UncompleteTaskCommand.prototype.type,
  new UncompleteTaskHandler(taskRepository, eventBus)
);
commandBus.registerLocalHandler(
  DeleteTaskCommand.prototype.type,
  new DeleteTaskHandler(taskRepository, eventBus)
);

/**
 * Register Query Handlers
 */
queryBus.registerHandler(GetTaskQuery.prototype.type, new GetTaskHandler(taskRepository));
queryBus.registerHandler(ListTasksQuery.prototype.type, new ListTasksHandler(taskRepository));
