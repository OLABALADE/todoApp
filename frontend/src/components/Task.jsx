export default function Task({ id, title, desc, status, priority, dueDate, teamId, projectId, creator, created, deleteTask }) {
  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      });
      deleteTask(id);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex space-x-7">
      <div>
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{desc}</p>
        <p className="text-sm">
          <strong>Priority:</strong> {priority}
        </p>
        <p className="text-sm">
          <strong>Status:</strong> {status}
        </p>
        <p className="text-sm">
          <strong>Due Date:</strong> {dueDate}
        </p>
      </div>
      <div
        className="flex items-center justify-center bg-gray-300 hover:bg-red-500 cursor-pointer rounded-full w-10 h-10 text-center"
        onClick={handleDelete}
      >
        X
      </div>
    </div>
  )
}

export function TaskList({ tasks, deleteTask }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mb-4">
      <h2 className="text-2xl font-semibold text-center mb-6">Task List</h2>
      {tasks.length === 0 ?
        <p className="text-gray-600 text-center">No tasks added yet.</p>
        :
        <ul className="space-y-4">
          {tasks.map((task, index) =>
            <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
              <Task key={index}
                id={task.id}
                title={task.title}
                desc={task.description}
                creator={task.creator}
                created={task.created}
                status={task.status}
                priority={task.priority}
                dueDate={task.dueDate}
                deleteTask={deleteTask}
              />
            </li>
          )}
        </ul>
      }
    </div>
  )
}
