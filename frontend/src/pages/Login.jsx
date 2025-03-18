import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        localStorage.setItem("username", data.username);
        navigate("/dashboard");
      })
      .catch(err => {
        setMessage("Login failed");
        console.log(err)
      })
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red p-6 rounded-lg w-full max-w-xs bg-indigo-950">
        <h1 className="text-xl font-semibold text-center mb-6 text-white">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-white">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-white">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="text-white w-full bg-green-500 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white-500"
            type="submit">
            Login
          </button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}
