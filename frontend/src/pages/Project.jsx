import { useState } from "react";

export default function Team() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [teamTasks, setTeamTasks] = useState([]);

  const deleteTeamTask = (newTask) => {
    setTeamTasks((prev) => [...prev, newTask])
  }

  const addTeamTasks = (newTask) => {
    setPersonalTasks((prev) => [...prev, newTask])
  }

  return (
    <div>
      <h1> Team Tasks </h1>
      <TaskList tasks={tasks} deleteTask={deleteTeamTask} />
      <TaskForm username={username} addTask={addTeamTasks} />
    </div>
  )
}
