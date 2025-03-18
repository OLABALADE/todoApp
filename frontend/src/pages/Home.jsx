import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link to="/" className="text-white text-xl font-semibold">Todo App</Link>
          </div>
          <div className="space-x-4">
            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
            <Link to="/signup" className="text-white hover:text-gray-300">Sign Up</Link>
            <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full mt-10">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Todo App</h1>
          <p className="text-gray-600 mb-6">
            Manage your tasks efficiently and stay productive. Organize, track, and complete your daily tasks with ease!
          </p>
        </div>
      </div>
    </div >
  )
}
