import { Command } from "@dxbox/use-less-react/classes";
import type { CreateTaskData } from "./task.entity";

export type CreateTaskPayload = CreateTaskData;

export class CreateTaskCommand extends Command<"CreateTask", CreateTaskPayload> {
  get type(): "CreateTask" {
    return "CreateTask";
  }

  constructor(payload: CreateTaskPayload) {
    super({
      payload,
    });
  }
}
