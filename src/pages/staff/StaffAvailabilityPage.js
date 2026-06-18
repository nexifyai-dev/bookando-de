import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';

export default function StaffAvailabilityPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-5">
      <div className="h-14 w-14 flex items-center justify-center bg-[var(--color-surface-sunken)] rounded-full mb-4">
        <Clock size={24} className="text-[var(--color-text-tertiary)]" />
      </div>
      <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-[var(--font-heading)]">
        {t('staff.availability.title', 'Verfügbarkeit')}
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-md mb-2">
        {t('staff.availability.comingSoon', 'Diese Funktion befindet sich in Entwicklung.')}
      </p>
      <p className="text-xs text-[var(--color-text-tertiary)] max-w-sm">
        {t('staff.availability.hint', 'Mitarbeiter können hier zukünftig ihre Arbeitszeiten, Abwesenheiten und Pausenzeiten verwalten.')}
      </p>
    </div>
  );
}
