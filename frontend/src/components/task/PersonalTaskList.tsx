import { Dispatch, FC, SetStateAction } from "react";
import { ITask } from "../../models/Task.interface";
import AddPersonalTask from "./AddPersonalTask";
import Task from "./Task";

interface PersonalTaskListProps {
  tasks: ITask[] | undefined,
  setTasks: Dispatch<SetStateAction<ITask[] | undefined>>
}
const PersonalTaskList: FC<PersonalTaskListProps> = ({ tasks, setTasks }) => {
  const addTask = (task: ITask) => {
    setTasks(prev => (
      [...prev ?? [], task]
    ))
  }
  const deleteTask = async (e: React.MouseEvent, taskId: number | undefined) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include"
      })
      setTasks(prev => (
        prev?.filter(task => task.taskId !== taskId)
      ))
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="flex flex-col p-6 w-full items-center justify-center">
      <div className="bg-gray-800 p-8 w-full max-w-2xl text-gray-800 rounded-lg max-w-2xl mb-6">
        <h2 className="text-2xl font-semibold text-center text-white mb-6"> Tasks </h2>
        {tasks?.length === 0 ?
          <p className="text-center text-white"> No task present. </p>
          :
          <ul className="space-y-4">
            {tasks?.map((task, index) => (
              <li key={index}
                className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <Task
                  task={task}
                  deleteTask={deleteTask}
                  isTeam={false}
                />
              </li>
            ))}
          </ul>
        }
      </div>
      <AddPersonalTask addTask={addTask} />
    </div>
  )
}

export default PersonalTaskList;
