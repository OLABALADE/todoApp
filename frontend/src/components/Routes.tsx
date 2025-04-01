import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import PersonalTasks from "../pages/PersonalTasks";
import TeamTasks from "../pages/team/TeamTasks";
import Team from "../pages/team/Team";
import TeamCreate from "../pages/team/TeamCreate";
import TeamEdit from "../pages/team/TeamEdit";

const SiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/personal/tasks" element={<PersonalTasks />} />

      <Route path="/teams/create" element={< TeamCreate />} />
      <Route path="/teams/:id/edit" element={< TeamEdit />} />
      <Route path="/teams/:id" element={< Team />} />
      <Route path="/teams/:id/tasks" element={< TeamTasks />} />
    </Routes>
  )
}

export default SiteRoutes;
