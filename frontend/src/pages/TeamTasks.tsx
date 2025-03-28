import React, { useEffect, useState } from "react";
import { ITask } from "../models/Task.interface";
import TeamTaskList from "../components/task/TeamTaskList";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router";
import AssignTask from "../components/team/AssignTask";

const TeamTasks: React.FC = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState<ITask[]>();
  const [loading, setLoading] = useState(true);

  const addTask = (task: ITask) => {
    setTasks(prev => (
      [...prev, task]
    ))
  }
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams/${id}/tasks`, {
          credentials: "include",
        })
        const data: ITask[] = await response.json();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    fetchTasks();
  }, [])

  if (loading) {
    return <p> Loading... </p>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <TeamTaskList tasks={tasks} />
      <AssignTask teamId={Number(id)} addTask={addTask} />
    </div>
  )
}

export default TeamTasks;
