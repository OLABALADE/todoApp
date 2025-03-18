import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Personal from "./pages/Personal";
import Teams from "./pages/Teams";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/personal" element={<Personal />} />
        <Route path="/teams" element={<Teams />} />
      </Routes>
    </div>
  )
}

export default App;

