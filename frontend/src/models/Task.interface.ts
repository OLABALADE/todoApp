
export interface ITask {
  id?: number,
  title: string,
  description: string,
  status: "pending" | "inProgress" | "done",
  priority: "low" | "medium" | "high",
  type: "personal" | "team",
  dueDate: string,
  creator?: string,
  assignees?: string[],
  teamId: number,
  created?: Date,
}
