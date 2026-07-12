import React, { createContext, useContext, useEffect, useState } from 'react';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(sessionStorage.getItem('madhayana_user')) || null; } catch { return null; } });
  useEffect(() => { user ? sessionStorage.setItem('madhayana_user', JSON.stringify(user)) : sessionStorage.removeItem('madhayana_user'); }, [user]);
  const loginAs = (role, data={}) => setUser({ role, id: `${role.slice(0,3).toUpperCase()}-2026-${String(Date.now()).slice(-6)}`, ...data });
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, setUser, loginAs, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
