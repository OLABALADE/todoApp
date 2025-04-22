import { Dispatch, FC, SetStateAction, useState } from "react";
import { ITask } from "../../models/Task.interface";
import AddPersonalTask from "./AddPersonalTask";
import Task from "./Task";

interface PersonalTaskListProps {
  tasks: ITask[] | undefined;
  setTasks: Dispatch<SetStateAction<ITask[] | undefined>>;
}
const PersonalTaskList: FC<PersonalTaskListProps> = ({ tasks, setTasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const addTask = (task: ITask) => {
    setTasks((prev) => [...(prev ?? []), task]);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col p-6 w-full items-center justify-center">
      <h2 className="text-2xl font-semibold text-center  mb-6"> Tasks </h2>
      <div className="bg-gray-800 p-8 w-full max-w-2xl text-gray-800 rounded-lg max-w-2xl mb-6">
        {tasks?.length === 0 ? (
          <p className="text-center text-white"> No task present. </p>
        ) : (
          <ul className="space-y-4">
            {tasks?.map((task, index) => (
              <li
                key={index}
                className="flex space-x-5 bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <Task task={task} setTasks={setTasks} isTeam={false} />
              </li>
            ))}
          </ul>
        )}
      </div>
      {isOpen ? (
        <AddPersonalTask addTask={addTask} />
      ) : (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
        >
          +
        </div>
      )}
    </div>
  );
};

export default PersonalTaskList;
