import { useEffect, useContext } from 'react';
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
    <TeamList />
  );
}

export default Dashboard;
