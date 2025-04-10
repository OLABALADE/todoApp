import { Dispatch, FC, FormEvent, SetStateAction, useContext } from "react";
import { ITask, ITaskOut } from "../../models/Task.interface";
import { AuthContext } from "../Auth";
import { useNavigate } from "react-router";

interface EditPersonalTaskProps {
  task: ITaskOut | undefined,
  setTask: Dispatch<SetStateAction<ITask>>
}

const EditPersonalTask: FC<EditPersonalTaskProps> = ({ task, setTask }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const date = task?.dueDate ? new Date(task.dueDate) : null;
  const dateInputValue = date && !isNaN(date.getTime())
    ? date.toISOString().split("T")[0]
    : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = `http://localhost:3000/api/tasks/${task?.taskId}`
      const response = await fetch(url, {
        credentials: "include",
        method: "PUT",
        body: JSON.stringify(task)
      })

      if (response.status === 401) auth?.onFailure();
      navigate(`/personal/tasks`)
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-8 mx-4">
        <h2 className="text-2xl font-semibold text-center mb-6"> Edit Task </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* Task Title */}
            <label htmlFor="name" className="block text-sm font-meduim text-gray-700 mb-1">Title</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="title"
              type="text"
              value={task?.title}
              placeholder="Enter New Team Name"
              onChange={handleChange}
            />
          </div>

          {/* Task Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="description"
              value={task?.description}
              placeholder="Enter New Team Description"
              onChange={handleChange}
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
              value={task?.priority}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Task DueDate */}
          <div className="mb-6">
            <label htmlFor="dueDate" className="block text-gray-700 font-semibold mb-2">
              Due Date:
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={dateInputValue}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Done</button>
        </form>
      </div>
    </div>
  )
}

export default EditPersonalTask;
