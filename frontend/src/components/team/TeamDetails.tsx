import { Link, useNavigate } from "react-router";
import { ITeam } from "../../models/Team.interface";
import React, { useContext, useState } from "react";
import { AuthContext } from "../Auth";
import AddUserToTeam from "./AddUserToTeam";

interface TeamDetailProps {
  team: ITeam | undefined
  setTeam: React.Dispatch<React.SetStateAction<ITeam | undefined>>
}


const TeamDetail: React.FC<TeamDetailProps> = ({ team, setTeam }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [addMember, setAddMember] = useState<boolean>(false);

  const handleDeleteTeam = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/teams/${team?.teamId}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (res.status === 401) {
        auth?.onFailure();
      }

      navigate("/dashboard")
    } catch (err) {
      console.log(err)
    }
  }

  const handleRemoveMember = async (e: React.MouseEvent, userId: number) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/teams/${team?.teamId}/members/${userId}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (res.status === 401) {
        auth?.onFailure();
      }

      setTeam((prev) => (
        {
          ...prev,
          members: prev?.members?.filter((member) => member.userId !== userId)
        }
      ))
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-4">
        <div className="w-full border-b-2 border-gray-600">
          <h2 className="text-2xl text-gray-800 mt-1 font-semibold text-center mb-2">{team?.name}</h2>
          <p className="text-gray-800 text-center font-semibold text-sm mb-6"> Description: {team?.description} </p>
        </div>
        <div className="w-full mb-4">
          <h2 className="font-semibold text-gray-600">{team?.members?.length} Members </h2>
          <ul>
            {team?.members?.map((member, index) => (
              <li className="flex justify-between mx-auto items-center text-gray-600 ml-4" key={index}>
                <div>
                  <p>{member.username}</p>
                </div>
                {
                  member.username === team.creator ? <></> :
                    <div>
                      <button
                        className="cursor-pointer bg-blue-500 rounded-lg text-sm text-white font-semibold px-2"
                        onClick={(e: any) => handleRemoveMember(e, member.userId)}
                      >
                        Remove Member
                      </button>
                    </div>
                }
              </li>
            ))}
          </ul>
        </div>
        <div className="flex space-x-4 items-center justify-center">
          <button
            className="bg-blue-500 rounded-lg text-white font-semibold px-4"
            onClick={(_: any) => setAddMember(true)}
          >
            Add Member to Team
          </button>

          <Link className="bg-blue-500 rounded-lg text-white font-semibold px-4"
            to={`/teams/${team?.teamId}/edit`}>
            Edit Team
          </Link>

          <button
            className="bg-blue-500 rounded-lg text-white font-semibold px-4 cursor-pointer"
            onClick={handleDeleteTeam}>
            Delete Team
          </button>
        </div>
      </div>
      {addMember ? <AddUserToTeam team={team} setTeam={setTeam} /> : <></>}
    </div>
  )
}

export default TeamDetail;
