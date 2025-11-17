import type { QueryHandlerInterface } from "@dxbox/use-less-react/classes";
import type { ITaskRepository } from "@repo/ports";
import type { Task } from "@repo/domain";
import { ListTasksQuery } from "@repo/domain";

export class ListTasksHandler implements QueryHandlerInterface<ListTasksQuery> {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async handle(query: ListTasksQuery): Promise<Task[]> {
    return this.taskRepository.findAll({
      completed: query.payload.completed,
    });
  }
}
