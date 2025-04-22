import React, { useEffect, useState } from "react";
import { ITask } from "../../models/Task.interface";
import TeamTaskList from "../../components/task/TeamTaskList";
import { useParams } from "react-router";
import { useAuth } from "../../components/Auth";

const TeamTasks: React.FC = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | undefined>();
  const { getTeamRole, onFailure } = useAuth();


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams/${id}/tasks`, {
          credentials: "include",
        })
        if (response.status === 401) {
          onFailure();
        }
        const data: ITask[] = await response.json();
        setTasks(data);
        const res = await getTeamRole(id);
        setRole(res)
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
    <TeamTaskList
      role={role}
      teamId={Number(id)}
      tasks={tasks}
      setTasks={setTasks}
    />
  )
}

export default TeamTasks;
