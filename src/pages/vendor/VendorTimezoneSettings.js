import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Loader2, AlertCircle, Save, MapPin } from 'lucide-react';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import { toast } from 'sonner';
import apiClient from '../../lib/apiClient';

const TimezoneApi = {
  get: () => apiClient.get('/api/vendor/timezone').then(r => r.data),
  save: (p) => apiClient.put('/api/vendor/timezone', p).then(r => r.data),
};

// ponytail: IANA list hardcoded for MVP; swap with Intl.supportedValuesOf('timeZone') runtime check if browser compat < 2023
const TIMEZONES = [
  'Europe/Berlin', 'Europe/Vienna', 'Europe/Zurich', 'Europe/London', 'Europe/Paris',
  'Europe/Rome', 'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Brussels', 'Europe/Warsaw',
  'Europe/Prague', 'Europe/Budapest', 'Europe/Bucharest', 'Europe/Sofia', 'Europe/Athens',
  'Europe/Helsinki', 'Europe/Stockholm', 'Europe/Oslo', 'Europe/Copenhagen', 'Europe/Dublin',
  'Europe/Lisbon', 'Europe/Istanbul', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'America/Toronto', 'America/Sao_Paulo', 'America/Mexico_City',
  'America/Buenos_Aires', 'America/Bogota', 'America/Lima', 'America/Santiago',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Singapore', 'Asia/Seoul',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Tel_Aviv',
  'Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Pacific/Auckland',
  'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos',
];

const INPUT_STYLE = {
  background: 'var(--color-surface-sunken)',
  border: '1px solid var(--color-divider)',
  color: 'var(--color-text-primary)',
};

export default function VendorTimezoneSettings() {
  const { t } = useTranslation();

  const { data, isLoading, error, refetch } = useAutoRefresh(
    ['vendor', 'timezone'],
    () => TimezoneApi.get().catch(() => ({})),
  );

  const [tz, setTz] = useState('');
  const [autoDetect, setAutoDetect] = useState(false);
  const [displayCustomerTz, setDisplayCustomerTz] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded && data && !isLoading) {
      setTz(data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin');
      setAutoDetect(data.auto_detect_customer_timezone ?? true);
      setDisplayCustomerTz(data.display_customer_timezone ?? false);
      setLoaded(true);
    }
  }, [data, isLoading, loaded]);

  const saveMutation = usePortalMutation({
    mutationFn: () => TimezoneApi.save({ timezone: tz, auto_detect_customer_timezone: autoDetect, display_customer_timezone: displayCustomerTz }),
    invalidateKeys: [['vendor', 'timezone']],
    onSuccess: () => toast.success(t('vendor.timezone.saved', 'Zeitzone gespeichert.')),
    onError: (err) => toast.error(err.message || t('vendor.timezone.saveError', 'Fehler beim Speichern.')),
  });

  const now = new Date();
  const sampleTime = tz ? now.toLocaleTimeString('de-DE', { timeZone: tz, hour: '2-digit', minute: '2-digit' }) : '--:--';

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.timezone.title', 'Zeitzonen-Einstellungen')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.timezone.subtitle', 'Konfiguriere die Zeitzone deines Unternehmens.')}</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: 'var(--color-danger)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem', marginBottom: '16px' }}>{error?.message || 'Fehler'}</p>
          <button onClick={refetch} className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="max-w-xl space-y-5">
          {/* Timezone selector */}
          <div className="rounded-xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Globe size={18} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <p className="text-[14px] font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {t('vendor.timezone.businessTz', 'Geschäftszeitzone')}
                </p>
                <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('vendor.timezone.currentTime', 'Aktuell')}: {sampleTime}
                </p>
              </div>
            </div>
            <select value={tz} onChange={e => setTz(e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={INPUT_STYLE}>
              {TIMEZONES.map(z => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}
            </select>
          </div>

          {/* Auto-detect customer timezone */}
          <div className="rounded-xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,179,237,0.12)' }}>
                  <MapPin size={18} style={{ color: '#3182CE' }} />
                </div>
                <div>
                  <p className="text-[14px] font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {t('vendor.timezone.autoDetect', 'Kundenzeitzone erkennen')}
                  </p>
                  <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    {t('vendor.timezone.autoDetectHint', 'Zeiten automatisch in der Zeitzone des Kunden anzeigen')}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setAutoDetect(!autoDetect)}
                className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
                style={{ background: autoDetect ? 'var(--color-primary)' : 'var(--color-divider)' }}>
                <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{ transform: autoDetect ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
            </div>
          </div>

          {/* Display in customer timezone */}
          <div className="rounded-xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {t('vendor.timezone.displayCustomer', 'In Kundenzeitzone anzeigen')}
                </p>
                <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('vendor.timezone.displayCustomerHint', 'Bestätigungs-E-Mails und Dashboard-Zeiten in Kundenzeitzone')}
                </p>
              </div>
              <button type="button" onClick={() => setDisplayCustomerTz(!displayCustomerTz)}
                className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
                style={{ background: displayCustomerTz ? 'var(--color-primary)' : 'var(--color-divider)' }}>
                <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{ transform: displayCustomerTz ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
            </div>
          </div>

          {/* Save */}
          <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
            style={{ background: 'var(--color-primary)' }}>
            {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {t('common.save', 'Speichern')}
          </button>
        </div>
      )}
    </div>
  );
}
