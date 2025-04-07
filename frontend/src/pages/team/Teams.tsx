import { useContext, useEffect, useState } from "react";
import { ITeam } from "../../models/Team.interface";
import { AuthContext } from "../../components/Auth";
import TeamList from "../../components/team/TeamList";

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);

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
        auth?.onFailure();
      }
    }
    getTeams();
  }, [])

  if (loading) {
    return <p> Loading </p>
  }

  return (
    <TeamList teams={teams} />
  )
}

export default Teams;
