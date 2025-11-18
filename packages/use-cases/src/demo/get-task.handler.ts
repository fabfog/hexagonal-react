import type { QueryHandlerInterface } from "@dxbox/use-less-react/classes";
import type { Task } from "@repo/domain";
import { GetTaskQuery } from "@repo/domain";
import type { TaskRepositoryInterface } from "@repo/ports";

export class GetTaskHandler implements QueryHandlerInterface<GetTaskQuery> {
  constructor(private readonly taskRepository: TaskRepositoryInterface) {}

  async handle(query: GetTaskQuery): Promise<Task | null> {
    return this.taskRepository.findById(query.payload.taskId);
  }
}
