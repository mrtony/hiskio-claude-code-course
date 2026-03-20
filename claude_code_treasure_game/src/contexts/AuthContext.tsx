import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getSavedUser, isLoggedIn, logout as apiLogout, signup as apiSignup, signin as apiSignin } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  playAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      const savedUser = getSavedUser();
      if (savedUser) {
        setUser(savedUser);
        setIsGuest(false);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const u = await apiSignin(email, password);
    setUser(u);
    setIsGuest(false);
  };

  const register = async (email: string, password: string) => {
    const u = await apiSignup(email, password);
    setUser(u);
    setIsGuest(false);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setIsGuest(false);
  };

  const playAsGuest = () => {
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, login, register, logout, playAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
