import { createContext, useEffect, useState } from "react";

interface AuthContextType {
  Isauthenticated: boolean
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const verifyAuth = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/verify-token", {
        credentials: "include"
      })
      setIsAuthenticated(response.status === 200)
    } catch (err) {
      setIsAuthenticated(false);
    }
  }

  useEffect(() => { verifyAuth }, [])
}

