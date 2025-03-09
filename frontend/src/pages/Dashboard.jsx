import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Task, { TaskForm, TaskList } from '../components/Task';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tasks, setTasks] = useState([]);
  const username = localStorage.getItem("username")
  const addTask = (newTask) => {
    setTasks((prev) => [...prev, newTask])
  }
  const deleteTask = (id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  }

  useEffect(() => {
    fetch("http://localhost:3000/user/dashboard", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setTasks(data)
        setIsAuthenticated(true)
      })
      .catch(err => {
        return (
          <p> You are not logged in.Click here to <Link to="/login">Login</Link></p>
        )
      })
  }, []);

  if (!isAuthenticated) {
    return <p> You are not logged in.Click here to <Link to="/login">Login</Link></p>
  } else {
    return (
      <div className="Dashboard">
        <h1>Hello {username}</h1>
        <TaskList tasks={tasks} deleteTask={deleteTask} />
        <TaskForm username={username} addTask={addTask} />
      </div>
    );
  }
}
