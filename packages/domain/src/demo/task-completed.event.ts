import { DomainEvent } from "@dxbox/use-less-react/classes";

export interface TaskCompletedPayload {
  taskId: string;
  completedAt: Date;
}

export class TaskCompletedEvent extends DomainEvent<"TaskCompleted", TaskCompletedPayload> {
  get type(): "TaskCompleted" {
    return "TaskCompleted";
  }

  constructor(payload: TaskCompletedPayload) {
    super({
      payload,
    });
  }
}
