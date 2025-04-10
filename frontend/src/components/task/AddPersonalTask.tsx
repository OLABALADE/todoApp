import { ChangeEvent, FC, FormEvent, useState } from "react";
import { ITask } from "../../models/Task.interface";

const AddPersonalTask: FC<{ addTask: (task: ITask) => void }> = ({ addTask }) => {
  const [task, setTask] = useState<ITask>({
    title: "",
    description: "",
    status: "pending",
    priority: "low",
    taskType: "personal",
    dueDate: "",
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          taskType: task.taskType,
          dueDate: task.dueDate,
        })
      })

      const data: ITask = await response.json();
      addTask(data)
      setTask({
        title: "",
        description: "",
        status: "pending",
        priority: "low",
        taskType: "personal",
        dueDate: "",
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
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

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>
    </div>
  )
}

export default AddPersonalTask;
