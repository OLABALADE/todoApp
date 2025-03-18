import { useEffect, useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/projects", {
          credentials: "include"
        })

        const data = await response.json();
        setProjects(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchProjects();
  })

  return (
    <div>
      <h1> Projects </h1>
      <ul>
        {
          projects.map((project, index) => {
            <li key={index} id={project.id}>{project.name}</li>
          })
        }
      </ul>
    </div>
  )
}
