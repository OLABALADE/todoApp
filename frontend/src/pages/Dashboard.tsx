import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../components/Auth";
import { ITask } from "../models/Task.interface";

const Dashboard: React.FC = () => {
  const [recentTasks, setRecentTasks] = useState<ITask[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<ITask[]>([]);
  const auth = useContext(AuthContext);
  const formatDate = (rawDate: string) => {
    const date = new Date(rawDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/verify-token",
        );
        if (response.status === 401) auth?.onFailure();
      } catch (err) {
        console.log(err);
      }
    };

    const fetchRecentTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/tasks/recent-tasks",
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.status === 401) auth?.onFailure();
        const data = await response.json();
        setRecentTasks(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUrgentTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/tasks/urgent-tasks",
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.status === 401) auth?.onFailure();
        const data = await response.json();
        setUrgentTasks(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAuthStatus();
    fetchRecentTasks();
    fetchUrgentTasks();
  }, []);

  return (
    <div>
      <h1 className="font-bold text-center text-xl mb-2 text-blue-500">
        My Dashboard
      </h1>

      {/*Recent Tasks*/}
      <div className="mb-3">
        <h2 className="font-semibold text-blue-400 text-center mb-2">
          Recent Tasks
        </h2>
        <div className="flex flex-col space-y-3 items-center">
          {recentTasks === null ? (
            <h3 className="font-semibold text-gray-500">No Recent Tasks</h3>
          ) : (
            recentTasks.map((task, index) => (
              <div
                className="bg-white text-gray-900 ring cursor-pointer ring-gray-500 w-[30%] px-3 py-3 rounded-lg shadow-lg"
                key={index}
              >
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm">{task.status}</p>
                <p className="text-sm">
                  <span className="font-semibold">Team</span>: {task.teamName}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Duedate</span>:{" "}
                  {formatDate(task.dueDate)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Urgent Tasks */}
      <div className="mb-3">
        <h2 className="font-semibold text-blue-400 text-center mb-2">
          Urgent Tasks
        </h2>
        <div className="flex flex-col space-y-3 items-center">
          {urgentTasks === null ? (
            <h3 className="font-semibold text-gray-500">No Urgent Tasks </h3>
          ) : (
            urgentTasks.map((task, index) => (
              <div
                className="bg-white text-gray-900 ring ring-red-500 cursor-pointer ring-gray-500 w-[50%] px-3 py-3 rounded-lg shadow-lg"
                key={index}
              >
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm">{task.status}</p>
                <p className="text-sm">
                  <span className="font-semibold">Team</span>: {task.teamName}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Duedate</span>:{" "}
                  {formatDate(task.dueDate)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
