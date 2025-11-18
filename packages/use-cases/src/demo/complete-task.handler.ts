import type {
  CommandHandlerInterface,
  HybridEventBusInterface,
} from "@dxbox/use-less-react/classes";
import { CompleteTaskCommand, TaskCompletedEvent } from "@repo/domain";
import type { TaskRepositoryInterface } from "@repo/ports";

export class CompleteTaskHandler implements CommandHandlerInterface<CompleteTaskCommand> {
  constructor(
    private readonly taskRepository: TaskRepositoryInterface,
    private readonly eventBus: HybridEventBusInterface
  ) {}

  async handle(command: CompleteTaskCommand): Promise<void> {
    const task = await this.taskRepository.complete(command.payload.taskId);

    if (!task) {
      throw new Error(`Task not found: ${command.payload.taskId}`);
    }

    // Publish domain event
    await this.eventBus.publish(
      new TaskCompletedEvent({
        taskId: task.id,
        completedAt: task.completedAt!,
      })
    );
  }
}
