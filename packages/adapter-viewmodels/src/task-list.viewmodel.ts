import {
  ReactiveStore,
  ReactiveValue,
  AutoDispose,
  ReactiveArray,
  EventSubscription,
} from "@dxbox/use-less-react/classes";
import type { HybridCommandBus, QueryBus, Disposable } from "@dxbox/use-less-react/classes";
import type { HybridEventBusInterface } from "@dxbox/use-less-react/classes";
import {
  CompleteTaskCommand,
  UncompleteTaskCommand,
  DeleteTaskCommand,
  ListTasksQuery,
  TaskCreatedEvent,
  type Task,
} from "@repo/domain";

/**
 * TaskListViewModel - Inbound Adapter for Task List UI
 *
 * This is an **inbound adapter** that manages the task list state and operations.
 *
 * Responsibilities:
 * - Manages the list of tasks (UI state)
 * - Handles user actions (complete, uncomplete, delete)
 * - Communicates with use-cases via command/query buses
 * - Notifies React components of state changes via ReactiveStore
 *
 * Architecture:
 * - Uses ReactiveStore for reactive updates
 * - Lives in @repo/adapter-viewmodels package (inbound adapter)
 * - Can be composed with other ViewModels (e.g., NewTaskFormViewModel)
 * - Consumed by React components via useDisposable + useReactiveStoreValues hooks
 */
@AutoDispose
export class TaskListViewModel implements Disposable {
  store = new ReactiveStore({
    tasks: new ReactiveArray<Task>([]),
    isLoading: new ReactiveValue(false),
    error: new ReactiveValue<string | null>(null),
  });

  private eventSubscriptions = new EventSubscription(() => {
    // Listen to TaskCreatedEvent to reload the task list
    // Note: registerLocalHandler is available on HybridEventBus but not on the interface
    // We need to cast to access it, or use a different approach
    const eventBusWithHandler = this.eventBus as {
      registerLocalHandler: (
        type: string,
        handler: (event: TaskCreatedEvent) => Promise<void>
      ) => () => void;
    };
    const unsubscribe = eventBusWithHandler.registerLocalHandler(
      TaskCreatedEvent.prototype.type,
      async () => {
        await this.loadTasks();
      }
    );
    return unsubscribe;
  });

  constructor(
    private readonly commandBus: HybridCommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: HybridEventBusInterface
  ) {}

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

  [Symbol.dispose](): void {
    // @AutoDispose automatically disposes all properties that implement Disposable
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

  async toggleTaskCompletion(id: string): Promise<void> {
    const task = this.tasks.find((t) => t.id === id);
    if (task?.completed) {
      await this.uncompleteTask(id);
    } else {
      await this.completeTask(id);
    }
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
