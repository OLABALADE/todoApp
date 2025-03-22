import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TeamTaskForm } from "../components/Form";
import Sidebar from "../components/Sidebar";
import { TaskList } from "../components/Task";

export default function TeamTasks() {
  const { id } = useParams();
  const [teamTasks, setTeamTasks] = useState([]);

  const addTeamTask = (newTask) => {
    setTeamTasks((prev) => [...prev, newTask])
  }

  const deleteTeamTask = (id) => {
    const newTasks = personalTasks.filter(task => task.id !== id);
    setTeamTasks(newTasks);
  }

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams/${id}/tasks`, {
          credentials: "include",
        })

        const data = await response.json();
      } catch (err) {
        console.log(err);
      }
    }
    getTasks();
  })

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col justify-center items-center p-6 w-full">
        <TaskList tasks={teamTasks} deleteTask={deleteTeamTask} />
        <TeamTaskForm teamId={id} addTask={addTeamTask} />
      </div>
    </div>
  )
}
