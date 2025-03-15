import { useEffect, useState } from "react";
import { TaskList } from "../components/Task";
import { TaskForm } from "../components/Form";
import NavBar from "../components/NavBar";

export default function Personal() {
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

  const deletePersonalTask = (id) => {
    const newTasks = personalTasks.filter(task => task.id !== id);
    setPersonalTasks(newTasks);
  }

  return (
    <div>
      <NavBar />
      <h1> My tasks </h1>
      <TaskList tasks={personalTasks} deleteTask={deletePersonalTask} />
      <TaskForm taskType={"personal"} addTask={addPersonalTask} />
      <p> {message} </p>
    </div>
  )
}

