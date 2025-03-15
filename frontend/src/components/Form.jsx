import { useState } from "react";

export function TaskForm({ taskType, teamId, projectId, addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          taskType,
          status,
          priority,
          teamId,
          projectId,
          dueDate,
        })
      })

      const data = await response.json();
      addTask(data);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.log(err)
    }
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
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Choose Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value={"pending"}> Pending </option>
          <option value={"inProgress"}> In Progress </option>
          <option value={"completed"}> Completed </option>
        </select>

        <label>Choose Priority:</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value={"low"}> Low </option>
          <option value={"medium"}> Medium </option>
          <option value={"high"}> High </option>
        </select>

        <label>Set DueDate:</label>
        <input
          type="date"
          value={dueDate}
          placeholder="Due Date"
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
    </div>
  )
}

export function TeamForm({ addTeam }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/team/create", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, desc })
    })
      .then(res => res.json())
      .then(newTeam => {
        addTeam(team);
        setName("");
        setDesc("");
      })
      .catch(err => console.log(err))
  }
  return (
    <div className="teamForm">
      <h1> Create Team </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          value={desc}
          placeholder="Description"
          onChange={(e) => setDesc(e.target.value)}
        />
        <button type="submit"> Create Team </button>
      </form>
    </div>
  )
}
