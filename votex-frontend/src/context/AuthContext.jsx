// Auth context: stores JWT and user, exposes login/logout
import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken]  = useState(() => localStorage.getItem('votex_token'));
  const [user,  setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('votex_user')); } catch { return null; }
  });

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem('votex_token', newToken);
    localStorage.setItem('votex_user',  JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('votex_token');
    localStorage.removeItem('votex_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Convenience hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
