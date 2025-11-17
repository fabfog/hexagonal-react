import { DomainEvent } from "@dxbox/use-less-react/classes";
import type { Task } from "./task.entity";

export interface TaskCreatedPayload {
  task: Task;
}

export class TaskCreatedEvent extends DomainEvent<"TaskCreated", TaskCreatedPayload> {
  get type(): "TaskCreated" {
    return "TaskCreated";
  }

  constructor(payload: TaskCreatedPayload) {
    super({
      payload,
    });
  }
}
