import type { Task } from "../db/schema";

export type WebSocketMessage =
  | { type: "TASK_CREATED"; task: Task }
  | { type: "TASK_UPDATED"; task: Task }
  | { type: "TASK_DELETED"; taskId: number }
  | { type: "TASKS_REORDERED"; tasks: Task[] };