import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';

export default function StaffCalendarPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-5">
      <div className="h-14 w-14 flex items-center justify-center bg-[var(--color-surface-sunken)] rounded-full mb-4">
        <CalendarDays size={24} className="text-[var(--color-text-tertiary)]" />
      </div>
      <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-[var(--font-heading)]">
        {t('staff.calendar.title', 'Kalender')}
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-md mb-2">
        {t('staff.calendar.comingSoon', 'Diese Funktion befindet sich in Entwicklung.')}
      </p>
      <p className="text-xs text-[var(--color-text-tertiary)] max-w-sm">
        {t('staff.calendar.hint', 'Mitarbeiter erhalten hier zukünftig ihren persönlichen Tages- und Wochenkalender mit allen zugewiesenen Terminen.')}
      </p>
    </div>
  );
}
