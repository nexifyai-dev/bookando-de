import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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

// Query-Keys, die bei Rollen-/Tenant-Wechsel invalidiert werden müssen.
// Wird zentral in AuthContext + PortalContext verwendet, damit Komponenten
// nicht selbst raten müssen.
export const ROLE_SCOPED_QUERY_KEYS = [
  'auth/user',
  'portal/nav',
  'portal/permissions',
  'vendor',
  'staff',
  'employees',
  'customer',
  'affiliate',
  'franchiser',
  'admin',
  'bookings',
  'calendar',
  'crm',
  'dashboard',
  'commission',
  'services',
  'locations',
  'plans',
  'reports',
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

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

  const login = useCallback(async (email, password, totpCode = null) => {
    const payload = { email, password };
    if (totpCode) payload.totp_code = totpCode;
    const { data } = await apiClient.post('/api/auth/login', payload);
    // FIX: Login-Response hat access_token/refresh_token auf oberster Ebene, nicht unter .tokens
    setTokens(data);
    setUser(data.user);
    syncLanguage(data.user);
    // Nach Login: alle scoped Queries invalidieren
    queryClient.invalidateQueries();
    return data.user;
  }, [queryClient]);

  const register = useCallback(async (payload) => {
    const { data } = await apiClient.post('/api/auth/register', payload);
    // Register-Response hat tokens unter .tokens
    setTokens(data.tokens);
    setUser(data.user);
    syncLanguage(data.user);
    queryClient.invalidateQueries();
    return data.user;
  }, [queryClient]);

  const logout = useCallback(async () => {
    const refresh_token = getRefreshToken();
    try {
      await apiClient.post('/api/auth/logout', { refresh_token });
    } catch {}
    clearTokens();
    setUser(null);
    // Cache komplett leeren, damit kein anderer User stale Daten sieht
    queryClient.clear();
  }, [queryClient]);

  const refreshUser = useCallback(async () => fetchMe(), [fetchMe]);

  const updateProfile = useCallback(async (patch) => {
    // FIX: Backend erwartet PUT /auth/profile, nicht PATCH /api/users/me
    const { data } = await apiClient.put('/api/auth/profile', patch);
    setUser(data);
    syncLanguage(data);
    return data;
  }, []);

  /**
   * Reaktiver Rollen-/Tenant-Wechsel.
   *
   * Reihenfolge:
   *  1. Optimistisches State-Update (UX bleibt snappy)
   *  2. Server-POST /api/auth/context (validiert gegen erlaubte Rollen/Tenants)
   *  3. Server-Antwort wird zur Wahrheit (korrigiert bei Konflikt)
   *  4. Alle rollenspezifischen Query-Caches invalidieren → frische Daten
   *  5. KEIN window.location.reload — Komponenten re-rendern automatisch
   */
  const setActiveContext = useCallback(
    async ({ role, tenant } = {}) => {
      if (!user) return null;
      const previous = user;
      // Optimistisch setzen
      const optimistic = {
        ...user,
        role: role || user.role,
        active_role: role || user.active_role,
        active_tenant: tenant !== undefined ? tenant : user.active_tenant,
      };
      setUser(optimistic);
      try {
        const { data } = await apiClient.post('/api/auth/context', {
          role: role || null,
          tenant: tenant !== undefined ? tenant : null,
        });
        const fresh = data?.profile || optimistic;
        setUser(fresh);
        syncLanguage(fresh);
        // Rollenspezifische Queries invalidieren — Komponenten holen frische Daten
        ROLE_SCOPED_QUERY_KEYS.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
        return fresh;
      } catch (err) {
        // Server-Konflikt → vorherigen State wiederherstellen
        setUser(previous);
        throw err;
      }
    },
    [user, queryClient],
  );

  /**
   * Convenience: nur die aktive Rolle wechseln.
   */
  const setActiveRole = useCallback(
    (role) => setActiveContext({ role }),
    [setActiveContext],
  );

  /**
   * Convenience: nur den aktiven Tenant/Vendor-Kontext wechseln.
   */
  const setActiveTenant = useCallback(
    (tenant) => setActiveContext({ tenant }),
    [setActiveContext],
  );

  /**
   * Abgeleitete Werte — werden reaktiv bei jeder user-Änderung neu berechnet.
   * Komponenten greifen via useAuth() auf diese zu und re-rendern automatisch.
   */
  const derived = useMemo(() => {
    // isReady = !loading (zentral, damit ALLE Consumer eine konsistente Quelle haben)
    const isReady = !loading;
    if (!user) {
      return {
        activeRole: null,
        activeTenant: null,
        availableRoles: [],
        availableTenants: [],
        permissions: [],
        isAdmin: false,
        isVendor: false,
        isStaff: false,
        isCustomer: false,
        isAffiliate: false,
        isFranchiser: false,
        isReady,
      };
    }
    const activeRole = user.active_role || user.role || 'customer';
    const availableRoles = Array.isArray(user.roles) && user.roles.length
      ? user.roles
      : [user.role || 'customer'];
    const availableTenants = Array.isArray(user.tenants) ? user.tenants : [];
    const activeTenant = user.active_tenant ||
      (availableTenants.length === 1 ? availableTenants[0] : null);

    const permissionsByRole = {
      admin: ['portal:*', 'admin:*', 'vendor:*', 'staff:*', 'customer:*', 'affiliate:*', 'reports:*'],
      super_admin: ['*'],
      vendor: ['portal:*', 'vendor:*', 'staff:*', 'reports:vendor', 'services:*', 'bookings:*'],
      staff: ['portal:read', 'staff:*', 'bookings:read', 'calendar:read'],
      customer: ['customer:*', 'bookings:own'],
      affiliate: ['affiliate:*', 'commission:own'],
      franchiser: ['franchiser:*', 'reports:franchise'],
    };
    const permissions = permissionsByRole[activeRole] || [];

    return {
      activeRole,
      activeTenant,
      availableRoles,
      availableTenants,
      permissions,
      isAdmin: activeRole === 'admin' || activeRole === 'super_admin',
      isVendor: activeRole === 'vendor' || activeRole === 'admin' || activeRole === 'super_admin',
      isStaff: activeRole === 'staff' || activeRole === 'vendor' || activeRole === 'admin',
      isCustomer: activeRole === 'customer',
      isAffiliate: activeRole === 'affiliate',
      isFranchiser: activeRole === 'franchiser',
      isReady,
    };
  }, [user, loading]);

  const value = useMemo(
    () => ({
      user,
      loading,
      ...derived,
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
      setActiveContext,
      setActiveRole,
      setActiveTenant,
      setUser,
    }),
    [
      user,
      loading,
      derived,
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
      setActiveContext,
      setActiveRole,
      setActiveTenant,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
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
