import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })
      setMessage("Login successful!")
      navigate("/dashboard");

    } catch (err) {
      setMessage("Error occurred during login");
      console.log(err);
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, email, password })
      })
      setMessage('Signup successful!');
      login(email, password)
    } catch (err) {

      setMessage("Signup failed");
      console.log(err);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-6 rounded-lg w-full max-w-xs bg-indigo-950">
        <h1 className="text-xl font-semibold text-center mb-6 text-gray-500 text-white">SignUp</h1>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1 text-white">Username</label>
            <input
              type="text"
              value={username}
              className="bg-white w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-white">Email</label>
            <input
              type="email"
              value={email}
              className="bg-white w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-white">Password</label>
            <input
              type="password"
              value={password}
              className="bg-white w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="text-white w-full bg-green-500 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white-500"
            type="submit">
            SignUp
          </button>
        </form>
        <p> {message} </p>
      </div>
    </div>
  )
}

export default Signup;
