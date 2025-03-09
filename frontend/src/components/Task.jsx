import { useEffect, useState } from "react"

export default function Task({ id, title, desc, author, created, deleteTask }) {
  const handleClick = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/task/delete", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id })
    })
      .then(deleteTask(id))
      .catch(err => console.log(err));
  }
  return (
    <div className="task" id={id}>
      <h2 className='title'> {title} </h2>
      <p className='desc'> Description: {desc} </p>
      <p className='created'> At {created} </p>
      <button onClick={handleClick}>X</button>
    </div>
  )
}

export function TaskForm({ username, addTask }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/task/create", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ title, desc, username })
    })
      .then(res => res.json())
      .then(newTask => {
        addTask(newTask);
        setTitle("");
        setDesc("");
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="taskForm">
      <h1> Add Task </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          value={desc}
          placeholder="Description"
          onChange={(e) => setDesc(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
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
          desc={task.desc}
          author={task.author}
          created={task.created}
          deleteTask={deleteTask}
        />
      )}
    </div>
  )
}
