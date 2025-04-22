import React, { SetStateAction, useState } from "react";
import { ITask } from "../../models/Task.interface";
import AssignTask from "../team/AssignTask";
import Task from "./Task";

interface TeamTaskListProps {
  teamId: number;
  tasks: ITask[];
  role: string | undefined;
  setTasks: React.Dispatch<SetStateAction<ITask[]>>;
}
const TeamTaskList: React.FC<TeamTaskListProps> = ({
  tasks,
  role,
  teamId,
  setTasks,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const addTask = (task: ITask) => {
    setTasks((prev) => [...(prev ?? []), task]);
    setIsOpen(false);
  };

  const toggleTaskStatus = (taskId: number | undefined) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.taskId === taskId
          ? { ...task, status: task.status === "done" ? "pending" : "done" }
          : task,
      ),
    );
  };

  const deleteTask = async (
    e: React.MouseEvent,
    taskId: number | undefined,
  ) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/teams/${teamId}/tasks/${taskId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex flex-col p-6 w-full items-center justify-center">
      <h2 className="text-2xl font-semibold text-center  mb-6"> Tasks </h2>
      <div className="bg-gray-800 p-8 w-full max-w-2xl text-gray-800 rounded-lg max-w-2xl mb-6">
        {tasks.length === 0 ? (
          <p className="text-center text-white"> No task present. </p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task, index) => (
              <li
                key={index}
                className="flex space-x-5 bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <Task
                  task={task}
                  role={role}
                  toggleTaskStatus={toggleTaskStatus}
                  deleteTask={deleteTask}
                  isTeam={true}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      {role === "admin" &&
        (isOpen ? (
          <AssignTask teamId={teamId} addTask={addTask} />
        ) : (
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
          >
            +
          </div>
        ))}
    </div>
  );
};

export default TeamTaskList;
