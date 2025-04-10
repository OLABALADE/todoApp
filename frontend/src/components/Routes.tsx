import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import PersonalTasks from "../pages/task/PersonalTasks";
import TeamTasks from "../pages/task/TeamTasks";
import Team from "../pages/team/Team";
import TeamCreate from "../pages/team/TeamCreate";
import TeamEdit from "../pages/team/TeamEdit";
import Teams from "../pages/team/Teams";
import MainLayout from "../layouts/MainLayout";
import NoSidebarLayout from "../layouts/NoSidebarLayout";
import TeamTaskEdit from "../pages/task/TeamTaskEdit";
import PersonalTaskEdit from "../pages/task/PersonalTaskEdit";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<NoSidebarLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/personal/tasks" element={<PersonalTasks />} />
        <Route path="/personal/tasks/:taskId/edit" element={<PersonalTaskEdit />} />
        <Route path="/teams/create" element={< TeamCreate />} />
        <Route path="/teams" element={< Teams />} />
        <Route path="/teams/:id/edit" element={< TeamEdit />} />
        <Route path="/teams/:id" element={< Team />} />
        <Route path="/teams/:id/tasks" element={< TeamTasks />} />
        <Route path="/teams/:teamId/tasks/:taskId/edit" element={< TeamTaskEdit />} />
      </Route>
    </Routes >
  )
}

export default AppRoutes;
