import type { ITaskRepository } from "@repo/ports";
import type { Task, CreateTaskData, UpdateTaskData } from "@repo/domain";

/**
 * In-Memory Task Repository
 *
 * Demo implementation of ITaskRepository using an in-memory Map.
 * Includes some seed data for demonstration purposes.
 */
export class InMemoryTaskRepository implements ITaskRepository {
  private tasks = new Map<string, Task>();
  private idCounter = 4; // Start after seed data

  constructor() {
    // Seed data for demo
    this.seedData();
  }

  private seedData() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const seedTasks: Task[] = [
      {
        id: "1",
        title: "Setup hexagonal architecture",
        description: "Create monorepo with Turborepo and hexagonal structure",
        completed: true,
        createdAt: yesterday,
        completedAt: yesterday,
      },
      {
        id: "2",
        title: "Implement CQRS pattern",
        description: "Add Commands, Queries, and Events with handlers",
        completed: true,
        createdAt: yesterday,
        completedAt: now,
      },
      {
        id: "3",
        title: "Build demo UI",
        description: "Create task list component to demonstrate the architecture",
        completed: false,
        createdAt: now,
      },
    ];

    seedTasks.forEach((task) => this.tasks.set(task.id, task));
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }

  async findAll(filters?: { completed?: boolean }): Promise<Task[]> {
    const allTasks = Array.from(this.tasks.values());

    if (filters?.completed !== undefined) {
      return allTasks.filter((task) => task.completed === filters.completed);
    }

    return allTasks;
  }

  async create(data: CreateTaskData): Promise<Task> {
    const task: Task = {
      id: String(this.idCounter++),
      title: data.title,
      description: data.description,
      completed: false,
      createdAt: new Date(),
    };

    this.tasks.set(task.id, task);
    return task;
  }

  async update(id: string, data: UpdateTaskData): Promise<Task | null> {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updated: Task = {
      ...task,
      ...data,
    };

    this.tasks.set(id, updated);
    return updated;
  }

  async complete(id: string): Promise<Task | null> {
    const task = this.tasks.get(id);
    if (!task) return null;

    const completed: Task = {
      ...task,
      completed: true,
      completedAt: new Date(),
    };

    this.tasks.set(id, completed);
    return completed;
  }

  async uncomplete(id: string): Promise<Task | null> {
    const task = this.tasks.get(id);
    if (!task) return null;

    const uncompleted: Task = {
      ...task,
      completed: false,
      completedAt: undefined,
    };

    this.tasks.set(id, uncompleted);
    return uncompleted;
  }

  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }
}
