import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  business_name?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  logo_url?: string;
  subscription_plan?: 'free' | 'enterprise';
  subscription_status?: 'active' | 'past_due' | 'canceled';
  subscription_expires_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    const storedUser = api.getUser();
    
    if (token && storedUser) {
      api.getMe()
        .then(({ user: freshUser }) => {
          setUser(freshUser);
          api.setUser(freshUser);
        })
        .catch(() => {
          api.logout();
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { user: loggedInUser, token } = await api.login(email, password);
    api.setToken(token);
    api.setUser(loggedInUser);
    setUser(loggedInUser);
  };

  const signup = async (email: string, password: string, name: string) => {
    const { user: newUser, token } = await api.signup(email, password, name);
    api.setToken(token);
    api.setUser(newUser);
    setUser(newUser);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedFields };
      setUser(newUser);
      api.setUser(newUser);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}