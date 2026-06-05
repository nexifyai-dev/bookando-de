import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { Mail, MapPin, Phone, Send, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ohne Backend: simulierter Versand (Platzhalter)
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div>
      <SEOHead title="Bookando – Kontakt & Beratung" description="Kontaktiere Bookando aus Aachen. Wir beraten dich zu Terminbuchung, Affiliate-Marketing und deiner Dienstleister-Plattform." />
      <PublicNav />

      <main className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--color-shell-bg)' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">

          {/* Section-Header (Template-Standard) */}
          <div className="text-center max-w-[600px] mx-auto mb-14">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-accent)' }}>
              {t('contact.tag', 'Kontakt')}
            </p>
            <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.05]"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {t('contact.title', 'Kontakt & Beratung')}
            </h1>
            <p className="text-[15px] text-[var(--color-text-secondary)] mt-4 leading-relaxed max-w-lg mx-auto">
              {t('contact.subtitle', 'Du hast Fragen zu Bookando? Wir helfen dir gerne weiter – per Formular, Telefon oder E-Mail.')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Linke Spalte: Kontaktdaten */}
            <div className="space-y-6">
              {/* Adresse */}
              <div className="flex items-start gap-4 p-5 rounded-xl"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent-muted)' }}>
                  <MapPin size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{t('contact.address_title', 'Standort')}</h3>
                  <p className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Adalbertsteinweg 1<br />52070 Aachen<br />{t('contact.germany', 'Deutschland')}
                  </p>
                </div>
              </div>

              {/* Telefon */}
              <div className="flex items-start gap-4 p-5 rounded-xl"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent-muted)' }}>
                  <Phone size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{t('contact.phone_title', 'Telefon')}</h3>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    <a href="tel:+4924199032292" className="hover:underline" style={{ color: 'var(--color-primary)' }}>+49 241 990 322 92</a>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                    {t('contact.hours', 'Mo–Fr, 9:00–17:00 Uhr')}
                  </p>
                </div>
              </div>

              {/* E-Mail */}
              <div className="flex items-start gap-4 p-5 rounded-xl"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent-muted)' }}>
                  <Mail size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{t('contact.email_title', 'E-Mail')}</h3>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    <a href="mailto:info@bookando.de" className="hover:underline" style={{ color: 'var(--color-primary)' }}>info@bookando.de</a>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                    {t('contact.response_time', 'Wir antworten innerhalb von 24h')}
                  </p>
                </div>
              </div>

              {/* Öffnungszeiten Info */}
              <div className="p-5 rounded-xl flex items-start gap-3"
                style={{ background: 'var(--color-accent-subtle)', border: '1px solid rgba(196,155,62,0.2)' }}>
                <Clock size={16} style={{ color: 'var(--color-accent)' }} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
                    {t('contact.service_note', 'Hinweis')}
                  </p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {t('contact.service_note_text', 'Du hast bereits ein Konto? Nutze unser Dashboard für direkte Support-Anfragen – so erreicht uns dein Anliegen am schnellsten.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Rechte Spalte: Formular */}
            <div className="rounded-xl p-8"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e1)' }}>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(74,222,128,0.12)' }}>
                    <CheckCircle size={28} style={{ color: '#4ADE80' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                    {t('contact.sent_title', 'Nachricht versendet!')}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {t('contact.sent_desc', 'Wir melden uns innerhalb von 24h bei dir.')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>{t('contact.first_name', 'Vorname')}</label>
                      <input type="text" required placeholder={t('contact.ph_fname', 'Max')}
                        className="w-full h-9 px-3 rounded-md border text-sm bg-white transition-all focus:outline-none focus:ring-2"
                        style={{ borderColor: 'var(--color-divider)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>{t('contact.last_name', 'Nachname')}</label>
                      <input type="text" required placeholder={t('contact.ph_lname', 'Mustermann')}
                        className="w-full h-9 px-3 rounded-md border text-sm bg-white transition-all focus:outline-none focus:ring-2"
                        style={{ borderColor: 'var(--color-divider)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-primary)' }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>{t('auth.email', 'E-Mail')}</label>
                    <input type="email" required placeholder="max@beispiel.de"
                      className="w-full h-9 px-3 rounded-md border text-sm bg-white transition-all focus:outline-none focus:ring-2"
                      style={{ borderColor: 'var(--color-divider)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-primary)' }} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>{t('contact.subject', 'Betreff')}</label>
                    <select className="w-full h-9 px-3 rounded-md border text-sm bg-white transition-all focus:outline-none focus:ring-2"
                      style={{ borderColor: 'var(--color-divider)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-primary)' }}>
                      <option value="general">{t('contact.sub_general', 'Allgemeine Frage')}</option>
                      <option value="sales">{t('contact.sub_sales', 'Vertrieb & Partneranfrage')}</option>
                      <option value="support">{t('contact.sub_support', 'Technischer Support')}</option>
                      <option value="affiliate">{t('contact.sub_affiliate', 'Affiliate-Partnerschaft')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>{t('contact.message', 'Nachricht')}</label>
                    <textarea rows={4} required placeholder={t('contact.ph_msg', 'Deine Nachricht an uns...')}
                      className="w-full px-3 py-2 rounded-md border text-sm bg-white transition-all focus:outline-none focus:ring-2 resize-none"
                      style={{ borderColor: 'var(--color-divider)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-primary)' }} />
                  </div>

                  <button type="submit"
                    className="inline-flex items-center justify-center gap-2 h-10 px-6 text-sm font-semibold rounded-md text-white transition-all hover:opacity-90 w-full"
                    style={{ background: 'var(--color-primary)' }}>
                    <Send size={14} /> {t('contact.submit', 'Nachricht senden')}
                  </button>

                  <p className="text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                    {t('contact.privacy_note', 'Mit dem Absenden stimmst du unserer Datenschutzerklärung zu.')}
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Optional: Quick-Links für häufige Anliegen */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('contact.quick_title', 'Häufige Anliegen')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: t('contact.q_pricing', 'Preise & Pakete'), href: '/pricing' },
                { label: t('contact.q_register', 'Registrierung'), href: '/auth/register' },
                { label: t('contact.q_legal', 'Impressum'), href: '/legal' },
                { label: t('contact.q_support', 'Support'), href: 'mailto:support@bookando.de' },
              ].map((link, i) => (
                <a key={i} href={link.href}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full transition-colors"
                  style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}>
                  {link.label} <ArrowRight size={10} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
