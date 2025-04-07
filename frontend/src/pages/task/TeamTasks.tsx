import React, { useContext, useEffect, useState } from "react";
import { ITask } from "../../models/Task.interface";
import TeamTaskList from "../../components/task/TeamTaskList";
import { useParams } from "react-router";
import { AuthContext } from "../../components/Auth";

const TeamTasks: React.FC = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams/${id}/tasks`, {
          credentials: "include",
        })
        if (response.status === 401) {
          auth?.onFailure();
        }
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
    <TeamTaskList
      teamId={Number(id)}
      tasks={tasks}
      setTasks={setTasks}
    />
  )
}

export default TeamTasks;
