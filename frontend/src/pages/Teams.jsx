import { useEffect, useState } from "react";
import { TeamForm } from "../components/Form";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const addTeam = (newTeam) => {
    setTeams((prev) => [...prev, newTeam]);
  }

  const deleteTeam = (id) => {
    const newTeams = teams.filter((team) => team.id !== id);
    setTeams(newTeams);
  }

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

        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mb-4">
          <h2 className="text-2xl font-semibold text-center mb-6"> My Teams </h2>
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
        <TeamForm addTeam={addTeam} />
      </div>
    </div>
  )
}
