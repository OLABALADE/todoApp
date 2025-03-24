
export interface Task {
  id: number,
  title: string,
  description: string,
  status: "pending" | "inProgress" | "done",
  priority: "low" | "medium" | "high",
  type: "personal" | "team",
  dueDate: string,
  creator: string,
  teamId: number,
  created: Date,
}
