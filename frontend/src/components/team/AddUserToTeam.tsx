import React, { useEffect, useState } from "react"
import { User } from "../../models/User.interface";
import { ITeam } from "../../models/Team.interface";

interface AddUsersToTeamProps {
  team: ITeam | undefined,
  setTeam: React.Dispatch<React.SetStateAction<ITeam | undefined>>
}

const AddUserToTeam: React.FC<AddUsersToTeamProps> = ({ team, setTeam }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const userId = Number(e.target.value);
    const user = users.find((user) => user.userId === userId)
    setSelectedUser(user);
  }

  const handleAddUsers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await fetch(`http://localhost:3000/api/teams/${team?.teamId}/members`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(selectedUser)
      })

      if (response.ok) {
        const remainingUsers = users.filter((user) => ![...(team?.members ?? []), selectedUser]
          .some((member) => member.userId === user.userId))

        setTeam((prev) => (
          {
            ...prev,
            members: [...prev?.members ?? [], selectedUser]
          }
        ))
        setSelectedUser(remainingUsers.length > 0 ? remainingUsers[0] : undefined)
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
        const data: User[] = await response.json();
        setUsers(data);
        if (data.length > 0) {
          setSelectedUser(data[0]);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchUsers();
  }, [])

  return (
    <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Add Users to {team?.name}</h2>

      <form onSubmit={handleAddUsers}>
        <div className="mb-4">
          <label htmlFor="users" className="block text-gray-700 font-semibold mb-2">
            Select User:
          </label>
          <select
            id="users"
            value={selectedUser?.userId}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          >
            {users.filter(user => !team?.members?.some(member => member.userId === user.userId))
              .map((user, index) => (
                <option key={index} value={user.userId}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </form>
    </div>
  )
}

export default AddUserToTeam;
