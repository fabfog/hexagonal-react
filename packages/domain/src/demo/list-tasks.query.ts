import { Query } from "@dxbox/use-less-react/classes";
import type { Task } from "./task.entity";

export interface ListTasksPayload {
  completed?: boolean;
}

export class ListTasksQuery extends Query<"ListTasks", ListTasksPayload, Task[]> {
  get type(): "ListTasks" {
    return "ListTasks";
  }

  constructor(payload: ListTasksPayload = {}) {
    super(payload);
  }
}
