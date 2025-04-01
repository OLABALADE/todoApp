import React from "react"
import Sidebar from "../../components/Sidebar";
import CreateTeam from "../../components/team/CreateTeam";

const TeamCreate: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <CreateTeam />
    </div>
  )
}

export default TeamCreate;
