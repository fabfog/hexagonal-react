/**
 * Task Entity - Domain Model
 *
 * Pure business object representing a Task in the system.
 * No framework dependencies, just plain TypeScript.
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export type CreateTaskData = Pick<Task, "title" | "description">;
export type UpdateTaskData = Partial<Pick<Task, "title" | "description">>;
