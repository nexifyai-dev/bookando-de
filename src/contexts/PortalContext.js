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
  Shield, UserCog, Coins, LayoutDashboard, Clock, StickyNote, User, Wrench, Heart, Wallet,
  ArrowUpRight, Sparkles, FileText, CalendarOff, Globe,
  RefreshCw, Video, MessageSquare, Share2,
} from 'lucide-react';

/**
 * Zentrales Icon-Registry: Schlüssel-Name → React-Component.
 * Wird sowohl in PortalContext (für navItems) als auch in den
 * RoleSwitcher- und TenantSwitcher-Komponenten verwendet.
 */
const ICONS = {
  Home, Store, Briefcase, Users, CalendarDays, CalendarCheck, Contact,
  BarChart3, UserCheck, CalendarClock, TrendingUp, PieChart, Network,
  Shield, UserCog, Coins, LayoutDashboard, Clock, StickyNote, User, Wrench, Heart, Wallet,
  ArrowUpRight,
  RefreshCw, Video, MessageSquare, Share2,
  Sparkles, FileText, CalendarOff, Globe,
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
      {
        key: 'vendor-extras',
        path: '/portal/extras',
        icon: 'Sparkles',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.extras', 'Zusatzleistungen'),
      },
      {
        key: 'vendor-booking-form',
        path: '/portal/booking-form',
        icon: 'FileText',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.bookingForm', 'Buchungsformular'),
      },
      {
        key: 'vendor-special-days',
        path: '/portal/special-days',
        icon: 'CalendarDays',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.specialDays', 'Sondertage'),
      },
      {
        key: 'vendor-days-off',
        path: '/portal/days-off',
        icon: 'CalendarOff',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.daysOff', 'Betriebsruhe'),
      },
      {
        key: 'vendor-timezone',
        path: '/portal/timezone',
        icon: 'Globe',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.timezone', 'Zeitzone'),
      },
      {
        key: 'vendor-payout-request',
        path: '/portal/payout-request',
        icon: 'ArrowUpRight',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.payoutRequest', 'Auszahlungen'),
      },
      {
        key: 'vendor-deposit-settings',
        path: '/portal/deposit-settings',
        icon: 'Wallet',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.depositSettings', 'Anzahlungen'),
      },
      {
        key: 'vendor-taxes',
        path: '/portal/taxes',
        icon: 'Receipt',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.taxes', 'Steuern'),
      },
      {
        key: 'vendor-employee-commission',
        path: '/portal/employee-commission',
        icon: 'DollarSign',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.commission', 'Provisionen'),
      },
      {
        key: 'vendor-group-booking',
        path: '/portal/group-booking',
        icon: 'Users',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.groupBooking', 'Gruppenbuchungen'),
      },
        {
        key: 'vendor-calendar-sync',
        path: '/portal/calendar-sync',
        icon: 'RefreshCw',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.calendarSync', 'Kalender-Sync'),
        },
        {
        key: 'vendor-video',
        path: '/portal/video-integrations',
        icon: 'Video',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.videoIntegrations', 'Video-Integrationen'),
        },
        {
        key: 'vendor-sms',
        path: '/portal/sms-notifications',
        icon: 'MessageSquare',
        roles: ['vendor', 'admin', 'super_admin'],
        requiresTenant: true,
        label: () => t('portal.nav.smsNotifications', 'SMS-Benachrichtigungen'),
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
      {
        key: 'customer-favorites',
        path: '/portal/favorites',
        icon: 'Heart',
        roles: ['customer', 'admin', 'super_admin'],
        label: () => t('portal.nav.favorites', 'Favoriten'),
      },
      {
        key: 'customer-wallet',
        path: '/portal/wallet',
        icon: 'Wallet',
        roles: ['customer', 'admin', 'super_admin'],
        label: () => t('portal.nav.wallet', 'Wallet'),
        },
        {
        key: 'customer-share',
        path: '/portal/share',
        icon: 'Share2',
        roles: ['customer', 'admin', 'super_admin'],
        label: () => t('portal.nav.share', 'Termin teilen'),
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
