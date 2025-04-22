import React, { useEffect, useState } from "react";
import { User } from "../../models/User.interface";
import { ITeam } from "../../models/Team.interface";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AddUsersToTeamProps {
  team: ITeam | undefined;
  isOpen: boolean;
  onClose: () => void;
  setTeam: React.Dispatch<React.SetStateAction<ITeam | undefined>>;
}

const AddUserToTeam: React.FC<AddUsersToTeamProps> = ({
  team,
  isOpen,
  onClose,
  setTeam,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [showUsers, setShowUsers] = useState(false);

  const filteredUsers = users
    .filter(
      (user) => !team?.members?.some((member) => member.userId === user.userId),
    )
    .filter(
      (user) =>
        user.username?.toLowerCase().includes(query.toLowerCase()) &&
        !selectedUsers?.some((u) => u.userId === user.userId),
    );

  const handleRemove = (id: number) =>
    setSelectedUsers((prev) => prev.filter((user) => user.userId !== id));

  const handleSelect = (user: User) => {
    setSelectedUsers((prev) => [...(prev ?? []), user]);
    setQuery("");
  };

  const handleAddUsers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUsers) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/teams/${team?.teamId}/members`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            users: selectedUsers,
          }),
        },
      );

      if (response.ok) {
        setTeam((prev) => ({
          ...prev,
          members: [...(prev?.members ?? []), ...selectedUsers],
        }));
        setSelectedUsers([]);
        onClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users", {
          credentials: "include",
        });
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed insert-0 bg-black bg-opacity-50 z-50
      bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md"
    >
      <div>
        <div className="flex justify-end">
          <XMarkIcon className="h-7" onClick={onClose} />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Add Users to {team?.name}
        </h2>
      </div>

      <form onSubmit={handleAddUsers}>
        <div className="mb-4">
          <div className="max-w-md mx-auto mt-10">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowUsers(false);
              }}
              onClick={() => setShowUsers(true)}
              placeholder="Search users..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {showUsers && (
              <ul className="mt-2 bg-white border border-gray-200 rounded-xl shadow-md max-h-60 overflow-y-auto">
                {users
                  .filter(
                    (user) =>
                      !team?.members?.some(
                        (member) => member.userId === user.userId,
                      ) &&
                      !selectedUsers?.some((u) => u.userId === user.userId),
                  )
                  .map((user) => (
                    <li
                      key={user.userId}
                      onClick={() => {
                        handleSelect(user);
                        setShowUsers(false);
                      }}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      {user.username}
                    </li>
                  ))}
              </ul>
            )}

            {query && (
              <ul className="mt-2 bg-white border border-gray-200 rounded-xl shadow-md max-h-60 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <li
                      key={user.userId}
                      onClick={() => handleSelect(user)}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      {user.username}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-gray-500">No users found</li>
                )}
              </ul>
            )}

            {selectedUsers.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.userId}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {user.username}
                    <button
                      onClick={() => handleRemove(user.userId)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Users
        </button>
      </form>
    </div>
  );
};

export default AddUserToTeam;
