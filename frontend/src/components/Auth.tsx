import { createContext, useState } from "react";
import Login from "../pages/Login";

interface AuthContextType {
  loggedIn: boolean
  verifyAuth: () => void
  login?: (email: string, password: string) => void
  logout?: () => void,
  onFailure: () => void
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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

  // useEffect(() => { verifyAuth }, [])

  return (
    <AuthContext.Provider
      value={{
        verifyAuth: verifyAuth,
        loggedIn: loggedIn,
        onFailure() {
          return setLoggedIn(false);
        }
      }}
    >
      {loggedIn ? children : <Login />}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
export { AuthContext }

