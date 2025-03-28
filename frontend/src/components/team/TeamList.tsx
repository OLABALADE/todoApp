import { useEffect, useState } from "react";
import { ITeam } from "../../models/Team.interface";
import { Link } from "react-router";

const TeamList: React.FC = () => {
  const url = `http://localhost:3000/api/teams`
  const [teams, setTeams] = useState<ITeam[]>([]);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(url, {
          credentials: "include",
        })
        const data: ITeam[] = await response.json();
        setTeams(data);
      } catch (err) {
        console.log(err)
      }
    }
    fetchTeams();
  }, [])

  return (
    <div className="flex flex-col justify-center items-center p-6 w-full">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl mb-4">
        <h2 className="text-2xl text-white font-semibold text-center mb-6"> My Teams </h2>
        {teams.length === 0 ?
          <p className="text-gray-600 text-center"> Your have no Team </p>
          :
          <ul className="space-y-4">
            {teams.map((team, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                <Link className="" to={`/teams/${team.teamId}/tasks`}>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{team.name}</h3>
                    <p className="text-sm text-gray-600">{team.description}</p>
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
