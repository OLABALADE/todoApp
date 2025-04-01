import React, { SetStateAction, useContext } from "react";
import { ITeam } from "../../models/Team.interface";
import { useNavigate } from "react-router";
import { AuthContext } from "../Auth";

interface EditTeamProps {
  team: ITeam,
  setTeam: React.Dispatch<SetStateAction<ITeam>>
}

const EditTeam: React.FC<EditTeamProps> = ({ team, setTeam }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeam((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/teams/${team?.teamId}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          teamId: team.teamId,
          name: team.name,
          description: team.description
        })
      })

      if (res.status === 401) {
        auth?.onFailure();
      }

      navigate(`/teams/${team?.teamId}`)
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-8 mx-4">
        <h2 className="text-2xl font-semibold text-center mb-6"> Edit Team </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-meduim text-gray-700 mb-1">Name</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="name"
              type="text"
              value={team?.name}
              placeholder="Enter New Team Name"
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="description"
              value={team?.description}
              placeholder="Enter New Team Description"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Done</button>
        </form>
      </div>
    </div>
  )
}

export default EditTeam;
