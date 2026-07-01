import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Loader2, AlertCircle, Moon } from 'lucide-react';
import apiClient from '../../lib/apiClient';

const EVENT_TYPES = ['new_booking', 'booking_cancelled', 'payment_received', 'review_posted', 'low_stock', 'affiliate_signup'];
const CHANNELS = ['email', 'sms', 'push'];

const defaultSettings = () => {
  const s = { quiet_start: '22:00', quiet_end: '07:00', quiet_enabled: false };
  EVENT_TYPES.forEach(ev => {
    s[ev] = { email: true, sms: false, push: true };
  });
  return s;
};

export default function VendorNotificationSettingsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/api/vendor/notification-settings');
        if (!cancelled) setSettings(prev => ({ ...prev, ...data }));
      } catch (err) {
        if (!cancelled) setError(err.message || t('vendor.notifications.load_error', 'Fehler beim Laden.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [t]);

  function toggle(eventType, channel) {
    setSettings(prev => ({
      ...prev,
      [eventType]: { ...prev[eventType], [channel]: !prev[eventType]?.[channel] },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiClient.put('/api/vendor/notification-settings', settings);
    } catch {
      // ponytail: toast
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-brand" /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle size={40} className="text-danger mb-4" /><p className="text-sm text-gray-600">{error}</p>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">{t('vendor.notifications.title', 'Benachrichtigungseinstellungen')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('vendor.notifications.subtitle', 'Legen Sie fest, wie Sie benachrichtigt werden möchten.')}</p>
      </div>

      {/* Toggle Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('vendor.notifications.event', 'Ereignis')}</span>
                </th>
                {CHANNELS.map(ch => (
                  <th key={ch} className="text-center px-5 py-3.5">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t(`vendor.notifications.channel_${ch}`, ch)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {EVENT_TYPES.map(ev => (
                <tr key={ev} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">
                    {t(`vendor.notifications.event_${ev}`, ev.replace(/_/g, ' '))}
                  </td>
                  {CHANNELS.map(ch => (
                    <td key={ch} className="px-5 py-3.5 text-center">
                      <button onClick={() => toggle(ev, ch)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${settings[ev]?.[ch] ? 'bg-brand' : 'bg-gray-200'}`}
                        role="switch" aria-checked={settings[ev]?.[ch]}>
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings[ev]?.[ch] ? 'translate-x-5' : ''}`} />
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <Moon size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">{t('vendor.notifications.quiet_hours', 'Ruhezeiten')}</h2>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={settings.quiet_enabled || false}
              onChange={(e) => setSettings(prev => ({ ...prev, quiet_enabled: e.target.checked }))}
              className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand/20" />
            <span className="text-sm text-gray-700">{t('vendor.notifications.quiet_enable', 'Ruhezeiten aktivieren')}</span>
          </label>
        </div>
        {settings.quiet_enabled && (
          <div className="flex items-center gap-3">
            <input type="time" value={settings.quiet_start || '22:00'}
              onChange={(e) => setSettings(prev => ({ ...prev, quiet_start: e.target.value }))}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20" />
            <span className="text-gray-400 text-sm">–</span>
            <input type="time" value={settings.quiet_end || '07:00'}
              onChange={(e) => setSettings(prev => ({ ...prev, quiet_end: e.target.value }))}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20" />
          </div>
        )}
      </div>

      <button onClick={handleSave} disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
        {saving && <Loader2 size={16} className="animate-spin" />}
        {t('common.save', 'Speichern')}
      </button>
    </div>
  );
}
