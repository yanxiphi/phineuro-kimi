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
  isGuest: boolean;
  isRegistered: boolean;
  isPro: boolean;
  isExpired: boolean;
  canViewDetail: boolean;
  canUseFilters: boolean;
  canDownloadReports: boolean;
  canViewIntelHistory: boolean;
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

  // 权限计算
  const isGuest = !user;
  const isPro = user?.tier === 'pro';
  const isRegistered = !!user && user.tier !== 'guest';
  const isExpired = user?.tier === 'registered_expired';

  const canViewDetail = !isGuest;                    // 所有登录用户都能看详情
  const canUseFilters = isPro || user?.tier === 'registered'; // 仅试用期内和Pro
  const canDownloadReports = isPro;                  // 仅Pro
  const canViewIntelHistory = !isGuest;              // 所有登录用户都能看（过期用户前端限制7天）

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        isGuest,
        isRegistered,
        isPro,
        isExpired,
        canViewDetail,
        canUseFilters,
        canDownloadReports,
        canViewIntelHistory,
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
