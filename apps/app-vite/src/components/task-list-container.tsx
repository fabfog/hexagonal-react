/**
 * TaskListContainer - Container Component
 *
 * This is a "smart" container component that:
 * - Imports and uses the concrete TaskListViewModel from @repo/adapter-viewmodels
 * - Subscribes to ViewModel state changes using useReactiveInstance
 * - Composes atomic UI components from @repo/ui
 * - Handles local UI state (form input)
 * - Lives in the app layer (can import adapters)
 *
 * This demonstrates the Container/Presentational Component pattern
 * combined with Hexagonal Architecture.
 */

import { useEffect, useState } from "react";
import { useReactiveInstance } from "@dxbox/use-less-react/client";
import {
  Alert,
  CreateTaskForm,
  LoadingSpinner,
  TasksList,
} from "@repo/ui";
import { taskListViewModel } from "../di/container";

export function TaskListContainer() {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Subscribe to ViewModel changes and extract state
  const {
    state: { error, isLoading, tasks },
  } = useReactiveInstance(
    taskListViewModel,
    (vm) => ({
      tasks: vm.tasks.map((t) => ({
        id: t.id,
        completed: t.completed,
        title: t.title,
      })),
      isLoading: vm.isLoading,
      error: vm.error,
    }),
    ["tasks", "isLoading", "error"]
  );

  // Load tasks when component mounts
  useEffect(() => {
    taskListViewModel.loadTasks();
  }, []);

  // Callbacks
  const handleCreateTask = () => {
    if (newTaskTitle.trim()) {
      taskListViewModel.createTask(newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  const handleCompleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task?.completed) {
      taskListViewModel.uncompleteTask(id);
    } else {
      taskListViewModel.completeTask(id);
    }
  };

  const handleDeleteTask = (id: string) => {
    taskListViewModel.deleteTask(id);
  };

  const handleClearError = () => {
    taskListViewModel.clearError();
  };

  // Render composition of atomic components
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Task Manager Demo</h2>

      {/* Error Alert */}
      {error && (
        <div className="mb-4">
          <Alert severity="error" onClose={handleClearError}>
            {error}
          </Alert>
        </div>
      )}

      {/* Create Task Form */}
      <div className="mb-6">
        <CreateTaskForm
          value={newTaskTitle}
          onChange={setNewTaskTitle}
          onSubmit={handleCreateTask}
          disabled={isLoading}
        />
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner message="Loading tasks..." />}

      {/* Empty State */}
      {!isLoading && tasks.length === 0 && (
        <Alert severity="info">
          No tasks yet. Create one to get started!
        </Alert>
      )}

      {/* Tasks List */}
      {!isLoading && tasks.length > 0 && (
        <>
          <TasksList
            tasks={tasks}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
          />

          {/* Task Count */}
          <div className="mt-4 text-sm text-gray-500 text-center">
            {tasks.filter((t) => !t.completed).length} of {tasks.length} tasks
            remaining
          </div>
        </>
      )}
    </div>
  );
}
