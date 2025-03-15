import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const login = (email, password) => {
    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setMessage("Login successful!")
        localStorage.setItem("username", data.username)
        navigate("/dashboard");
      })
      .catch(err => {
        setMessage("Error occurred during login");
        console.log(err);
      })
  }

  const handleSignup = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, email, password })
    })
      .then(res => {
        setMessage('Signup successful!');
        login(email, password)
      })
      .catch(err => {
        setMessage("Signup failed");
        console.log(err);
      })
  }

  return (
    <div className="signupForm">
      <h1>SignUp</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button type="submit">Signup</button>
      </form>
      <p> {message} </p>
    </div>
  )
}
