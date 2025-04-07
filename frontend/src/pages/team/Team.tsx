import React, { useContext, useEffect, useState } from "react"
import { ITeam } from "../../models/Team.interface";
import { useParams } from "react-router";
import TeamDetail from "../../components/team/TeamDetails";
import { AuthContext } from "../../components/Auth";

const Team: React.FC = () => {
  const { id } = useParams();
  const [team, setTeam] = useState<ITeam>();
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams/${id}`, {
          credentials: "include",
        })
        if (response.status === 401) {
          auth?.onFailure();
        }
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
    <TeamDetail team={team} setTeam={setTeam} />
  )
}

export default Team;

