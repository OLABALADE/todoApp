import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../components/Auth";
import { ITask } from "../../models/Task.interface";
import EditTeamTask from "../../components/team/EditTeamTask";

const TeamTaskEdit: FC = () => {
  const { teamId, taskId } = useParams();
  const auth = useContext(AuthContext);
  const [task, setTask] = useState<ITask>({})

  useEffect(() => {
    const fetchTask = async () => {
      const url = `http://localhost:3000/api/teams/${teamId}/tasks/${taskId}`
      try {
        const response = await fetch(url, {
          credentials: "include"
        })

        if (response.status === 401) auth?.onFailure();

        const data: ITask = await response.json();
        setTask(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchTask();
  }, [])
  return (
    <EditTeamTask teamId={Number(teamId)} task={task} setTask={setTask} />
  )
}

export default TeamTaskEdit;
