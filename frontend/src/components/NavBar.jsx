import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="sidebar">
      <Link to="/personal">Personal</Link>
      <Link to="/teams">Teams</Link>
    </div>
  )
}
