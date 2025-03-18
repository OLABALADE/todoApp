import { useEffect, useState } from "react";
import Task from "../components/Task";
import { TaskForm } from "../components/Form";

export default function Project() {
  const [tasks, setTasks] = useState([]);

  const addTasks = (newTask) => {
    setTasks(prev => [...prev, newTask])
  }

  const deleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/projects/${id}/tasks`, {
          credentials: "include"
        })
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchTasks();
  })

  return (
    <div>
      <h1> Project Tasks </h1>
      {
        tasks.map((task, index) => {
          <Task
            key={index}
            id={task.id}
            title={task.title}
            desc={task.description}
            priority={task.priority}
            status={task.status}
            dueDate={task.dueDate}
            teamId={task.teamId}
            projectId={task.projectId}
            creator={task.creator}
          />
        })
      }
      <TaskForm
        addTask={addTask}
      />
    </div>
  )
}
