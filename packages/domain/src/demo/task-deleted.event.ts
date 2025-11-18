import { DomainEvent } from "@dxbox/use-less-react/classes";

export interface TaskDeletedPayload {
  taskId: string;
}

export class TaskDeletedEvent extends DomainEvent<"TaskDeleted", TaskDeletedPayload> {
  get type(): "TaskDeleted" {
    return "TaskDeleted";
  }

  constructor(payload: TaskDeletedPayload) {
    super(payload);
  }
}
