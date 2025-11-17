import { DomainEvent } from "@dxbox/use-less-react/classes";

export interface TaskUncompletedPayload {
  taskId: string;
  uncompletedAt: Date;
}

export class TaskUncompletedEvent extends DomainEvent<"TaskUncompleted", TaskUncompletedPayload> {
  get type(): "TaskUncompleted" {
    return "TaskUncompleted";
  }

  constructor(payload: TaskUncompletedPayload) {
    super({
      payload,
    });
  }
}
