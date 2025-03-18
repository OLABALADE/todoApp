import { useEffect, useState } from "react";
import { TaskList } from "../components/Task";
import { TaskForm } from "../components/Form";
import Sidebar from "../components/NavBar";

export default function Personal() {
  const [personalTasks, setPersonalTasks] = useState([]);
  const [message, setMessage] = useState("");
  const url = "http://localhost:3000/api/tasks"

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

  const deletePersonalTask = (id) => {
    const newTasks = personalTasks.filter(task => task.id !== id);
    setPersonalTasks(newTasks);
  }

  return (
    <div>
      <Sidebar />
      <h1> My tasks </h1>
      <TaskList tasks={personalTasks} deleteTask={deletePersonalTask} />
      <TaskForm url={url} taskType={"personal"} addTask={addPersonalTask} />
      <p> {message} </p>
    </div>
  )
}

