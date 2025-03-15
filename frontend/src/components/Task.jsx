export default function Task({ id, title, desc, status, priority, dueDate, creator, created, deleteTask }) {
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
    <div className="task" id={id}>
      <h2 className='title'> {title} </h2>
      <p className='desc'> Description: {desc} </p>
      <p className='status'> Status: {status} </p>
      <p className='priority'> Priority: {priority} </p>
      <p className='dueDate'> Due Date: {dueDate} </p>
      <p className='created'> At {created} </p>
      <button onClick={handleDelete}>X</button>
    </div>
  )
}

export function TaskList({ tasks, deleteTask }) {
  return (
    <div className="TaskList">
      <h2>Task List</h2>
      {tasks.map((task, index) =>
        <Task key={index}
          id={task.id}
          title={task.title}
          desc={task.description}
          author={task.creator}
          created={task.created}
          status={task.status}
          priority={task.priority}
          dueDate={task.dueDate}
          deleteTask={deleteTask}
        />
      )}
    </div>
  )
}
