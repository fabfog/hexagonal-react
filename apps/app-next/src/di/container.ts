/**
 * Composition Root - Dependency Injection Container
 *
 * ESLint will prevent imports of @repo/adapter-* anywhere else in the app
 * except for @repo/adapter-viewmodels
 */

import { HybridEventBus, HybridCommandBus, QueryBus } from "@dxbox/use-less-react/classes";
import { InMemoryTaskRepository } from "@repo/adapter-demo";
import {
  CreateTaskCommand,
  CompleteTaskCommand,
  UncompleteTaskCommand,
  DeleteTaskCommand,
  GetTaskQuery,
  ListTasksQuery,
} from "@repo/domain";
import {
  CreateTaskHandler,
  CompleteTaskHandler,
  UncompleteTaskHandler,
  DeleteTaskHandler,
  GetTaskHandler,
  ListTasksHandler,
} from "@repo/use-cases";

/**
 * Buses (CQRS + Event Sourcing)
 */
export const eventBus = new HybridEventBus({
  remotePublisher: { sendRemote: async () => {} },
});

export const commandBus = new HybridCommandBus({});
export const queryBus = new QueryBus({});

/**
 * Repositories
 */
const taskRepository = new InMemoryTaskRepository();

/**
 * Handlers
 */
const createTaskHandler = new CreateTaskHandler(taskRepository, eventBus);
const completeTaskHandler = new CompleteTaskHandler(taskRepository, eventBus);
const uncompleteTaskHandler = new UncompleteTaskHandler(taskRepository, eventBus);
const deleteTaskHandler = new DeleteTaskHandler(taskRepository, eventBus);
const getTaskHandler = new GetTaskHandler(taskRepository);
const listTasksHandler = new ListTasksHandler(taskRepository);

/**
 * Register Command Handlers
 */
commandBus.registerLocalHandler(CreateTaskCommand.prototype.type, createTaskHandler);
commandBus.registerLocalHandler(CompleteTaskCommand.prototype.type, completeTaskHandler);
commandBus.registerLocalHandler(UncompleteTaskCommand.prototype.type, uncompleteTaskHandler);
commandBus.registerLocalHandler(DeleteTaskCommand.prototype.type, deleteTaskHandler);

/**
 * Register Query Handlers
 */
queryBus.registerHandler(GetTaskQuery.prototype.type, getTaskHandler);
queryBus.registerHandler(ListTasksQuery.prototype.type, listTasksHandler);
