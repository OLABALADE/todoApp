import React, { SetStateAction } from "react";
import { ITask } from "../../models/Task.interface";
import AssignTask from "../team/AssignTask";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

interface TeamTaskListProps {
  teamId: number,
  tasks: ITask[],
  setTasks: React.Dispatch<SetStateAction<ITask[]>>
}
const TeamTaskList: React.FC<TeamTaskListProps> = ({ tasks, teamId, setTasks }) => {
  const addTask = (task: ITask) => {
    setTasks(prev => (
      [...prev ?? [], task]
    ))
  }
  const deleteTask = async (e: React.MouseEvent, taskId: number | undefined) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/teams/${teamId}/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include"
      })
      setTasks(prev => (
        prev.filter(task => task.id !== taskId)
      ))
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="flex flex-col p-6 w-full items-center justify-center">
      <div className="bg-gray-800 p-8 w-full max-w-2xl text-gray-800 rounded-lg max-w-2xl mb-6">
        <h2 className="text-2xl font-semibold text-center text-white mb-6"> Tasks </h2>
        {tasks.length === 0 ?
          <p className="text-center text-white"> No task present. </p>
          :
          <ul className="space-y-4">
            {tasks.map((task, index) => (
              <li key={index}
                className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-medium">Title: {task.title}</h3>
                  <p className="text-sm font-meduim">Description: {task.description}</p>
                  <p className="text-sm font-meduim"> Status: {task.status}</p>
                  <p className="text-sm font-meduim"> Priority: {task.priority}</p>
                  <p className="text-sm font-meduim"> DueDate: {task.dueDate}</p>
                  <p className="text-sm font-meduim"> Assignee: {task.assignee?.username}</p>
                  <div className="flex space-x-2">
                    <TrashIcon className="h-7 :hover bg-red"
                      onClick={e => deleteTask(e, task?.id)}
                    />
                    <Link
                      to={`/teams/${task.teamId}/tasks/${task.id}/edit`}
                    >
                      <PencilSquareIcon className="h-7" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        }
      </div>
      <AssignTask teamId={teamId} addTask={addTask} />
    </div >
  )
}

export default TeamTaskList;
