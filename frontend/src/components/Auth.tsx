import { createContext, useContext, useState } from "react";
import Login from "../pages/Login";
import { User } from "../models/User.interface";

interface AuthContextType {
  user?: User | null,
  loggedIn: boolean
  verifyAuth: () => void
  login?: (email: string, password: string) => void
  logout?: () => void,
  onFailure: () => void
  getTeamRole: (teamId: string | undefined) => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState(true);
  const verifyAuth = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/verify-token", {
        credentials: "include"
      })
      setLoggedIn(response.status === 200)
    } catch (err) {
      setLoggedIn(false);
    }
  }

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      setLoggedIn(false)
    } catch (err) {
      console.log(err)
    }
  }

  const getTeamRole = async (teamId: string | undefined) => {
    try {
      const res = await fetch(`http://localhost:3000/api/teams/${teamId}/role`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        const role: string = data.role
        return role;
      }
    } catch (err) {
      console.error("Failed to fetch team role", err);
    }
    return undefined;
  };


  return (
    <AuthContext.Provider
      value={{
        verifyAuth: verifyAuth,
        getTeamRole: getTeamRole,
        loggedIn: loggedIn,
        onFailure() {
          return setLoggedIn(false);
        },
        logout: logout
      }}
    >
      {loggedIn ? children : <Login />}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
export { AuthContext }
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
