import React, { useEffect, useState } from "react";
import { User } from "../../models/User.interface";
import { ITask, ITaskOut } from "../../models/Task.interface";

interface AssignTaskProps {
  teamId: number,
  addTask: (task: ITask) => void,
}

const AssignTask: React.FC<AssignTaskProps> = ({ teamId, addTask }) => {
  const [members, setMembers] = useState<User[]>([])
  const [task, setTask] = useState<ITaskOut>({
    title: "",
    description: "",
    status: "pending",
    priority: "low",
    taskType: "team",
    dueDate: "",
    teamId: teamId,
    assigneeId: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/teams/${teamId}/tasks`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(task)
      })

      const data: ITask = await response.json();
      addTask(data);
      setTask({
        title: "",
        description: "",
        status: "pending",
        priority: "low",
        taskType: "team",
        dueDate: "",
        teamId: teamId,
        assigneeId: 0,
      })
    } catch (err) {
      console.log(err);
    }
  }

  const handleUserSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const memeberId = Number(e.target.value);
    setTask((prev) => ({
      ...prev,
      assigneeId: memeberId
    }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams/${teamId}/members`, {
          credentials: "include",
        })
        const data: User[] = await response.json();
        setMembers(data);
        setTask(prev => (
          {
            ...prev,
            assigneeId: data[0].userId
          }
        ))
      } catch (err) {
        console.log(err);
      }
    }
    fetchMembers();
  }, [])

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Assign Task</h2>

      <form onSubmit={handleSubmit}>
        {/* Task Title */}
        <div className="mb-4">
          <label htmlFor="taskTitle" className="block text-gray-700 font-semibold mb-2">
            Task Title:
          </label>
          <input
            type="text"
            id="taskTitle"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
            required
          />
        </div>

        {/* Task Description */}
        <div className="mb-4">
          <label htmlFor="taskDescription" className="block text-gray-700 font-semibold mb-2">
            Task Description:
          </label>
          <textarea
            id="taskDescription"
            name="description"
            value={task.description}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        {/* Task Priority */}
        <div className="mb-4">
          <label htmlFor="priority" className="block font-semibold text-gray-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Task DueDate */}
        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-gray-700 font-semibold mb-2">
            Due Date:
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
            required
          />
        </div>

        {/* Member Selection */}
        <div className="mb-4">
          <label htmlFor="users" className="block text-gray-700 font-semibold mb-2">
            Assign To:
          </label>
          <select
            id="users"
            value={task.assigneeId}
            onChange={handleUserSelection}
            className="border border-gray-300 rounded p-2 w-full"
          >
            {members.map((member, index) => (
              <option key={index} value={member.userId}>
                {member.username}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Assign Task
        </button>
      </form>
    </div>
  )
}

export default AssignTask;
