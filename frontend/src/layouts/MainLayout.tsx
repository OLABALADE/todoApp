import { Outlet } from "react-router"
import Sidebar from "../components/Sidebar"

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout;
