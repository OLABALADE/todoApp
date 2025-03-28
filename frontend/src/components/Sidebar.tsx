import { Link } from "react-router";
import { ITeam } from "../models/Team.interface";
import { useEffect, useState } from "react";

const Sidebar: React.FC = () => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams`, {
          credentials: "include",
        })
        const data: ITeam[] = await response.json();
        setTeams(data);
        setLoading(false);
      } catch (err) {
        console.log(err)
      }
    }
    fetchTeams();
  }, [])

  return (
    <div className="w-64 bg-gray-800 text-white p-6 flex flex-col space-y-4">
      <div className="flex flex-col space-y-2 border-b-4 relative fixed">
        <h2 className="font-semibold"> Tasks </h2>
        <Link className="text-sm" to="/personal/tasks">Personal</Link>
        <Link className="text-sm mb-2" to="/teams/tasks">Team</Link>
      </div>
      <div>
        <h2 className="font-semibold"> Teams </h2>
        {loading ? <p> Loading items...</p> :
          <ul>
            {teams?.map((team, index) => (
              <li key={index}>
                <Link className="text-sm" to={`/teams/${team.teamId}`}> {team.name} </Link>
              </li>
            ))}
          </ul>
        }
        <Link className="text-sm" to={"/teams/create"}> + Create Team </Link>
      </div>
    </div>
  )
}

export default Sidebar;
