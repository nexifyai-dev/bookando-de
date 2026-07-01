import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, ChevronDown, ChevronUp, Send, Loader2, HelpCircle, BookOpen, CreditCard,
  UserCircle, Settings, Wrench,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';

const SECTIONS = [
  { key: 'getting_started', icon: BookOpen },
  { key: 'bookings', icon: HelpCircle },
  { key: 'payments', icon: CreditCard },
  { key: 'account', icon: UserCircle },
  { key: 'technical', icon: Wrench },
];

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/80 transition-colors">
        <span className="text-sm font-medium text-gray-800 pr-4">{question}</span>
        {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpCenterPage() {
  const { t } = useTranslation();
  const [faq, setFaq] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openItems, setOpenItems] = useState({});
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/api/help/faq');
        if (!cancelled) setFaq(data || {});
      } catch {
        if (!cancelled) setFaq({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function toggleItem(sectionKey, idx) {
    const key = `${sectionKey}-${idx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleContact(e) {
    e.preventDefault();
    setSending(true);
    try {
      await apiClient.post('/api/help/contact', contactForm);
      setSent(true);
      setContactForm({ name: '', email: '', message: '' });
    } catch {
      // ponytail: toast
    } finally {
      setSending(false);
    }
  }

  // Filter FAQ by search
  const searchLower = search.toLowerCase();
  const filteredSections = SECTIONS.map(section => ({
    ...section,
    items: (faq[section.key] || []).filter(item =>
      !searchLower || item.question?.toLowerCase().includes(searchLower) || item.answer?.toLowerCase().includes(searchLower)
    ),
  })).filter(s => s.items.length > 0);

  // Fallback if no API data
  const hasData = filteredSections.some(s => s.items.length > 0);
  const displaySections = hasData ? filteredSections : SECTIONS.map(s => ({
    ...s,
    items: [{ question: t(`help.faq.${s.key}_q1`, 'Placeholder'), answer: t(`help.faq.${s.key}_a1`, 'Antwort folgt.') }],
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-title-lg mb-2">{t('help.title', 'Hilfe-Center')}</h1>
          <p className="text-white/80 mb-8">{t('help.subtitle', 'Wie können wir Ihnen helfen?')}</p>
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder={t('help.search_placeholder', 'Suchbegriff eingeben...')} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* FAQ Sections */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-brand" />
          </div>
        ) : (
          <div className="space-y-8 mb-16">
            {displaySections.map(({ key, icon: Icon, items }) => (
              <div key={key}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={18} className="text-brand" />
                  <h2 className="text-lg font-bold text-gray-900">{t(`help.section.${key}`, key.replace(/_/g, ' '))}</h2>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {items.map((item, idx) => (
                    <AccordionItem key={idx} question={item.question} answer={item.answer}
                      isOpen={openItems[`${key}-${idx}`]} onToggle={() => toggleItem(key, idx)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Form */}
        <div className="max-w-xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">{t('help.contact_title', 'Kontaktieren Sie uns')}</h2>
          {sent ? (
            <div className="bg-success-light rounded-xl p-6 text-center">
              <p className="text-sm text-success-dark font-semibold">{t('help.contact_sent', 'Nachricht gesendet! Wir melden uns in Kürze.')}</p>
            </div>
          ) : (
            <form onSubmit={handleContact} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('help.contact_name', 'Name')}</label>
                <input type="text" required value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('help.contact_email', 'E-Mail')}</label>
                <input type="email" required value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('help.contact_message', 'Nachricht')}</label>
                <textarea required rows={4} value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {t('help.contact_send', 'Nachricht senden')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
