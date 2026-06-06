import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePortal } from '../../contexts/PortalContext';
import { ChevronDown, Check, UserCog, Building2, Languages, Loader2 } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   ROLE-SWITCHER
   ════════════════════════════════════════════════════════════════
   Zeigt alle Rollen aus user.availableRoles.
   Klick auf Rolle → setActiveRole() → AuthContext re-rendert
   automatisch Header, Sidebar, Dashboard, Route.
   KEIN window.location.reload.
   ════════════════════════════════════════════════════════════════ */
const ROLE_LABELS_DE = {
  customer:   'Kunde',
  vendor:     'Anbieter',
  staff:      'Mitarbeiter',
  affiliate:  'Affiliate',
  franchiser: 'Franchise-Partner',
  admin:      'Admin',
  super_admin:'Super-Admin',
};

const ROLE_LABELS_EN = {
  customer:   'Customer',
  vendor:     'Vendor',
  staff:      'Staff',
  affiliate:  'Affiliate',
  franchiser: 'Franchise partner',
  admin:      'Admin',
  super_admin:'Super-admin',
};

export function RoleSwitcher() {
  const { activeRole, availableRoles, setActiveRole } = useAuth();
  const { switchRole } = usePortal();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);
  const ref = useRef(null);

  // Schließen bei Klick außerhalb
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const labels = i18n.language?.startsWith('de') ? ROLE_LABELS_DE : ROLE_LABELS_EN;

  const onPick = useCallback(
    async (role) => {
      if (role === activeRole) {
        setOpen(false);
        return;
      }
      setPending(role);
      setError(null);
      try {
        await switchRole(role);
        setOpen(false);
      } catch (e) {
        setError(e?.response?.data?.detail || e.message || 'Switch fehlgeschlagen');
      } finally {
        setPending(null);
      }
    },
    [activeRole, switchRole],
  );

  // Nur anzeigen, wenn User mehr als eine Rolle hat
  if (!availableRoles || availableRoles.length < 2) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-testid="role-switcher-trigger"
        className="flex items-center gap-2 px-3 h-9 rounded-md text-sm font-medium transition-colors"
        style={{
          background: open ? 'var(--color-surface-hover)' : 'transparent',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-divider)',
        }}
      >
        <UserCog size={16} />
        <span>{labels[activeRole] || activeRole}</span>
        <ChevronDown size={14} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-lg shadow-xl z-50"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-divider)',
          }}
        >
          <div className="p-2">
            <p className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold"
               style={{ color: 'var(--color-text-tertiary)' }}>
              Rolle wechseln
            </p>
            {availableRoles.map((role) => {
              const isActive = role === activeRole;
              const isPending = pending === role;
              return (
                <button
                  key={role}
                  type="button"
                  disabled={!!pending}
                  onClick={() => onPick(role)}
                  data-testid={`role-switcher-option-${role}`}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left transition-colors hover:bg-[var(--color-surface-hover)] disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isActive ? (
                    <Check size={14} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <span className="w-3.5" />
                  )}
                  <span className="flex-1 font-medium">{labels[role] || role}</span>
                </button>
              );
            })}
            {error && (
              <p className="px-3 py-2 text-[12px]" style={{ color: 'var(--color-danger)' }}>
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TENANT-SWITCHER
   ════════════════════════════════════════════════════════════════
   Wechselt zwischen mehreren Vendor-/Mandanten-Kontexten.
   z. B. ein Vendor-User, der mehrere Salons betreibt.
   ════════════════════════════════════════════════════════════════ */
export function TenantSwitcher() {
  const { activeTenant, availableTenants, setActiveTenant } = useAuth();
  const { switchTenant } = usePortal();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const onPick = useCallback(
    async (tenant) => {
      setPending(true);
      setError(null);
      try {
        await switchTenant(tenant);
        setOpen(false);
      } catch (e) {
        setError(e?.response?.data?.detail || e.message || 'Switch fehlgeschlagen');
      } finally {
        setPending(false);
      }
    },
    [switchTenant],
  );

  // Nur anzeigen, wenn mehr als 1 Tenant
  if (!availableTenants || availableTenants.length < 2) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-testid="tenant-switcher-trigger"
        className="flex items-center gap-2 px-3 h-9 rounded-md text-sm font-medium transition-colors"
        style={{
          background: open ? 'var(--color-surface-hover)' : 'transparent',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-divider)',
        }}
      >
        <Building2 size={16} />
        <span className="max-w-[140px] truncate">
          {activeTenant?.name || activeTenant?.vendor_id?.slice(0, 8) || 'Tenant'}
        </span>
        <ChevronDown size={14} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-lg shadow-xl z-50"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-divider)',
          }}
        >
          <div className="p-2">
            <p className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold"
               style={{ color: 'var(--color-text-tertiary)' }}>
              Tenant wechseln
            </p>
            {availableTenants.map((tenant) => {
              const isActive = (activeTenant?.vendor_id && tenant.vendor_id === activeTenant.vendor_id);
              return (
                <button
                  key={tenant.vendor_id}
                  type="button"
                  disabled={pending}
                  onClick={() => onPick(tenant)}
                  data-testid={`tenant-switcher-option-${tenant.vendor_id}`}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left transition-colors hover:bg-[var(--color-surface-hover)] disabled:opacity-50"
                >
                  {isActive ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <span className="w-3.5" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tenant.name || tenant.vendor_id}</p>
                    {tenant.role && (
                      <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        {tenant.role}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
            {error && (
              <p className="px-3 py-2 text-[12px]" style={{ color: 'var(--color-danger)' }}>
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   LANGUAGE-SWITCHER
   ════════════════════════════════════════════════════════════════
   Wechselt zwischen DE/EN. i18n.changeLanguage triggert
   automatisch re-render in allen Komponenten, die t() nutzen.
   KEIN window.location.reload.
   ════════════════════════════════════════════════════════════════ */
export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = (i18n.language || 'de').slice(0, 2).toUpperCase();
  const options = [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
  ];

  const onPick = (code) => {
    if (i18n.language !== code) i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-testid="language-switcher-trigger"
        className="flex items-center gap-2 px-3 h-9 rounded-md text-sm font-medium transition-colors"
        style={{
          background: open ? 'var(--color-surface-hover)' : 'transparent',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-divider)',
        }}
      >
        <Languages size={16} />
        <span>{current}</span>
        <ChevronDown size={14} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-lg shadow-xl z-50"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-divider)',
          }}
        >
          <div className="p-2">
            {options.map((o) => {
              const isActive = i18n.language?.startsWith(o.code);
              return (
                <button
                  key={o.code}
                  type="button"
                  onClick={() => onPick(o.code)}
                  data-testid={`language-switcher-option-${o.code}`}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[var(--color-surface-hover)]"
                >
                  {isActive ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <span className="w-3.5" />}
                  <span className="flex-1 text-left font-medium">{o.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
