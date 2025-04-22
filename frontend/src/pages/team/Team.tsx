import React, { useEffect, useState } from "react"
import { ITeam } from "../../models/Team.interface";
import { useParams } from "react-router";
import TeamDetail from "../../components/team/TeamDetails";
import { useAuth } from "../../components/Auth";

const Team: React.FC = () => {
  const { id } = useParams();
  const [role, setRole] = useState<string | undefined>("");
  const [team, setTeam] = useState<ITeam>();
  const [loading, setLoading] = useState<boolean>(true);
  const { onFailure, getTeamRole } = useAuth();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams/${id}`, {
          credentials: "include",
        })
        if (response.status === 401) {
          onFailure();
        }
        const data: ITeam = await response.json();
        setTeam(data);
        const res = await getTeamRole(id);
        setRole(res)
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
    <TeamDetail role={role} team={team} setTeam={setTeam} />
  )
}

export default Team;

