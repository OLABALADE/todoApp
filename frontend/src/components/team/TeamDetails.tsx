import { useEffect, useState } from "react"
import { Team } from "../../models/Team.interface";

const TeamDetail: React.FC<{ teamId: number }> = ({ teamId }) => {
  const url = `http://localhost:3000/api/team/${teamId}`
  const [team, setTeam] = useState<Team>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(url, {
          credentials: "include",
        })
        const data: Team = await response.json();
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
    <div className="rounded-lg bg-gray-200 shadow-lg">
      <h2 className="">{team?.name}</h2>
      <p> {team?.description} </p>
    </div>
  )
}

export default TeamDetail;
