import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { TeamTaskForm } from "../components/Form";
import TaskList from "../components/Task";
import { Task } from "../models/Task.interface";
import Sidebar from "../components/Sidebar";

const TeamTasks: React.FC = () => {
  let { id } = useParams();
  const teamId = Number(id);
  const [teamTasks, setTeamTasks] = useState<Task[]>([]);

  const addTeamTask = (newTask: Task) => {
    setTeamTasks((prev) => [...prev, newTask])
  }

  const deleteTeamTask = (id: number) => {
    const newTasks = teamTasks.filter(task => task.id !== id);
    setTeamTasks(newTasks);
  }

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams/${id}/tasks`, {
          credentials: "include",
        })
        const data: Task[] = await response.json();
        setTeamTasks(data);
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
        <TeamTaskForm teamId={teamId} addTask={addTeamTask} />
      </div>
    </div>
  )
}

export default TeamTasks;
