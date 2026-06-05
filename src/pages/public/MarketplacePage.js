import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';

export default function MarketplacePage() {
  const { t } = useTranslation();

  return (
    <div>
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-3 font-[var(--font-heading)]">
              {t('marketplace.title', 'Marktplatz')}
            </h1>
            <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
              {t('marketplace.subtitle', 'Finde die besten Dienstleistungen und Angebote in Aachen.')}
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
              <input type="text" placeholder={t('marketplace.search_placeholder', 'Suche nach Dienstleistungen...')}
                className="w-full h-[52px] pl-12 pr-4 rounded-[var(--radius-md)] border border-[var(--color-divider)] bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 transition-all shadow-[var(--shadow-e1)]" />
            </div>
          </div>

          {/* Placeholder for vendor cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-[var(--color-divider)] rounded-[var(--radius-lg)] p-6 bg-[var(--color-surface)] hover:shadow-[var(--shadow-e2)] transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-[var(--radius-sm)] flex items-center justify-center bg-[var(--color-primary-muted)]">
                    <Star size={20} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">Anbieter {i}</h3>
                    <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1">
                      <MapPin size={11} /> Aachen
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                  Beschreibung des Anbieters und seiner Dienstleistungen.
                </p>
                <Link to="/auth/login" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                  {t('common.more', 'Mehr')} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
