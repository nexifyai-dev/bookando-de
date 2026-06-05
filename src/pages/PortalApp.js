import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PortalShell } from '../components/layout/PortalShell';
import DashboardPage from './portal/DashboardPage';
import { LayoutDashboard, Settings, User, Bell, HelpCircle } from 'lucide-react';

/**
 * PortalApp — Beispiel für ein geschütztes Portal mit PortalShell
 *
 * Verwendung in App.js:
 *   <Route path="/portal/*" element={<PortalApp />} />
 *
 * Props / Konfiguration:
 *   - navItems: Sidebar-Navigation
 *   - mobileBottomNav: Mobile Bottom-Navigation
 *   - portalName, user, onLogout: PortalShell Props
 */
const navItems = [
  { path: '/portal', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/portal/settings', label: 'Einstellungen', icon: Settings },
];

const mobileBottomNav = [
  { path: '/portal', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/portal/settings', label: 'Einstellungen', icon: Settings },
];

export default function PortalApp() {
  // Beispiel: Dummy-User für die PortalShell
  const dummyUser = {
    full_name: 'Max Mustermann',
    email: 'max@example.de',
    role: 'user',
  };

  const handleLogout = async () => {
    console.log('Logout...');
  };

  return (
    <PortalShell
      portalName="Dashboard"
      navItems={navItems}
      mobileBottomNav={mobileBottomNav}
      user={dummyUser}
      onLogout={handleLogout}
    >
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="settings" element={
          <div className="p-8 text-center text-[var(--color-text-secondary)]">
            <Settings size={32} className="mx-auto mb-4 opacity-40" />
            <p>Einstellungen – hier kommen deine Inhalte hin.</p>
          </div>
        } />
        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    </PortalShell>
  );
}
