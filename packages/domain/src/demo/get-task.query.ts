import { Query } from "@dxbox/use-less-react/classes";
import type { Task } from "./task.entity";

export interface GetTaskPayload {
  taskId: string;
}

export class GetTaskQuery extends Query<"GetTask", GetTaskPayload, Task | null> {
  get type(): "GetTask" {
    return "GetTask";
  }

  constructor(payload: GetTaskPayload) {
    super(payload, crypto.randomUUID());
  }
}
