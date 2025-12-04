import { ReactiveStore, ReactiveValue, AutoDispose } from "@dxbox/use-less-react/classes";
import type { HybridCommandBus, Disposable } from "@dxbox/use-less-react/classes";
import { CreateTaskCommand } from "@repo/domain";

/**
 * NewTaskFormViewModel - Inbound Adapter for New Task Form UI
 *
 * This is an **inbound adapter** that manages the state and logic for creating a new task.
 *
 * Responsibilities:
 * - Manages form state (newTaskTitle)
 * - Handles form submission and validation
 * - Communicates with use-cases via command bus
 * - Notifies React components of state changes via ReactiveStore
 *
 * Architecture:
 * - Uses ReactiveStore for reactive updates
 * - Lives in @repo/adapter-viewmodels package (inbound adapter)
 * - Can be composed with other ViewModels (e.g., TaskListViewModel)
 * - Consumed by React components via useDisposable + useReactiveStoreValues hooks
 */
@AutoDispose
export class NewTaskFormViewModel implements Disposable {
  store = new ReactiveStore({
    newTaskTitle: new ReactiveValue(""),
    isSubmitting: new ReactiveValue(false),
    error: new ReactiveValue<string | null>(null),
  });

  constructor(private readonly commandBus: HybridCommandBus) {}

  // Getters for convenience
  get newTaskTitle(): string {
    return this.store.values.newTaskTitle.get();
  }

  get isSubmitting(): boolean {
    return this.store.values.isSubmitting.get();
  }

  get error(): string | null {
    return this.store.values.error.get();
  }

  [Symbol.dispose](): void {
    // @AutoDispose automatically disposes all properties that implement Disposable
  }

  setNewTaskTitle(title: string): void {
    this.store.values.newTaskTitle.set(title);
  }

  async submitNewTask(): Promise<void> {
    const title = this.store.values.newTaskTitle.get().trim();
    if (!title) {
      this.store.values.error.set("Task title cannot be empty");
      return;
    }

    this.store.values.isSubmitting.set(true);
    await this.store.batchNotifications(async ({ error, newTaskTitle, isSubmitting }) => {
      try {
        error.set(null);
        await this.commandBus.dispatch(new CreateTaskCommand({ title }));
        // Reset form
        newTaskTitle.set("");
        // TaskCreatedEvent will be published by CreateTaskHandler via eventBus
        // Other ViewModels (e.g., TaskListViewModel) can listen to this event
      } catch (err) {
        error.set(err instanceof Error ? err.message : "Failed to create task");
      } finally {
        isSubmitting.set(false);
      }
    });
  }

  clearError(): void {
    this.store.values.error.set(null);
  }
}
