/**
 * TaskListContainer - Container Component
 *
 * This is a "smart" container component that:
 * - Composes multiple ViewModels (TaskListViewModel + NewTaskFormViewModel)
 * - Subscribes to ViewModel state changes using useDisposable + useReactiveStoreValues
 * - Composes atomic UI components from @repo/ui
 * - Connects ViewModel methods to UI components (no business logic)
 * - Lives in the app layer (can import adapters)
 *
 * This demonstrates:
 * - Container/Presentational Component pattern
 * - ViewModel composition (avoiding "god ViewModel")
 * - Hexagonal Architecture
 *
 * Note: All business logic and UI state management is in the ViewModels.
 * The container only connects ViewModels to UI components.
 */

import { useEffect } from "react";
import { useDisposable, useReactiveStoreValues } from "@dxbox/use-less-react/client";
import { Alert, CreateTaskForm, LoadingSpinner, TasksList } from "@repo/ui";
import { TaskListViewModel, NewTaskFormViewModel } from "@repo/adapter-viewmodels";
import { commandBus, queryBus, eventBus } from "@/di/messaging";

export function TaskListContainer() {
  // Create ViewModel instances (automatically disposed on unmount)
  const taskListViewModel = useDisposable(
    () => new TaskListViewModel(commandBus, queryBus, eventBus)
  );
  const newTaskFormViewModel = useDisposable(() => new NewTaskFormViewModel(commandBus));

  // Subscribe to TaskListViewModel store changes
  const { tasks, isLoading, error } = useReactiveStoreValues(
    taskListViewModel.store,
    ["tasks", "isLoading", "error"],
    ({ tasks, isLoading, error }) => ({
      tasks: tasks.get().map((t) => ({
        id: t.id,
        completed: t.completed,
        title: t.title,
      })),
      isLoading: isLoading.get(),
      error: error.get(),
    })
  );

  // Subscribe to NewTaskFormViewModel store changes
  const {
    newTaskTitle,
    isSubmitting: isFormSubmitting,
    error: formError,
  } = useReactiveStoreValues(newTaskFormViewModel.store, ["newTaskTitle", "isSubmitting", "error"]);

  // Load tasks when component mounts
  useEffect(() => {
    taskListViewModel.loadTasks();
  }, [taskListViewModel]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Task Manager Demo</h2>

      {/* Error Alert - Task List */}
      {error && (
        <div className="mb-4">
          <Alert severity="error" onClose={() => taskListViewModel.clearError()}>
            {error}
          </Alert>
        </div>
      )}

      {/* Error Alert - Form */}
      {formError && (
        <div className="mb-4">
          <Alert severity="error" onClose={() => newTaskFormViewModel.clearError()}>
            {formError}
          </Alert>
        </div>
      )}

      {/* Create Task Form */}
      <div className="mb-6">
        <CreateTaskForm
          value={newTaskTitle}
          onChange={(value) => newTaskFormViewModel.setNewTaskTitle(value)}
          onSubmit={() => newTaskFormViewModel.submitNewTask()}
          disabled={isLoading || isFormSubmitting}
        />
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner message="Loading tasks..." />}

      {/* Empty State */}
      {!isLoading && tasks.length === 0 && (
        <Alert severity="info">No tasks yet. Create one to get started!</Alert>
      )}

      {/* Tasks List */}
      {!isLoading && tasks.length > 0 && (
        <>
          <TasksList
            tasks={tasks}
            onComplete={(id) => taskListViewModel.toggleTaskCompletion(id)}
            onDelete={(id) => taskListViewModel.deleteTask(id)}
          />

          {/* Task Count */}
          <div className="mt-4 text-sm text-gray-500 text-center">
            {tasks.filter((t) => !t.completed).length} of {tasks.length} tasks remaining
          </div>
        </>
      )}
    </div>
  );
}
