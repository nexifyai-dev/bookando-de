import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient, { setTokens, clearTokens, getAccessToken, getRefreshToken } from '../lib/apiClient';
import i18n from '../i18n';

const AuthContext = createContext(null);

function syncLanguage(user) {
  // BACKEND: language liegt auf root-level (user.language), nicht profile.language
  const lang = user?.language;
  if (lang && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/api/auth/me');
      setUser(data);
      syncLanguage(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }
      await fetchMe();
      setLoading(false);
    })();
  }, [fetchMe]);

  const login = async (email, password, totpCode = null) => {
    const payload = { email, password };
    if (totpCode) payload.totp_code = totpCode;
    const { data } = await apiClient.post('/api/auth/login', payload);
    // FIX: Login-Response hat access_token/refresh_token auf oberster Ebene, nicht unter .tokens
    setTokens(data);
    setUser(data.user);
    syncLanguage(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await apiClient.post('/api/auth/register', payload);
    // Register-Response hat tokens unter .tokens
    setTokens(data.tokens);
    setUser(data.user);
    syncLanguage(data.user);
    return data.user;
  };

  const logout = async () => {
    const refresh_token = getRefreshToken();
    try {
      await apiClient.post('/api/auth/logout', { refresh_token });
    } catch {}
    clearTokens();
    setUser(null);
  };

  const refreshUser = async () => fetchMe();

  const updateProfile = async (patch) => {
    // FIX: Backend erwartet PUT /auth/profile, nicht PATCH /api/users/me
    const { data } = await apiClient.put('/api/auth/profile', patch);
    setUser(data);
    syncLanguage(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function formatApiError(detail, fallback = 'Ein Fehler ist aufgetreten.') {
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map(e => e?.msg || JSON.stringify(e)).join(' ');
  if (detail?.msg) return detail.msg;
  return String(detail);
}
