export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  position: number;
  createdAt: string | Date;
}

export type WebSocketMessage =
  | { type: "TASK_CREATED"; task: Task }
  | { type: "TASK_UPDATED"; task: Task }
  | { type: "TASK_DELETED"; taskId: number }
  | { type: "TASKS_REORDERED"; tasks: Task[] };