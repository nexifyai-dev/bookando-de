import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare, Loader2, AlertCircle, Send, CreditCard,
  Phone, CheckCircle, XCircle, ChevronDown, ChevronUp,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';

const SMS_EVENTS = [
  { key: 'booking_confirmed', label: 'vendor.sms.event_booking_confirmed', fallback: 'Buchung bestätigt' },
  { key: 'booking_reminder', label: 'vendor.sms.event_booking_reminder', fallback: 'Termin-Erinnerung' },
  { key: 'booking_cancelled', label: 'vendor.sms.event_booking_cancelled', fallback: 'Buchung storniert' },
  { key: 'booking_rescheduled', label: 'vendor.sms.event_booking_rescheduled', fallback: 'Termin verschoben' },
  { key: 'payment_received', label: 'vendor.sms.event_payment_received', fallback: 'Zahlung erhalten' },
];

const DEFAULT_TEMPLATES = {
  booking_confirmed: 'Ihre Buchung bei {{business_name}} am {{date}} um {{time}} wurde bestätigt. Service: {{service}}.',
  booking_reminder: 'Erinnerung: Ihr Termin bei {{business_name}} ist morgen um {{time}}. Service: {{service}}.',
  booking_cancelled: 'Ihre Buchung bei {{business_name}} am {{date}} wurde storniert.',
  booking_rescheduled: 'Ihr Termin bei {{business_name}} wurde verschoben auf {{date}} um {{time}}.',
  payment_received: 'Zahlung von {{amount}} für {{service}} erhalten. Vielen Dank!',
};

export default function VendorSMSNotificationsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    enabled: true,
    sender_id: '',
    credits: 0,
    events: {},
  });
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [testPhone, setTestPhone] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/api/vendor/sms-settings');
      if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
      if (data.templates) setTemplates(prev => ({ ...prev, ...data.templates }));
    } catch (err) {
      setError(err.response?.data?.message || t('vendor.sms.load_error', 'Fehler beim Laden der SMS-Einstellungen.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function toggleEvent(eventKey) {
    setSettings(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [eventKey]: !(prev.events?.[eventKey] ?? true),
      },
    }));
  }

  function updateTemplate(eventKey, value) {
    setTemplates(prev => ({ ...prev, [eventKey]: value }));
  }

  async function handleTestSMS() {
    if (!testPhone.trim()) return;
    setTestSending(true);
    setTestResult(null);
    try {
      const { data } = await apiClient.post('/api/vendor/sms-settings', {
        action: 'test',
        phone: testPhone,
      });
      setTestResult({ success: true, message: data.message || t('vendor.sms.test_success', 'Test-SMS erfolgreich gesendet!') });
    } catch (err) {
      setTestResult({ success: false, message: err.response?.data?.message || t('vendor.sms.test_failed', 'Test-SMS konnte nicht gesendet werden.') });
    } finally {
      setTestSending(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiClient.put('/api/vendor/sms-settings', { settings, templates });
    } catch {
      // ponytail: toast
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 bg-danger-light rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={24} className="text-danger" />
        </div>
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <button onClick={fetchData}
          className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          {t('common.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">
          {t('vendor.sms.title', 'SMS-Benachrichtigungen')}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {t('vendor.sms.subtitle', 'Konfigurieren Sie SMS-Vorlagen und Benachrichtigungsereignisse.')}
        </p>
      </div>

      {/* Credit balance */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <CreditCard size={20} className="text-brand" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{t('vendor.sms.credits', 'SMS-Guthaben')}</h3>
              <p className="text-xs text-gray-400">{t('vendor.sms.credits_desc', 'Verfügbare SMS-Credits für Benachrichtigungen.')}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">{settings.credits ?? 0}</span>
            <p className="text-xs text-gray-400">{t('vendor.sms.credits_label', 'Credits')}</p>
          </div>
        </div>
      </div>

      {/* Sender ID */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <Phone size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">
            {t('vendor.sms.sender_id_title', 'Absender-ID')}
          </h2>
        </div>
        <input
          type="text"
          value={settings.sender_id || ''}
          onChange={(e) => setSettings(prev => ({ ...prev, sender_id: e.target.value }))}
          placeholder={t('vendor.sms.sender_id_placeholder', 'z.B. FirmaName (max. 11 Zeichen)')}
          maxLength={11}
          className="w-full max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <p className="text-xs text-gray-400 mt-2">
          {t('vendor.sms.sender_id_hint', 'Wird als Absendername angezeigt. Nur alphanumerische Zeichen, max. 11 Zeichen.')}
        </p>
      </div>

      {/* Master toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <MessageSquare size={18} className="text-gray-400" />
            <div>
              <span className="text-sm font-bold text-gray-900">
                {t('vendor.sms.master_toggle', 'SMS-Benachrichtigungen aktivieren')}
              </span>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('vendor.sms.master_toggle_desc', 'Alle SMS-Benachrichtigungen ein- oder ausschalten.')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`relative w-11 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-brand' : 'bg-gray-200'}`}
            role="switch"
            aria-checked={settings.enabled}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.enabled ? 'translate-x-5' : ''}`} />
          </button>
        </label>
      </div>

      {/* SMS event templates */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t('vendor.sms.events_title', 'SMS-Vorlagen pro Ereignis')}
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {SMS_EVENTS.map((ev) => {
            const isEnabled = settings.events?.[ev.key] ?? true;
            const isExpanded = expandedEvent === ev.key;

            return (
              <div key={ev.key}>
                <div className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/80 transition-colors">
                  <button
                    onClick={() => setExpandedEvent(isExpanded ? null : ev.key)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {t(ev.label, ev.fallback)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={14} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleEvent(ev.key)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${isEnabled ? 'bg-brand' : 'bg-gray-200'}`}
                    role="switch"
                    aria-checked={isEnabled}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isEnabled ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                {isExpanded && (
                  <div className="px-5 pb-4">
                    <textarea
                      value={templates[ev.key] || ''}
                      onChange={(e) => updateTemplate(ev.key, e.target.value)}
                      rows={3}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none"
                    />
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      {t('vendor.sms.template_vars', 'Variablen')}: {'{{business_name}}'}, {'{{date}}'}, {'{{time}}'}, {'{{service}}'}, {'{{amount}}'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Test SMS */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <Send size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">
            {t('vendor.sms.test_title', 'SMS testen')}
          </h2>
        </div>
        <div className="flex items-start gap-3">
          <input
            type="tel"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder={t('vendor.sms.test_placeholder', '+49 170 1234567')}
            className="flex-1 max-w-xs text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <button
            onClick={handleTestSMS}
            disabled={testSending || !testPhone.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50"
          >
            {testSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {t('vendor.sms.test_send', 'Senden')}
          </button>
        </div>
        {testResult && (
          <div className={`flex items-center gap-2 mt-3 px-4 py-2.5 rounded-lg text-sm ${testResult.success ? 'bg-success-light text-success-dark' : 'bg-danger-light text-danger-dark'}`}>
            {testResult.success ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {testResult.message}
          </div>
        )}
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
        {saving && <Loader2 size={16} className="animate-spin" />}
        {t('common.save', 'Speichern')}
      </button>
    </div>
  );
}
