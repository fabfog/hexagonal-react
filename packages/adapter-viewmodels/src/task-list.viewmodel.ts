import { PubSub } from "@dxbox/use-less-react/classes";
import type { HybridCommandBus, QueryBus } from "@dxbox/use-less-react/classes";
import {
  CreateTaskCommand,
  CompleteTaskCommand,
  UncompleteTaskCommand,
  DeleteTaskCommand,
  ListTasksQuery,
  type Task,
} from "@repo/domain";

/**
 * TaskListViewModel - Inbound Adapter for Task List UI
 *
 * This is an **inbound adapter** that converts UI events into domain commands/queries.
 *
 * Responsibilities:
 * - Manages the list of tasks (UI state)
 * - Handles user actions (create, complete, delete)
 * - Communicates with use-cases via command/query buses
 * - Notifies React components of state changes via PubSub
 *
 * Architecture:
 * - Extends PubSub for reactive updates
 * - Lives in @repo/adapter-viewmodels package (inbound adapter)
 * - Instantiated in the app's DI container (apps/[app-name]/src/di/container.ts)
 * - Consumed by React components via useReactiveInstance hook
 */
export class TaskListViewModel extends PubSub {
  tasks: Task[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private readonly commandBus: HybridCommandBus,
    private readonly queryBus: QueryBus
  ) {
    super();
    this.makeReactiveProperties("tasks", "isLoading", "error");
  }

  // Actions
  async loadTasks(): Promise<void> {
    this.isLoading = true;

    await this.batchNotifications(async () => {
      try {
        const result = await this.queryBus.dispatch(new ListTasksQuery());
        this.tasks = result;
        this.error = null;
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Failed to load tasks";
      } finally {
        this.isLoading = false;
      }
    });
  }

  async createTask(title: string): Promise<void> {
    if (!title.trim()) {
      this.error = "Task title cannot be empty";
      return;
    }

    await this.batchNotifications(async () => {
      try {
        this.error = null;
        await this.commandBus.dispatch(new CreateTaskCommand({ title: title.trim() }));
        // Reload tasks to get the latest state
        await this.loadTasks();
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Failed to create task";
      }
    });
  }

  async completeTask(id: string): Promise<void> {
    await this.batchNotifications(async () => {
      try {
        this.error = null;
        await this.commandBus.dispatch(new CompleteTaskCommand({ taskId: id }));
        // Reload tasks to get the latest state
        await this.loadTasks();
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Failed to complete task";
      }
    });
  }

  async uncompleteTask(id: string): Promise<void> {
    await this.batchNotifications(async () => {
      try {
        this.error = null;
        await this.commandBus.dispatch(new UncompleteTaskCommand({ taskId: id }));
        // Reload tasks to get the latest state
        await this.loadTasks();
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Failed to uncomplete task";
      }
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.batchNotifications(async () => {
      try {
        this.error = null;
        await this.commandBus.dispatch(new DeleteTaskCommand({ taskId: id }));
        // Reload tasks to get the latest state
        await this.loadTasks();
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Failed to delete task";
      }
    });
  }

  clearError(): void {
    this.error = null;
  }
}
