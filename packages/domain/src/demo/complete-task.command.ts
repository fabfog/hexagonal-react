import { Command } from "@dxbox/use-less-react/classes";

export interface CompleteTaskPayload {
  taskId: string;
}

export class CompleteTaskCommand extends Command<"CompleteTask", CompleteTaskPayload> {
  get type(): "CompleteTask" {
    return "CompleteTask";
  }

  constructor(payload: CompleteTaskPayload) {
    super(payload);
  }
}
