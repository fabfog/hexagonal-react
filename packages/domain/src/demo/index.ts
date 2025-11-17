/**
 * Demo Module - Task Manager
 *
 * This is a complete example demonstrating hexagonal architecture with CQRS.
 * Feel free to delete this entire folder when starting your own project.
 *
 * To remove the demo:
 * 1. Delete packages/domain/src/demo/
 * 2. Delete packages/ports/src/demo/
 * 3. Delete packages/use-cases/src/demo/
 * 4. Delete packages/adapters-demo/
 * 5. Update apps DI containers
 */

export * from "./task.entity";
export * from "./create-task.command";
export * from "./complete-task.command";
export * from "./uncomplete-task.command";
export * from "./delete-task.command";
export * from "./get-task.query";
export * from "./list-tasks.query";
export * from "./task-created.event";
export * from "./task-completed.event";
export * from "./task-uncompleted.event";
export * from "./task-deleted.event";
