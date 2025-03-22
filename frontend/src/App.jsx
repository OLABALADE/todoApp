import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PersonalTasks from "./pages/PersonalTasks";
import TeamTasks from "./pages/TeamTasks";
import Teams from "./pages/Teams";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/personal" element={<PersonalTasks />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:id/tasks" element={< TeamTasks />} />
      </Routes>
    </div>
  )
}

export default App;

