import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Sidebar from '../components/Sidebar';

const Dashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const username = localStorage.getItem("username");
  const checkAuthentication = async (): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/verify-token", {
        method: "GET",
        credentials: "include"
      })
      if (response.ok) {
        return true
      }
      return false
    } catch (err) {
      console.log(err)
      return false
    }
  }

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const authenticated = await checkAuthentication();
      setIsAuthenticated(authenticated)
    }
    fetchAuthStatus();
  }, [])

  if (!isAuthenticated) {
    return <p> You are not logged in.Click here to <Link to="/login">Login</Link></p>
  } else {
    return (
      <div className="Dashboard">
        <Sidebar />
        <h1>Hello {username}</h1>
      </div>
    );
  }
}

export default Dashboard;
