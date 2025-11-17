import type { Task, CreateTaskData, UpdateTaskData } from "@repo/domain";

/**
 * Task Repository Port (Interface)
 *
 * Defines the contract for task persistence.
 * Implementations (adapters) must satisfy this interface.
 *
 * Note: Ports CAN import domain types/entities because they define
 * contracts using domain models. This maintains proper separation:
 * - Domain: defines business entities (Task, CreateTaskData, etc.)
 * - Ports: defines interfaces for external dependencies using those entities
 * - Adapters: implement the port interfaces
 */
export interface ITaskRepository {
  /**
   * Find task by ID
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Find all tasks, optionally filtered by completion status
   */
  findAll(filters?: { completed?: boolean }): Promise<Task[]>;

  /**
   * Create a new task
   */
  create(data: CreateTaskData): Promise<Task>;

  /**
   * Update an existing task
   */
  update(id: string, data: UpdateTaskData): Promise<Task | null>;

  /**
   * Mark a task as completed
   */
  complete(id: string): Promise<Task | null>;

  /**
   * Mark a task as uncompleted
   */
  uncomplete(id: string): Promise<Task | null>;

  /**
   * Delete a task
   */
  delete(id: string): Promise<boolean>;
}
