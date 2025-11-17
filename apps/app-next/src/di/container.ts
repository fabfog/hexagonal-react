/**
 * Composition Root - Dependency Injection Container
 *
 * This is the ONLY place where adapters can be imported.
 * This enforces the hexagonal architecture pattern.
 *
 * ESLint will prevent imports of @repo/adapter-* anywhere else in the app.
 */

import { HybridEventBus, HybridCommandBus, QueryBus } from "@dxbox/use-less-react/classes";
import { InMemoryTaskRepository } from "@repo/adapter-demo";
import { TaskListViewModel } from "@repo/adapter-viewmodels";
import {
  CreateTaskCommand,
  CompleteTaskCommand,
  UncompleteTaskCommand,
  DeleteTaskCommand,
  GetTaskQuery,
  ListTasksQuery,
  TaskCreatedEvent,
  TaskCompletedEvent,
  TaskUncompletedEvent,
  TaskDeletedEvent,
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
 * ViewModels
 */
export const taskListViewModel = new TaskListViewModel(commandBus, queryBus);

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

/**
 * Register Event Handlers (optional - for side effects)
 */
eventBus.registerLocalHandler("TaskCreated", async (event: TaskCreatedEvent) => {
  console.log("✅ Task created:", event.payload.task.title);
});

eventBus.registerLocalHandler("TaskCompleted", async (event: TaskCompletedEvent) => {
  console.log("✅ Task completed:", event.payload.taskId);
});

eventBus.registerLocalHandler("TaskUncompleted", async (event: TaskUncompletedEvent) => {
  console.log("↩️  Task uncompleted:", event.payload.taskId);
});

eventBus.registerLocalHandler("TaskDeleted", async (event: TaskDeletedEvent) => {
  console.log("🗑️  Task deleted:", event.payload.taskId);
});

/**
 * Container Export
 * Export all dependencies for use in the application
 */
export const container = {
  // Buses
  eventBus,
  commandBus,
  queryBus,

  // Repositories
  taskRepository,
};
