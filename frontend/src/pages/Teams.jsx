import { useEffect } from "react";
import { useState } from "react"
import { TeamForm } from "../components/Form";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const addTeam = (newTeam) => {
    setTeams((prev) => [...prev, newTeam]);
  }

  const DeleteTeam = (id) => {
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
    <div>
      <h1> My Teams </h1>
      {
        teams.map((team, index) => (
          <div>
            <h2>{team.name}</h2>
          </div>
        ))
      }
      <TeamForm addTeam={addTeam} />
    </div>
  )
}
