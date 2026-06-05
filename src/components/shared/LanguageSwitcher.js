import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();

  const switchLang = () => {
    const next = i18n.language === 'de' ? 'en' : 'de';
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={switchLang}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold rounded-[var(--radius-xs)] border border-[var(--color-divider)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] transition-colors ${className}`}
      data-testid="language-switcher"
      aria-label={`Sprache wechseln zu ${i18n.language === 'de' ? 'Englisch' : 'Deutsch'}`}
    >
      <Globe size={12} />
      {i18n.language === 'de' ? 'EN' : 'DE'}
    </button>
  );
}
