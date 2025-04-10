import { User } from "./User.interface";

export interface ITask {
  taskId?: number,
  title: string,
  description: string,
  status: "pending" | "inProgress" | "done",
  priority: "low" | "medium" | "high",
  taskType: "personal" | "team",
  dueDate: string,
  creator?: string,
  assignee?: User,
  teamId?: number | string,
  created?: Date,
}

export interface ITaskOut {
  taskId?: number,
  title?: string,
  description?: string,
  status?: "pending" | "inProgress" | "done",
  priority?: "low" | "medium" | "high",
  taskType?: "personal" | "team",
  dueDate?: string,
  creator?: string,
  assigneeId?: number,
  teamId?: number | string,
  created?: Date,
}
