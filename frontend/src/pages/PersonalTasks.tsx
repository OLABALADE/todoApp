import { useEffect, useState } from "react";
import { ITask } from "../models/Task.interface";
import PersonalTaskList from "../components/task/PersonalTaskList";

const PersonalTasks: React.FC = () => {
  const [personalTasks, setPersonalTasks] = useState<ITask[]>();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/tasks", {
          credentials: "include",
        })
        const data = await response.json();
        setPersonalTasks(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchTasks();
  }, [])

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center items-center p-6 w-full">
        <PersonalTaskList
          tasks={personalTasks}
          setTasks={setPersonalTasks}
        />
      </div>
    </div>
  )
}

export default PersonalTasks;
