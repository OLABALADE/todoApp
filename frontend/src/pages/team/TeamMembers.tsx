import React, { useContext, useEffect, useState } from "react";
import { User } from "../../models/User.interface";
import { useParams } from "react-router";
import { AuthContext } from "../../components/Auth";
import AddUserToTeam from "../../components/team/AddUserToTeam";

const TeamMembers: React.FC = () => {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const [teamMembers, setTeamMembers] = useState<User[]>();

  const RemoveMember = async () => {

  }

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams/${id}/members`, {
          credentials: "include"
        })

        if (response.status === 401) {
          auth?.onFailure()
        }

        const data: User[] = await response.json();
        setTeamMembers(data);
      } catch (err) {

      }
    }
  })

  return (
    <div>
      <h2>Members</h2>
      <ul>
        {teamMembers?.map((member, index) => (
          <li key={index} id={`${member.userId}`}>
            <div>
              <h3> {member.name}</h3>
              <p> Remove Member </p>
            </div>
          </li>
        ))}
      </ul>
      <AddUserToTeam />
    </div>
  )
}

export default TeamMembers;
