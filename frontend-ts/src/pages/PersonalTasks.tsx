import { useEffect, useState } from "react";
import { TaskList } from "../components/Task";
import { PersonalTaskForm } from "../components/Form";
import Sidebar from "../components/Sidebar";

const PersonalTasks: React.FC = () => {
  const [personalTasks, setPersonalTasks] = useState([]);
  const [message, setMessage] = useState("");

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
        setMessage("Something went wrong while fetching tasks");
      }
    }
    fetchTasks();
  }, [])

  const addPersonalTask = (newTask) => {
    setPersonalTasks((prev) => [...prev, newTask])
  }

  const deletePersonalTask = (id: number) => {
    const newTasks = personalTasks.filter(task => task.id !== id);
    setPersonalTasks(newTasks);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col justify-center items-center p-6 w-full">
        <TaskList tasks={personalTasks} deleteTask={deletePersonalTask} />
        <PersonalTaskForm addTask={addPersonalTask} />
        <p> {message} </p>
      </div>
    </div>
  )
}

export default PersonalTasks;
