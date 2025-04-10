import { FC, useState } from "react";
import { ITask } from "../../models/Task.interface";
import { Link } from "react-router";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface TaskProps {
  task: ITask,
  deleteTask: (e: MouseEvent, taskId: number | undefined) => void,
  isTeam: boolean
}

const Task: FC<TaskProps> = ({ task, deleteTask, isTeam }) => {
  const [open, setOpen] = useState(false);
  let editTaskUrl = isTeam ? `/teams/${task.teamId}/tasks/${task.taskId}/edit` : `/personal/tasks/${task?.taskId}/edit`
  const formatDate = (rawDate: string) => {
    const date = new Date(rawDate)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <span className="text-lg font-medium">Title: {task.title}</span>
        <span className="text-sm text-gray-500">{open ? "▲" : "▼"}</span>
      </button>
      {open &&
        <div>
          <p className="text-sm font-meduim">Description: {task.description}</p>
          <p className="text-sm font-meduim"> Status: {task.status}</p>
          <p className="text-sm font-meduim"> Priority: {task.priority}</p>
          <p className="text-sm font-meduim"> DueDate: {formatDate(task.dueDate)}</p>
          {isTeam &&
            <p className="text-sm font-meduim"> Assignee: {task.assignee?.username}</p>
          }
          <div className="flex space-x-2">
            <TrashIcon className="h-7 :hover bg-red"
              onClick={e => deleteTask(e, task?.taskId)}
            />
            <Link
              to={editTaskUrl}
            >
              <PencilSquareIcon className="h-7" />
            </Link>
          </div>
        </div>

      }
    </div>
  )
}

export default Task;
