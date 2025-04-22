import { Dispatch, FC, SetStateAction, useState } from "react";
import { ITask } from "../../models/Task.interface";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface TaskProps {
  task: ITask;
  role?: string | undefined;
  setTasks: Dispatch<SetStateAction<ITask[] | undefined>>;
  isTeam: boolean;
}

const Task: FC<TaskProps> = ({ task, role, isTeam, setTasks }) => {
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const daysLeft = Math.ceil(
    (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const isUrgent = daysLeft <= 2;
  const [open, setOpen] = useState(false);
  let editTaskUrl = isTeam
    ? `/teams/${task.teamId}/tasks/${task.taskId}/edit`
    : `/personal/tasks/${task?.taskId}/edit`;

  const formatDate = (rawDate: string) => {
    const date = new Date(rawDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const deleteTask = async (
    e: React.MouseEvent,
    taskId: number | undefined,
  ) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      setTasks((prev) => prev?.filter((task) => task.taskId !== taskId));
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();
    const stat = task.status === "done" ? "pending" : "done";
    let toggleStatusUrl = isTeam
      ? `http://localhost:3000/api/teams/${task.teamId}/tasks/${task.taskId}`
      : `http://localhost:3000/api/tasks/${task?.taskId}`;
    try {
      const response = await fetch(toggleStatusUrl, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          taskId: task.taskId,
          description: task.description,
          taskType: task.taskType,
          status: stat,
          priority: task.priority,
          dueDate: task.dueDate,
        }),
      });

      const data: ITask = await response.json();
      setTasks((prev) =>
        prev?.map((ptask) => (ptask.taskId === task.taskId ? data : ptask)),
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-full">
      <div className="flex space-x-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-lg font-medium">Title: {task.title}</span>
          <span className="text-sm text-gray-500">{open ? "▲" : "▼"}</span>
        </button>
        <CheckCircleIcon
          onClick={handleClick}
          className={`h-7 rounded-full ${task.status === "done" ? "text-green-500" : ""}`}
        />
        {isUrgent && <ExclamationCircleIcon className="h-7 text-red-500" />}
      </div>
      {open && (
        <div>
          <p className="text-sm font-meduim">Description: {task.description}</p>
          <p className="text-sm font-meduim"> Status: {task.status}</p>
          <p className="text-sm font-meduim"> Priority: {task.priority}</p>
          <p className="text-sm font-meduim">
            {" "}
            DueDate: {formatDate(task.dueDate)}
          </p>
          {isTeam && (
            <p className="text-sm font-meduim">
              {" "}
              Assignee: {task.assignee?.username}
            </p>
          )}
          {(role === "admin" || !isTeam) && (
            <div className="flex space-x-2">
              <TrashIcon
                className="h-7 hover:text-red-500 rounded-lg"
                onClick={(e) => deleteTask(e, task?.taskId)}
              />
              <Link to={editTaskUrl}>
                <PencilSquareIcon className="h-7 rounded-lg hover:text-yellow-500" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Task;
