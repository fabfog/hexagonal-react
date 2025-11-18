import type {
  CommandHandlerInterface,
  HybridEventBusInterface,
} from "@dxbox/use-less-react/classes";
import { CreateTaskCommand, TaskCreatedEvent } from "@repo/domain";
import type { TaskRepositoryInterface } from "@repo/ports";

export class CreateTaskHandler implements CommandHandlerInterface<CreateTaskCommand> {
  constructor(
    private readonly taskRepository: TaskRepositoryInterface,
    private readonly eventBus: HybridEventBusInterface
  ) {}

  async handle(command: CreateTaskCommand): Promise<void> {
    const task = await this.taskRepository.create(command.payload);

    // Publish domain event
    await this.eventBus.publish(new TaskCreatedEvent({ task }));
  }
}
