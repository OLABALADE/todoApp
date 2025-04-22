import { useNavigate } from "react-router";
import { ITeam } from "../../models/Team.interface";
import React, { useContext, useState } from "react";
import { AuthContext } from "../Auth";
import AddUserToTeam from "./AddUserToTeam";
import {
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface TeamDetailProps {
  role: string | undefined;
  team: ITeam | undefined;
  setTeam: React.Dispatch<React.SetStateAction<ITeam | undefined>>;
}

const TeamDetail: React.FC<TeamDetailProps> = ({ team, role, setTeam }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDeleteTeam = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/teams/${team?.teamId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (res.status === 401) {
        auth?.onFailure();
      }

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveMember = async (e: React.MouseEvent, userId: number) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/teams/${team?.teamId}/members/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (res.status === 401) {
        auth?.onFailure();
      }

      setTeam((prev) => ({
        ...prev,
        members: prev?.members?.filter((member) => member.userId !== userId),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen">
      {role === "admin" && (
        <div className=" mb-3 flex justify-end px-4 w-full mt-2">
          <div className="flex py-2 px-3 space-x-3 text-white rounded-lg bg-blue-500">
            <UserPlusIcon
              onClick={() => setIsModalOpen(true)}
              className="h-7 cursor-pointer"
            />
            <PencilSquareIcon
              onClick={() => navigate(`/teams/${team?.teamId}/edit`)}
              className="h-7 cursor-pointer"
            />
            <TrashIcon
              onClick={handleDeleteTeam}
              className="h-7 cursor-pointer"
            />
          </div>
        </div>
      )}

      <div className="mb-4 w-full">
        <div>
          <h2 className="text-2xl text-black mt-1 font-semibold text-center mb-2">
            {team?.name}
          </h2>
          <p className="text-gray-800 text-center font-semibold text-sm mb-6">
            Description: {team?.description}
          </p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-center text-gray-600 mb-3">
            {team?.members?.length} Members
          </h2>
          <ul className="flex flex-col items-center justify-center">
            {team?.members?.map((member, index) => (
              <li
                className="flex w-50 mb-3 
                rounded-lg px-4 font-bold text-white py-1 bg-blue-500 
                justify-between items-center text-gray-600 ml-4"
                key={index}
              >
                <div>
                  <p>{member.username}</p>
                </div>
                {member.username === team.creator ? (
                  <></>
                ) : (
                  <div>
                    {role === "admin" && (
                      <XCircleIcon
                        className="h-7 cursor-pointer"
                        onClick={(e: any) =>
                          handleRemoveMember(e, member.userId)
                        }
                      />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <AddUserToTeam
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        team={team}
        setTeam={setTeam}
      />
    </div>
  );
};

export default TeamDetail;
