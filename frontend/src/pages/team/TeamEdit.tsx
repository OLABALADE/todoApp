import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../components/Auth";
import { ITeam } from "../../models/Team.interface";
import EditTeam from "../../components/team/EditTeam";

const TeamEdit: React.FC = () => {
  const { id } = useParams();
  const auth = useContext(AuthContext);
  const [team, SetTeam] = useState<ITeam>({
    name: "",
    description: ""
  });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams/${id}`, {
          credentials: "include"
        })

        if (response.status === 401) {
          auth?.onFailure();
        }
        const data: ITeam = await response.json();
        SetTeam(data)

      } catch (err) {
        console.log(err);
      }
    }

    fetchTeam();
  }, [])

  return (
    <EditTeam team={team} setTeam={SetTeam} />
  )
}

export default TeamEdit;
