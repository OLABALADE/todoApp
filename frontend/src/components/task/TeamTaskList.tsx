import React from "react";
import { Task } from "../../models/Task.interface";

const TeamTaskList: React.FC<{ tasks: Task[] | undefined }> = ({ tasks }) => {
  return (
    <div>
      <h2> Tasks </h2>
      {tasks?.length === 0 ?
        <p> No task present. </p>
        :
        <ul>
          {tasks?.map((task, index) => (
            <li key={index}>
              <div>
                <h3>{task.title}</h3>
                <p> {task.description}</p>
                <p> Status: {task.status}</p>
                <p> Status: {task.status}</p>
                <p> Priority: {task.priority}</p>
                <p> DueDate: {task.dueDate}</p>
              </div>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}

export default TeamTaskList;
