import { useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import TeamList from '../components/team/TeamList';
import { AuthContext } from '../components/Auth';

const Dashboard: React.FC = () => {
  const auth = useContext(AuthContext)
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        await fetch("http://localhost:3000/api/auth/verify-token")
      } catch (err) {
        auth?.onFailure();
      }
    }
    fetchAuthStatus();
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <TeamList />
    </div>
  );
}


export default Dashboard;
