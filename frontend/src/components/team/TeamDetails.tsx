import { ITeam } from "../../models/Team.interface";
import AddUserToTeam from "./AddUserToTeam";

interface TeamDetailProps {
  team: ITeam | undefined
  setTeam: React.Dispatch<React.SetStateAction<ITeam>>
}

const TeamDetail: React.FC<TeamDetailProps> = ({ team, setTeam }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full mb-4">
        <h2 className="text-2xl text-gray-800 mt-1 font-semibold text-center mb-2">{team?.name}</h2>
        <p className="text-gray-800 text-center font-semibold text-sm mb-6"> Description: {team?.description} </p>
        <h2 className="text-xl font-semibold text-gray-600 text-center"> Members </h2>
        <ul>
          {team?.members.map((member, index) => (
            <li className="text-gray-600 text-center" key={index}>{member.name}</li>
          ))}
        </ul>
      </div>
      <AddUserToTeam team={team} setTeam={setTeam} />
    </div>
  )
}

export default TeamDetail;
