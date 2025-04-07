import { ITeam } from "../../models/Team.interface";
import { Link } from "react-router";

const TeamList: React.FC<{ teams: ITeam[] }> = ({ teams }) => {
  return (
    <div className="flex flex-col justify-center items-center p-6 w-full">
      <div className="bg-gray-800 text-gray-600 p-8 rounded-lg shadow-lg w-full max-w-2xl mb-4">
        <h2 className="text-2xl text-white font-semibold text-center mb-6"> My Teams </h2>
        {teams?.length === 0 ?
          <p className="text-center"> Your have no Team </p>
          :
          <ul className="space-y-4">
            {teams?.map((team, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                <Link className="" to={`/teams/${team.teamId}/tasks`}>
                  <div>
                    <h3 className="text-lg font-medium">{team.name}</h3>
                    <p className="text-sm">{team.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        }
      </div>
    </div>
  )
}

export default TeamList;
