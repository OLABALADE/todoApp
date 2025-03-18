import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sm:flex flex-col p-2 xl:items-start fixed h-full">
      <Link to="/personal">Personal</Link>
      <Link to="/teams">Teams</Link>
    </div>
  )
}
