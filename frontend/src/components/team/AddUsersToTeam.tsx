import { useEffect, useState } from "react"
import { User } from "../../models/User.interface";
import { Team } from "../../models/Team.interface";

interface AddUsersToTeamProps {
  team: Team,
  addUsers: (users: User[]) => void
}

const AddUsersToTeam: React.FC<AddUsersToTeamProps> = ({ addUsers, team }) => {
  const url = `http://localhost:3000/api/teams/${team.teamId}/members`
  const [users, setUsers] = useState<User[]>([]);
  const handleAddUsers = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        addUsers(users);
      }

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users", {
          credentials: "include",
        })
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchUsers();
  })

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Add Users to {team?.name}</h2>

      <form onSubmit={handleAddUsers}>
        {/* User Selection */}
        <div className="mb-4">
          <label htmlFor="users" className="block text-gray-700 font-semibold mb-2">
            Select Users:
          </label>
          <select
            id="users"
            multiple
            value={selectedUsers}
            onChange={handleUserSelection}
            className="border border-gray-300 rounded p-2 w-full"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-600 mt-2">Hold Ctrl (Cmd on Mac) to select multiple users.</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Users
        </button>
      </form>
    </div>
  )
}

export default AddUsersToTeam;
