import { NavLink } from "react-router";
import { ITeam } from "../models/Team.interface";
import { useEffect, useState } from "react";

const Sidebar: React.FC = () => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [loading, setLoading] = useState(true);

  const Active = ({ isActive }: { isActive: boolean }) =>
    `text-sm ${isActive ? "text-green-300 font-bold" : ""}`

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
        <NavLink className={Active} to="/personal/tasks">Personal</NavLink>
        <NavLink className={Active} end to="/teams">Team</NavLink>
      </div>
      <div>
        <h2 className="font-semibold"> Teams </h2>
        {loading ? <p> Loading items...</p> :
          <ul>
            {teams?.map((team, index) => (
              <li key={index}>
                <NavLink className={Active} to={`/teams/${team.teamId}`}> {team.name} </NavLink>
              </li>
            ))}
          </ul>
        }
        <NavLink className={Active} to={"/teams/create"}> + Create Team </NavLink>
      </div>
    </div>
  )
}

export default Sidebar;
