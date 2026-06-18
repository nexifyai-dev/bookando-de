import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Shield, MapPin } from 'lucide-react';

export default function StaffProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-[var(--color-text-tertiary)]">
        {t('staff.profile.notAvailable', 'Profil nicht verfügbar')}
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)] mb-6">{t('staff.profile.title', 'Profil')}</h1>
      <div className="bg-white border border-[var(--color-divider-subtle)]" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div className="px-5 py-6 border-b border-[var(--color-divider-subtle)] flex items-center gap-4">
          <div className="h-14 w-14 flex items-center justify-center bg-[var(--color-primary)] text-lg font-bold text-white" style={{ borderRadius: 'var(--radius-full)' }}>
            {(user.full_name || user.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--color-text-primary)]">{user.full_name || 'Mitarbeiter'}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">{user.email}</p>
          </div>
        </div>
        <div className="divide-y divide-[var(--color-divider-subtle)]">
          {[
            { icon: Mail, label: t('staff.profile.email', 'E-Mail'), value: user.email },
            { icon: Shield, label: t('staff.profile.role', 'Rolle'), value: user.role || 'staff' },
            { icon: MapPin, label: t('staff.profile.location', 'Standort'), value: user.location_name || '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-5 py-3.5">
              <Icon size={16} className="text-[var(--color-text-tertiary)] shrink-0" />
              <span className="text-xs text-[var(--color-text-tertiary)] w-20 shrink-0">{label}</span>
              <span className="text-sm text-[var(--color-text-primary)]">{value || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
