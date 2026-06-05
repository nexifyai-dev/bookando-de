import React from 'react';
import { useTranslation } from 'react-i18next';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PublicNav />
      <main className="pt-24 pb-16 min-h-screen bg-[var(--color-shell-bg)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-3 font-[var(--font-heading)]">
              {t('contact.title', 'Kontakt')}
            </h1>
            <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
              {t('contact.subtitle', 'Wir sind für dich da. Schreib uns einfach!')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent-muted)' }}>
                  <MapPin size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{t('contact.address', 'Adresse')}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">Adalbertsteinweg 1<br/>52070 Aachen</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent-muted)' }}>
                  <Phone size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{t('contact.phone', 'Telefon')}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">+49 241 990 322 92</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent-muted)' }}>
                  <Mail size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{t('contact.email', 'E-Mail')}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">info@affilinet-aachen.de</p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-divider)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-e1)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">{t('contact.name', 'Name')}</label>
                  <input type="text" className="w-full h-[42px] px-3 rounded-[var(--radius-sm)] border border-[var(--color-divider)] bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">{t('auth.email', 'E-Mail')}</label>
                  <input type="email" className="w-full h-[42px] px-3 rounded-[var(--radius-sm)] border border-[var(--color-divider)] bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-1.5">{t('contact.message', 'Nachricht')}</label>
                  <textarea rows={5} className="w-full px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-divider)] bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 transition-all resize-none" />
                </div>
                <button type="button" className="inline-flex items-center gap-2 h-[44px] px-6 bg-[var(--color-primary)] text-white font-semibold text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity">
                  <Send size={14} /> {t('common.submit', 'Absenden')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
