import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div>
      <h1>TodoApp</h1>
      <nav>
        <Link to="signup">Signup</Link>
        <Link to="login">Login</Link>
      </nav>
    </div>
  )
}

export function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="TaskList">
      <h1>Task List</h1>
      {tasks.map(task =>
        <Task key={task.Id}
          title={task.Title}
          desc={task.Description}
          author={task.Author}
          created={task.Created}
        />
      )}
    </div>
  );
}


export function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const login = async (email, password) => {
    const response = await fetch("http://localhost:3000/user/login")
  }

  const handleSignup = async (e) => {
    try {
      let response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, email, password })
      })

      if (!response.ok) {
        throw new Error("Signup failed")
      }
      setMessage('Signup successful!');

    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="signupForm">
      <h1>SignUp</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="assword"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
      <p> {message} </p>
    </div>
  )
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      })

      const token = response.data.token;
      localStorage.setItem('token', token);
      setMessage('Login successful!');

    } catch (err) {
      setMessage('Login failed: ' + err);
    }
  };


  const accessDashboard = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/user/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data);
    } catch (err) {
      setMessage('Failed to get dashboard: ' + err.response.data);
    }
  };

  return (
    <div className="loginForm">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      <button onClick={accessDashboard}>Go to dashboard</button>

      <p>{message}</p>
    </div>
  );
}
