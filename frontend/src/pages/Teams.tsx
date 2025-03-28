import { useEffect, useState } from "react";
import { Link } from "react-router";
import Sidebar from "../components/Sidebar";
import { ITeam } from "../models/Team.interface";

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTeams = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/teams", {
          credentials: "include"
        });
        const data = await response.json();
        setTeams(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    getTeams();
  }, [])

  if (loading) {
    return <p> Loading </p>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col justify-center items-center p-6 w-full">

        <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl mb-4">
          <h2 className="text-2xl text-white font-semibold text-center mb-6"> Teams </h2>
          {teams.length === 0 ?
            <p className="text-gray-600 text-center"> Your have no Team </p>
            :
            <ul className="space-y-4">
              {teams.map((team, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                  <Link className="" to={`/teams/${team.teamId}/tasks`}>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{team.name}</h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          }
        </div>
      </div>
    </div>
  )
}

export default Teams;
