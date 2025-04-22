import { NavLink } from "react-router";
import { ITeam } from "../models/Team.interface";
import { useContext, useEffect, useState } from "react";
import {
  Bars4Icon,
  HomeIcon,
  PowerIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "./Auth";

const Sidebar: React.FC = () => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleClicks = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const Active = ({ isActive }: { isActive: boolean }) =>
    `text-sm ${isActive ? "text-green-300 rounded-lg font-bold" : ""}`;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams`, {
          credentials: "include",
        });
        const data: ITeam[] = await response.json();
        setTeams(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div>
      <Bars4Icon
        onClick={() => setSidebarOpen(true)}
        className="p-3 h-10 fixed top-4 left-2 z-50 bg-gray-800 text-white rounded-md shadow-md md:hidden"
      />

      <div
        className={`fixed md:static top-0 left-0  h-full md:min-h-screen w-64 
            bg-gray-800 text-white p-6 flex flex-col space-y-4 z-50 
            transform transition-transform duration-300 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0`}
      >
        <div className="md:hidden flex justify-end">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col space-y-2 border-b-4">
          <div className="flex items-center space-x-3">
            <HomeIcon className="h-4" />
            <NavLink onClick={handleClicks} className={Active} to="/dashboard">
              Dashboard
            </NavLink>
          </div>
          <h2 className="font-semibold">Tasks</h2>
          <NavLink
            onClick={handleClicks}
            className={Active}
            to="/personal/tasks"
          >
            Personal
          </NavLink>
          <NavLink onClick={handleClicks} className={Active} end to="/teams">
            Team
          </NavLink>
        </div>

        <div>
          <div className="flex space-x-4 items-center mb-2">
            <UserGroupIcon className="h-6" />
            <h2 className="font-semibold">Teams</h2>
          </div>

          {loading ? (
            <p>Loading items...</p>
          ) : (
            <ul>
              {teams?.map((team: any, index: number) => (
                <li key={index}>
                  <NavLink
                    onClick={handleClicks}
                    className={Active}
                    to={`/teams/${team.teamId}`}
                  >
                    {team.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          <NavLink
            onClick={handleClicks}
            className={Active}
            to={"/teams/create"}
          >
            + Create Team
          </NavLink>
        </div>

        <div
          className="flex space-x-4 cursor-pointer mt-auto"
          onClick={auth?.logout}
        >
          <PowerIcon className="h-6" />
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
