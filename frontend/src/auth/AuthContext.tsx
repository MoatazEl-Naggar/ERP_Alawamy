import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: any) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // ✅ Listen for unauthorized events from API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      navigate("/login", { replace: true });
    };

    window.addEventListener("UNAUTHORIZED", handleUnauthorized);
    return () => window.removeEventListener("UNAUTHORIZED", handleUnauthorized);
  }, [navigate]);

  // ✅ Check if user is already logged in on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    } else if (token || savedUser) {
      // Inconsistent state - clear everything
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);

  const login = (data: any) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);