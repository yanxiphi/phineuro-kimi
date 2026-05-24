import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserTier = 'guest' | 'registered' | 'registered_expired' | 'pro';

export interface User {
  id: number;
  phone: string;
  name: string;
  avatar?: string;
  role: string;
  tier: UserTier;
  trialEndsAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  showLogin: () => void;
  hideLogin: () => void;
  isLoginOpen: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // 初始化：检查本地 token
  useEffect(() => {
    const token = localStorage.getItem('phineuro_token');
    if (token) {
      fetch('https://datasets.phineuro.life/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('phineuro_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('phineuro_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem('phineuro_token', token);
    setUser(userData);
    setIsLoginOpen(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('phineuro_token');
    setUser(null);
    window.location.reload();
  }, []);

  const showLogin = useCallback(() => setIsLoginOpen(true), []);
  const hideLogin = useCallback(() => setIsLoginOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
        showLogin,
        hideLogin,
        isLoginOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
