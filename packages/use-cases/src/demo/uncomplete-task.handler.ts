import type {
  CommandHandlerInterface,
  HybridEventBusInterface,
} from "@dxbox/use-less-react/classes";
import { UncompleteTaskCommand, TaskUncompletedEvent } from "@repo/domain";
import type { TaskRepositoryInterface } from "@repo/ports";

export class UncompleteTaskHandler implements CommandHandlerInterface<UncompleteTaskCommand> {
  constructor(
    private readonly taskRepository: TaskRepositoryInterface,
    private readonly eventBus: HybridEventBusInterface
  ) {}

  async handle(command: UncompleteTaskCommand): Promise<void> {
    const task = await this.taskRepository.uncomplete(command.payload.taskId);

    if (!task) {
      throw new Error(`Task not found: ${command.payload.taskId}`);
    }

    // Publish domain event
    await this.eventBus.publish(
      new TaskUncompletedEvent({
        taskId: task.id,
        uncompletedAt: new Date(),
      })
    );
  }
}
