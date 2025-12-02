import {
  ReactiveStore,
  ReactiveValue,
  DisposableClass,
  DisposableProperty,
  ReactiveArray,
} from "@dxbox/use-less-react/classes";
import type { HybridCommandBus, QueryBus, DisposableResource } from "@dxbox/use-less-react/classes";
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
 * - Notifies React components of state changes via ReactiveStore
 *
 * Architecture:
 * - Uses ReactiveStore for reactive updates
 * - Lives in @repo/adapter-viewmodels package (inbound adapter)
 * - Instantiated in the app's DI container (apps/[app-name]/src/di/container.ts)
 * - Consumed by React components via useDisposable + useReactiveStoreValues hooks
 */
@DisposableClass
export class TaskListViewModel implements DisposableResource {
  @DisposableProperty
  store!: ReactiveStore<{
    tasks: ReactiveArray<Task>;
    isLoading: ReactiveValue<boolean>;
    error: ReactiveValue<string | null>;
  }>;

  constructor(
    private readonly commandBus: HybridCommandBus,
    private readonly queryBus: QueryBus
  ) {
    this.store = new ReactiveStore({
      tasks: new ReactiveArray<Task>([]),
      isLoading: new ReactiveValue(false),
      error: new ReactiveValue<string | null>(null),
    });
  }

  // Getters for convenience
  get tasks(): Task[] {
    return this.store.values.tasks.get();
  }

  get isLoading(): boolean {
    return this.store.values.isLoading.get();
  }

  get error(): string | null {
    return this.store.values.error.get();
  }

  dispose(): void {
    // @DisposableClass automatically disposes @DisposableProperty fields
  }

  // Actions
  async loadTasks(): Promise<void> {
    this.store.values.isLoading.set(true);

    await this.store.batchNotifications(async ({ tasks, isLoading, error }) => {
      try {
        const result = await this.queryBus.dispatch(new ListTasksQuery());
        tasks.set(result);
        error.set(null);
      } catch (err) {
        error.set(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        isLoading.set(false);
      }
    });
  }

  async createTask(title: string): Promise<void> {
    if (!title.trim()) {
      this.store.values.error.set("Task title cannot be empty");
      return;
    }

    await this.store.batchNotifications(async ({ error }) => {
      try {
        error.set(null);
        await this.commandBus.dispatch(new CreateTaskCommand({ title: title.trim() }));
        // Reload tasks to get the latest state
        await this.loadTasks();
      } catch (err) {
        error.set(err instanceof Error ? err.message : "Failed to create task");
      }
    });
  }

  async completeTask(id: string): Promise<void> {
    await this.store.batchNotifications(async ({ error }) => {
      try {
        error.set(null);
        await this.commandBus.dispatch(new CompleteTaskCommand({ taskId: id }));
        // Reload tasks to get the latest state
        await this.loadTasks();
      } catch (err) {
        error.set(err instanceof Error ? err.message : "Failed to complete task");
      }
    });
  }

  async uncompleteTask(id: string): Promise<void> {
    await this.store.batchNotifications(async ({ error }) => {
      try {
        error.set(null);
        await this.commandBus.dispatch(new UncompleteTaskCommand({ taskId: id }));
        // Reload tasks to get the latest state
        await this.loadTasks();
      } catch (err) {
        error.set(err instanceof Error ? err.message : "Failed to uncomplete task");
      }
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.store.batchNotifications(async ({ error }) => {
      try {
        error.set(null);
        await this.commandBus.dispatch(new DeleteTaskCommand({ taskId: id }));
        // Reload tasks to get the latest state
        await this.loadTasks();
      } catch (err) {
        error.set(err instanceof Error ? err.message : "Failed to delete task");
      }
    });
  }

  clearError(): void {
    this.store.values.error.set(null);
  }
}
