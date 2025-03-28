import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PersonalTasks from "./pages/PersonalTasks";
import TeamTasks from "./pages/TeamTasks";
import Teams from "./pages/Teams";
import Team from "./pages/Team";
import TeamCreate from "./pages/TeamCreate";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/personal/tasks" element={<PersonalTasks />} />
        <Route path="/teams/tasks" element={<Teams />} />
        <Route path="/teams/:id/tasks" element={< TeamTasks />} />
        <Route path="/teams/:id" element={< Team />} />
        <Route path="/teams/create" element={< TeamCreate />} />
      </Routes>
    </div>
  )
}

export default App;

