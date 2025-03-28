import React, { useEffect, useState } from "react"
import { ITeam } from "../models/Team.interface";
import { useParams } from "react-router";
import Sidebar from "../components/Sidebar";
import TeamDetail from "../components/team/TeamDetails";

const Team: React.FC = () => {
  const { id } = useParams();
  const url = `http://localhost:3000/api/teams/${id}`
  const [team, setTeam] = useState<ITeam>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(url, {
          credentials: "include",
        })
        const data: ITeam = await response.json();
        setTeam(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    fetchTeam();
  }, [])

  if (loading) {
    return <p> Loading... </p>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <TeamDetail team={team} setTeam={setTeam} />
    </div>
  )
}

export default Team;

