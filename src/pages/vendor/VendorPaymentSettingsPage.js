import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CreditCard, Loader2, AlertCircle, CheckCircle, XCircle, Building2, Banknote,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';

const PROVIDERS = [
  { key: 'stripe', label: 'Stripe', icon: CreditCard },
  { key: 'paypal', label: 'PayPal', icon: Banknote },
];

const defaultSettings = {
  stripe: { connected: false },
  paypal: { connected: false },
  payout_method: 'bank',
  payout_schedule: 'weekly',
  platform_fee: 2.9,
};

export default function VendorPaymentSettingsPage() {
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
        const { data } = await apiClient.get('/api/vendor/payment-settings');
        if (!cancelled) setSettings({ ...defaultSettings, ...data });
      } catch (err) {
        if (!cancelled) setError(err.message || t('vendor.payment.load_error', 'Fehler beim Laden.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [t]);

  async function handleSave() {
    setSaving(true);
    try {
      await apiClient.put('/api/vendor/payment-settings', settings);
    } catch {
      // ponytail: toast
    } finally {
      setSaving(false);
    }
  }

  function toggleProvider(key) {
    const connected = !settings[key]?.connected;
    setSettings(prev => ({ ...prev, [key]: { ...prev[key], connected } }));
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
        <h1 className="text-title-lg text-gray-900">{t('vendor.payment.title', 'Zahlungseinstellungen')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('vendor.payment.subtitle', 'Zahlungsanbieter und Auszahlungen verwalten.')}</p>
      </div>

      {/* Payment Providers */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">{t('vendor.payment.providers', 'Zahlungsanbieter')}</h2>
        <div className="space-y-3">
          {PROVIDERS.map(({ key, label, icon: Icon }) => {
            const connected = settings[key]?.connected;
            return (
              <div key={key} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Icon size={20} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {connected ? (
                        <><CheckCircle size={12} className="text-success" /><span className="text-xs text-success font-medium">{t('vendor.payment.connected', 'Verbunden')}</span></>
                      ) : (
                        <><XCircle size={12} className="text-gray-400" /><span className="text-xs text-gray-400">{t('vendor.payment.not_connected', 'Nicht verbunden')}</span></>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => toggleProvider(key)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${connected ? 'bg-danger-light text-danger hover:bg-danger/20' : 'bg-brand/[0.08] text-brand hover:bg-brand/[0.15]'}`}>
                  {connected ? t('vendor.payment.disconnect', 'Trennen') : t('vendor.payment.connect', 'Verbinden')}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payout Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">{t('vendor.payment.payout_settings', 'Auszahlungseinstellungen')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.payment.payout_method', 'Auszahlungsmethode')}</label>
            <select value={settings.payout_method} onChange={(e) => setSettings(prev => ({ ...prev, payout_method: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20">
              <option value="bank">{t('vendor.payment.method_bank', 'Bankkonto')}</option>
              <option value="paypal">{t('vendor.payment.method_paypal', 'PayPal')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.payment.payout_schedule', 'Auszahlungsintervall')}</label>
            <select value={settings.payout_schedule} onChange={(e) => setSettings(prev => ({ ...prev, payout_schedule: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20">
              <option value="weekly">{t('vendor.payment.schedule_weekly', 'Wöchentlich')}</option>
              <option value="monthly">{t('vendor.payment.schedule_monthly', 'Monatlich')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fee Display */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-3">{t('vendor.payment.fees', 'Gebühren')}</h2>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Building2 size={18} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-700">{t('vendor.payment.platform_fee', 'Plattformgebühr')}</p>
            <p className="text-lg font-bold text-gray-900">{settings.platform_fee || 0}%</p>
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
        {saving && <Loader2 size={16} className="animate-spin" />}
        {t('common.save', 'Speichern')}
      </button>
    </div>
  );
}
