import type {
  CommandHandlerInterface,
  HybridEventBusInterface,
} from "@dxbox/use-less-react/classes";
import { DeleteTaskCommand, TaskDeletedEvent } from "@repo/domain";
import type { ITaskRepository } from "@repo/ports";

export class DeleteTaskHandler implements CommandHandlerInterface<DeleteTaskCommand> {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly eventBus: HybridEventBusInterface
  ) {}

  async handle(command: DeleteTaskCommand): Promise<void> {
    const deleted = await this.taskRepository.delete(command.payload.taskId);

    if (!deleted) {
      throw new Error(`Task not found: ${command.payload.taskId}`);
    }

    // Publish domain event
    await this.eventBus.publish(new TaskDeletedEvent({ taskId: command.payload.taskId }));
  }
}
