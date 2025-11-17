import { Command } from "@dxbox/use-less-react/classes";

export interface UncompleteTaskPayload {
  taskId: string;
}

export class UncompleteTaskCommand extends Command<"UncompleteTask", UncompleteTaskPayload> {
  get type(): "UncompleteTask" {
    return "UncompleteTask";
  }

  constructor(payload: UncompleteTaskPayload) {
    super({
      payload,
    });
  }
}
