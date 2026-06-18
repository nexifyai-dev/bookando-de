import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Home, Store, Briefcase, Users, CalendarDays, CalendarCheck, Contact,
  BarChart3, UserCheck, CalendarClock, TrendingUp, PieChart, Network,
  Shield, UserCog, Coins, LayoutDashboard, Clock, StickyNote, User, Wrench,
} from 'lucide-react';

/**
 * Zentrales Icon-Registry: Schlüssel-Name → React-Component.
 * Wird sowohl in PortalContext (für navItems) als auch in den
 * RoleSwitcher- und TenantSwitcher-Komponenten verwendet.
 */
const ICONS = {
  Home, Store, Briefcase, Users, CalendarDays, CalendarCheck, Contact,
  BarChart3, UserCheck, CalendarClock, TrendingUp, PieChart, Network,
  Shield, UserCog, Coins, LayoutDashboard, Clock, StickyNote, User, Wrench,
};

export function getIcon(name) {
  return ICONS[name] || LayoutDashboard;
}

const PortalContext = createContext(null);

/**
 * PortalContext — reaktive Brücke zwischen AuthContext und Portal-UI.
 *
 * Verantwortlichkeiten:
 *  - Ableitung der sichtbaren Navigation aus activeRole + activeTenant
 *  - Routing-Reaktion auf Kontextwechsel (Route → Default, wenn verboten)
 *  - Permission-Helfer (can(permission))
 *  - Re-Render-Trigger bei Login/Logout/Profil-Reload
 *
 * KEIN window.location.reload, KEIN direkter localStorage-Zugriff hier.
 * Alles reaktiv über useAuth() + react-router.
 */
export function PortalProvider({ children }) {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  // ─── Navigations-Bibliothek ────────────────────────────────────────
  // Bewusst NICHT in useMemo ohne t/i18n eingeschlossen — würde stale
  // Strings erzeugen, sobald die Sprache wechselt.
  const ALL_NAV = useMemo(
    () => [
      // Portal-Hauptdashboard
      {
        key: 'portal',
        path: '/portal',
        icon: 'Home',
        roles: ['admin', 'super_admin', 'vendor', 'staff', 'customer', 'affiliate', 'franchiser'],
        label: () => t('portal.nav.dashboard', 'Übersicht'),
        scope: 'all',
      },
      // Vendor-Bereich
      {
        key: 'vendor-dashboard',
        path: '/portal/vendor',
        icon: 'Store',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.vendorDashboard', 'Vendor Dashboard'),
      },
      {
        key: 'vendor-services',
        path: '/portal/services',
        icon: 'Briefcase',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.services', 'Leistungen'),
      },
      {
        key: 'vendor-employees',
        path: '/portal/employees',
        icon: 'Users',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.employees', 'Mitarbeiter'),
      },
      {
        key: 'vendor-calendar',
        path: '/portal/calendar',
        icon: 'CalendarDays',
        roles: ['vendor', 'staff', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.calendar', 'Kalender'),
      },
      {
        key: 'vendor-bookings',
        path: '/portal/bookings',
        icon: 'CalendarCheck',
        roles: ['vendor', 'staff', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.bookings', 'Buchungen'),
      },
      {
        key: 'vendor-customers',
        path: '/portal/customers',
        icon: 'Contact',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.customers', 'Kunden (CRM)'),
      },
      {
        key: 'vendor-resources',
        path: '/portal/resources',
        icon: 'Wrench',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.resources', 'Ressourcen'),
      },
      {
        key: 'vendor-reports',
        path: '/portal/reports',
        icon: 'BarChart3',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.reports', 'Berichte'),
      },
      // Staff-Bereich
      {
        key: 'staff-dashboard',
        path: '/portal/staff',
        icon: 'UserCheck',
        roles: ['staff', 'vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.staffDashboard', 'Mein Arbeitsbereich'),
      },
      {
        key: 'staff-appointments',
        path: '/portal/staff/appointments',
        icon: 'CalendarCheck',
        roles: ['staff', 'admin'],
        requiresTenant: true,
        label: () => t('portal.nav.staffAppointments', 'Termine'),
      },
      {
        key: 'staff-customers',
        path: '/portal/staff/customers',
        icon: 'Contact',
        roles: ['staff', 'admin'],
        requiresTenant: true,
        label: () => t('portal.nav.staffCustomers', 'Kunden'),
      },
      {
        key: 'staff-notes',
        path: '/portal/staff/notes',
        icon: 'StickyNote',
        roles: ['staff', 'admin'],
        requiresTenant: true,
        label: () => t('portal.nav.staffNotes', 'Notizen'),
      },
      {
        key: 'staff-profile',
        path: '/portal/staff/profile',
        icon: 'User',
        roles: ['staff', 'admin'],
        label: () => t('portal.nav.staffProfile', 'Profil'),
      },
      // Customer-Bereich
      {
        key: 'customer-bookings',
        path: '/portal/customer',
        icon: 'CalendarClock',
        roles: ['customer', 'admin', 'super_admin'],
        label: () => t('portal.nav.myBookings', 'Meine Termine'),
      },
      // Affiliate-Bereich
      {
        key: 'affiliate-dashboard',
        path: '/portal/affiliate',
        icon: 'TrendingUp',
        roles: ['affiliate', 'admin', 'super_admin'],
        label: () => t('portal.nav.affiliate', 'Affiliate'),
      },
      {
        key: 'affiliate-reports',
        path: '/portal/affiliate/reports',
        icon: 'PieChart',
        roles: ['affiliate', 'admin', 'super_admin'],
        label: () => t('portal.nav.affiliateReports', 'Provisionen'),
      },
      // Franchiser-Bereich
      {
        key: 'franchise-dashboard',
        path: '/portal/franchise',
        icon: 'Network',
        roles: ['franchiser', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.franchise', 'Franchise'),
      },
      // Admin-Bereich
      {
        key: 'admin-dashboard',
        path: '/portal/admin',
        icon: 'Shield',
        roles: ['admin', 'super_admin'],
        label: () => t('portal.nav.admin', 'Admin'),
      },
      {
        key: 'admin-users',
        path: '/portal/admin/users',
        icon: 'UserCog',
        roles: ['admin', 'super_admin'],
        label: () => t('portal.nav.adminUsers', 'Benutzer'),
      },
      {
        key: 'admin-commission',
        path: '/portal/admin/commission',
        icon: 'Coins',
        roles: ['admin', 'super_admin'],
        label: () => t('portal.nav.commission', 'Provisionen'),
      },
    ],
    // t ist absichtlich NICHT in deps — t ändert sich, sobald i18n sich ändert,
    // und der Memo wird durch die Re-Renders über i18n.language getriggert.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ─── Sichtbare Navigation (reaktiv gefiltert) ──────────────────────
  const navItems = useMemo(() => {
    if (!auth.user) return [];
    const role = auth.activeRole;
    return ALL_NAV.filter((item) => {
      if (item.roles && !item.roles.includes(role)) return false;
      if (item.requiresTenant && !auth.activeTenant && role !== 'admin' && role !== 'super_admin') {
        return false;
      }
      return true;
    }).map((item) => ({
      key: item.key,
      path: item.path,
      // Icon-String → React-Component via zentrales Registry
      icon: getIcon(item.icon),
      label: item.label(),
      active: location.pathname === item.path || location.pathname.startsWith(item.path + '/'),
    }));
    // ALL_NAV ist stabil, t wird via i18n.language in derived getriggert.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user, auth.activeRole, auth.activeTenant, location.pathname, i18n.language]);

  // ─── Default-Route pro Rolle ───────────────────────────────────────
  const defaultRoute = useMemo(() => {
    const role = auth.activeRole;
    if (role === 'admin' || role === 'super_admin') return '/portal/admin';
    if (role === 'vendor') return '/portal/vendor';
    if (role === 'staff') return '/portal/staff';
    if (role === 'customer') return '/portal/customer';
    if (role === 'affiliate') return '/portal/affiliate';
    if (role === 'franchiser') return '/portal/franchise';
    return '/portal';
  }, [auth.activeRole]);

  // ─── Reaktive Route-Korrektur: wenn aktuelle Route für neue Rolle verboten ─
  useEffect(() => {
    if (!auth.user) return;
    // /portal ohne Subroute → defaultRoute
    if (location.pathname === '/portal' || location.pathname === '/portal/') {
      navigate(defaultRoute, { replace: true });
      return;
    }
    // Aktuelle Route in Navigation suchen
    const item = ALL_NAV.find((n) => location.pathname === n.path || location.pathname.startsWith(n.path + '/'));
    if (!item) return; // unbekannte Route → kein Eingriff
    if (!item.roles.includes(auth.activeRole)) {
      navigate(defaultRoute, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.activeRole, auth.activeTenant, auth.user, defaultRoute]);

  // ─── Permission-Helfer ─────────────────────────────────────────────
  const can = useCallback(
    (permission) => {
      if (!auth.user) return false;
      if (auth.permissions.includes('*')) return true;
      if (auth.permissions.includes(permission)) return true;
      // Wildcard: portal:* matcht portal:dashboard etc.
      const [scope] = permission.split(':');
      if (auth.permissions.includes(`${scope}:*`)) return true;
      return false;
    },
    [auth.user, auth.permissions],
  );

  // ─── Convenience-Wrapper für Kontextwechsel mit Cache-Reset ────────
  const switchRole = useCallback(
    async (role) => {
      await auth.setActiveRole(role);
      // Nach erfolgreichem Switch: zusätzlich gefilterte Query-Keys entfernen
      queryClient.removeQueries({ queryKey: ['dashboard'] });
    },
    [auth, queryClient],
  );

  const switchTenant = useCallback(
    async (tenant) => {
      await auth.setActiveTenant(tenant);
      queryClient.removeQueries({ queryKey: ['dashboard'] });
    },
    [auth, queryClient],
  );

  const value = useMemo(
    () => ({
      navItems,
      defaultRoute,
      can,
      switchRole,
      switchTenant,
      isReady: auth.isReady,
    }),
    [navItems, defaultRoute, can, switchRole, switchTenant, auth.isReady],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used inside PortalProvider');
  return ctx;
}
