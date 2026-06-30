import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Globe, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, Bell, User, X, LayoutDashboard, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { RoleSwitcher, TenantSwitcher, LanguageSwitcher } from '../portal/PortalSwitchers';

const LANG_OPTIONS = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
];

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 72;

function isItemActive(item, pathname) {
  if (item.exact) return pathname === item.path;
  if (item.matchPaths?.length) return item.matchPaths.some((p) => pathname.startsWith(p));
  return pathname.startsWith(item.path);
}

export function PortalShell({
  children,
  portalName = 'Portal',
  logoHref = '/portal',
  navItems = [
    { path: '/portal', labelKey: 'portal.dashboard', icon: LayoutDashboard, exact: true },
    { path: '/portal/settings', labelKey: 'portal.settings', icon: Settings },
  ],
  mobileBottomNav = [],
  user: userProp = null,
  onLogout,
  dataTestId = 'portal-shell',
  hideLanguageSwitch = false,
  sidebarStorageKey = 'sidebar_collapsed',
  headerContent,
}) {
  const { i18n, t } = useTranslation();
  const { user: authUser, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  const effectiveUser = authUser || userProp || null;
  const effectiveLogout = authLogout || onLogout || null;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem(sidebarStorageKey);
      return stored === null ? true : stored === 'true';
    } catch { return true; }
  });

  useEffect(() => {
    try { localStorage.setItem(sidebarStorageKey, String(collapsed)); } catch {}
  }, [collapsed, sidebarStorageKey]);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  const desktopItems = useMemo(() => navItems.filter((i) => !i.mobileOnly), [navItems]);
  const mobileItems = useMemo(() => navItems.filter((i) => !i.desktopOnly), [navItems]);

  const handleLogout = useCallback(async () => {
    if (effectiveLogout) await effectiveLogout();
    navigate('/');
  }, [effectiveLogout, navigate]);

  const initials = effectiveUser?.full_name?.trim()?.[0]?.toUpperCase() || effectiveUser?.email?.[0]?.toUpperCase() || 'U';
  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <div className="min-h-screen bg-[#F8F9FB]" data-testid={dataTestId}>

      {/* Skip-Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:rounded-lg">
        Zum Hauptinhalt springen
      </a>

      {/* ═══ SIDEBAR (Desktop) ═══ */}
      <aside
        aria-label="Hauptnavigation"
        className="hidden lg:flex flex-col fixed bottom-0 left-0 bg-sidebar border-r border-sidebar-border"
        style={{ top: 0, width: `${sidebarWidth}px`, transition: 'width 200ms ease-out', zIndex: 50 }}
        data-testid={`${dataTestId}-sidebar`}
      >
        {/* Sidebar Logo */}
        <div className="flex items-center h-[72px] px-5 border-b border-sidebar-border shrink-0">
          <Link to={logoHref} className="flex items-center gap-3 min-w-0" data-testid={`${dataTestId}-logo`} aria-label={`${portalName} Startseite`}>
            <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center shrink-0">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-white truncate tracking-tight">{portalName}</span>
            )}
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden" data-testid={`${dataTestId}-sidebar-nav`}>
          {desktopItems.map((item) => {
            const active = isItemActive(item, location.pathname);
            const Icon = item.icon || User;
            return (
              <Link key={item.path} to={item.path}
                data-testid={`${dataTestId}-sidebar-${item.testId || (item.label || item.labelKey || 'link').toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`}
                title={collapsed ? (item.label || (item.labelKey ? t(item.labelKey) : '')) : undefined}
                className={`group flex items-center gap-3 text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-brand/[0.12] text-brand rounded-lg'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-bright rounded-lg'
                }`}
                style={{
                  padding: collapsed ? '10px 0' : '10px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  minHeight: '42px',
                  ...(active ? { borderLeft: '3px solid #3C50E0' } : {}),
                }}>
                <Icon size={18} className={`shrink-0 ${active ? 'text-brand' : 'text-sidebar-text group-hover:text-sidebar-text-bright'}`} />
                {!collapsed && <span className="truncate whitespace-nowrap">{item.label || (item.labelKey ? t(item.labelKey) : '')}</span>}
                {!collapsed && item.badge > 0 && (
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 bg-danger/20 text-danger"
                  >{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-3">
          <button type="button" onClick={() => setCollapsed((c) => !c)}
            data-testid={`${dataTestId}-sidebar-toggle`}
            title={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
            className="cursor-pointer flex items-center gap-3 w-full text-xs font-medium text-sidebar-text hover:text-sidebar-text-bright hover:bg-sidebar-hover rounded-lg transition-all"
            style={{
              padding: collapsed ? '10px 0' : '10px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              minHeight: '40px',
            }}>
            {collapsed ? <PanelLeftOpen size={16} className="shrink-0" /> : <PanelLeftClose size={16} className="shrink-0" />}
            {!collapsed && <span className="whitespace-nowrap">Einklappen</span>}
          </button>
        </div>
      </aside>

      {/* ═══ TOPBAR ═══ */}
      <header
        className="fixed top-0 right-0 h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-6 gap-4"
        style={{ left: `${sidebarWidth}px`, transition: 'left 200ms ease-out', zIndex: 40 }}
        data-testid={`${dataTestId}-topbar`}
        aria-label="Kopfzeile"
      >
        {/* Left: Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full max-w-xs">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder={t('common.search', 'Suchen...')}
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Header Content (e.g. NotificationBell) */}
          {headerContent && <div className="hidden sm:block">{headerContent}</div>}

          {/* Notification bell placeholder */}
          <button type="button" className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors" aria-label="Benachrichtigungen">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
          </button>

          {/* Switchers */}
          <div className="hidden md:flex items-center gap-2">
            <RoleSwitcher />
            <TenantSwitcher />
            {!hideLanguageSwitch && <LanguageSwitcher />}
          </div>

          {/* User menu */}
          {effectiveUser && (
            <div className="hidden md:block relative ml-2" ref={userMenuRef}>
              <button type="button" onClick={() => setUserMenuOpen((o) => !o)}
                aria-haspopup="menu" aria-expanded={userMenuOpen} aria-controls="user-dropdown-menu"
                className="cursor-pointer flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                data-testid={`${dataTestId}-user-menu-button`}>
                <div className="h-9 w-9 flex items-center justify-center bg-brand text-xs font-bold text-white rounded-full">{initials}</div>
                <div className="hidden xl:block text-left min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">{effectiveUser?.full_name || effectiveUser?.email}</p>
                  <p className="text-[11px] text-gray-400 truncate max-w-[120px]">{effectiveUser?.role || ''}</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {userMenuOpen && (
                <div id="user-dropdown-menu" role="menu" className="absolute right-0 top-[calc(100%+8px)] min-w-[240px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                  style={{ zIndex: 90 }} data-testid={`${dataTestId}-user-dropdown`}>
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">{effectiveUser?.full_name || effectiveUser?.email}</p>
                    <p className="text-xs text-gray-400">{effectiveUser?.email}</p>
                  </div>
                  <div className="py-1">
                    <button type="button" onClick={effectiveLogout} data-testid={`${dataTestId}-logout-button`}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-danger transition-colors">
                      <LogOut size={16} /> {t('portal.logout', 'Abmelden')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile toggle */}
          <button type="button" onClick={() => setMobileOpen((o) => !o)}
            className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden transition-colors"
            data-testid={`${dataTestId}-mobile-toggle`}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ═══ MOBILE OVERLAY ═══ */}
      {mobileOpen && (
        <div className="fixed inset-0 lg:hidden" style={{ zIndex: 65 }} data-testid={`${dataTestId}-mobile-menu`}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-sidebar overflow-y-auto animate-slide-up"
            style={{ boxShadow: 'var(--shadow-e3)' }}>
            {/* Mobile Logo */}
            <div className="flex items-center h-[72px] px-5 border-b border-sidebar-border shrink-0">
              <Link to={logoHref} className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
                  <LayoutDashboard size={18} className="text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">{portalName}</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="ml-auto text-sidebar-text hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Mobile User */}
            {effectiveUser && (
              <div className="px-5 py-4 border-b border-sidebar-border flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-brand text-sm font-bold text-white rounded-full shrink-0">{initials}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{effectiveUser?.full_name || effectiveUser?.email}</p>
                  <p className="truncate text-xs text-sidebar-text">{effectiveUser?.email}</p>
                </div>
              </div>
            )}

            {/* Mobile Language */}
            {!hideLanguageSwitch && (
              <div className="px-5 py-3 border-b border-sidebar-border flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-sidebar-text"><Globe size={14} /> Sprache</span>
                <div className="flex gap-1.5">
                  {LANG_OPTIONS.map((lang) => (
                    <button key={lang.code} type="button" onClick={() => i18n.changeLanguage(lang.code)}
                      data-testid={`${dataTestId}-mobile-lang-${lang.code}`}
                      className={`cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${i18n.language === lang.code ? 'bg-brand text-white' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'}`}>
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Nav */}
            <nav className="p-3 space-y-1">
              {mobileItems.map((item) => {
                const active = isItemActive(item, location.pathname);
                const Icon = item.icon || User;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                    data-testid={`${dataTestId}-mobile-nav-${item.testId || (item.label || item.labelKey || 'link').toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      active ? 'bg-brand/[0.12] text-brand' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                    }`}>
                    <Icon size={18} className="shrink-0" />
                    <span>{item.label || (item.labelKey ? t(item.labelKey) : '')}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            {effectiveUser && (
              <div className="p-3 border-t border-sidebar-border">
                <button type="button" onClick={effectiveLogout} data-testid={`${dataTestId}-mobile-logout-button`}
                  className="flex w-full items-center justify-center gap-2 border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm font-medium text-danger rounded-lg hover:bg-danger/20 transition-colors">
                  <LogOut size={14} /> {t('portal.logout', 'Abmelden')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <main id="main-content"
        className="min-h-screen transition-all duration-200"
        style={{ marginLeft: `${sidebarWidth}px`, paddingTop: '92px', paddingBottom: mobileBottomNav.length ? '96px' : '32px' }}
      >
        <div className="px-4 sm:px-6 lg:px-8 mx-auto" style={{ maxWidth: '1400px' }}>
          {children || <Outlet />}
        </div>
      </main>

      {/* ═══ BOTTOM NAV (Mobile) ═══ */}
      {mobileBottomNav.length > 0 && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around h-16 lg:hidden"
          style={{ zIndex: 50 }} data-testid={`${dataTestId}-bottom-nav`}>
          {mobileBottomNav.map((item) => {
            const active = isItemActive(item, location.pathname);
            const Icon = item.icon || User;
            return (
              <Link key={item.path} to={item.path}
                data-testid={`${dataTestId}-bottom-nav-${item.testId || (item.label || item.labelKey || 'link').toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`}
                className={`flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-medium transition-colors ${
                  active ? 'text-brand' : 'text-gray-400'
                }`}>
                <Icon size={20} />
                <span>{item.label || (item.labelKey ? t(item.labelKey) : '')}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
