import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-600 text-white p-6 flex flex-col space-y-4">
      <Link to="/personal">Personal</Link>
      <Link to="/teams">Teams</Link>
    </div>
  )
}
