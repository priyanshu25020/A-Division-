import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);
  const [demoAccounts, setDemoAccounts] = useState([]);

  useEffect(() => {
    async function initAuth() {
      // Load demo profiles for quick selector
      try {
        const demoRes = await api.getDemoAccounts();
        if (demoRes.success) {
          setDemoAccounts(demoRes.demoProfiles);
        }
      } catch (e) {
        console.error('Failed to load demo accounts', e);
      }

      // Check current token
      const existingToken = getAuthToken();
      if (existingToken) {
        try {
          const meRes = await api.getMe();
          if (meRes.success) {
            setUser(meRes.user);
          } else {
            setAuthToken(null);
            setUser(null);
          }
        } catch (e) {
          setAuthToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (identifier, password) => {
    const res = await api.login({ identifier, password });
    if (res.success && res.token) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const quickSwitch = async (identifier) => {
    setLoading(true);
    try {
      const res = await api.login({ identifier, password: 'ldrp123' });
      if (res.success) {
        setAuthToken(res.token);
        setTokenState(res.token);
        setUser(res.user);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
  };

  const isMentor = user?.role === 'MENTOR';
  const isClassCoord = user?.role === 'CLASS_COORD';
  const isGroupCoord = user?.role === 'GROUP_COORD';
  const isStudent = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      quickSwitch,
      logout,
      demoAccounts,
      isMentor,
      isClassCoord,
      isGroupCoord,
      isStudent
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
