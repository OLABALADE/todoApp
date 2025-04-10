import { FC, useContext, useEffect, useState } from "react";
import { ITask } from "../../models/Task.interface";
import { useParams } from "react-router";
import { AuthContext } from "../../components/Auth";
import EditPersonalTask from "../../components/task/EditPersonalTask";

const PersonalTaskEdit: FC = () => {
  const { taskId } = useParams();
  const auth = useContext(AuthContext);
  const [task, setTask] = useState<ITask>({})

  useEffect(() => {
    const fetchTask = async () => {
      const url = `http://localhost:3000/api/tasks/${taskId}`
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
    <EditPersonalTask task={task} setTask={setTask} />
  )
}

export default PersonalTaskEdit;
