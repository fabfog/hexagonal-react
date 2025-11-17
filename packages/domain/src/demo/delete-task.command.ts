import { Command } from "@dxbox/use-less-react/classes";

export interface DeleteTaskPayload {
  taskId: string;
}

export class DeleteTaskCommand extends Command<"DeleteTask", DeleteTaskPayload> {
  get type(): "DeleteTask" {
    return "DeleteTask";
  }

  constructor(payload: DeleteTaskPayload) {
    super({
      payload,
    });
  }
}
