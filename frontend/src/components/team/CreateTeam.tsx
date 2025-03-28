import { useNavigate } from "react-router";
import { ITeam } from "../../models/Team.interface";
import { useState } from "react";

const CreateTeam: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await fetch("http://localhost:3000/api/teams", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          description,
        })
      })
      const data: ITeam = await response.json();
      navigate(`/teams/${data.teamId}`)
      setName("");
      setDescription("");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-8 mx-4">
        <h2 className="text-2xl font-semibold text-center mb-6"> Create Team </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Team Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Team
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateTeam;
