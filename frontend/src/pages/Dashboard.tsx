import { useEffect, useContext } from 'react';
import TeamList from '../components/team/TeamList';
import { AuthContext } from '../components/Auth';

const Dashboard: React.FC = () => {
  const auth = useContext(AuthContext)
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/verify-token")
        if (response.status === 401) auth?.onFailure();
      } catch (err) {
        console.log(err)
      }
    }
    fetchAuthStatus();
  }, [])

  return (
    <TeamList />
  );
}

export default Dashboard;
