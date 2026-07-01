import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Wallet, Loader2, AlertCircle, CheckCircle, Percent, DollarSign,
  RefreshCw, Save, ToggleLeft, ToggleRight,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import StatCard from '../../components/dashboard/StatCard';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';

const defaultDeposit = {
  enabled: false,
  deposit_type: 'percentage',
  deposit_amount: 20,
  refund_policy: 'non_refundable',
  refund_policy_text: '',
};

export default function VendorDepositSettingsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(defaultDeposit);
  const [services, setServices] = useState([]);
  const [serviceDeposits, setServiceDeposits] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/api/vendor/deposit-settings');
        if (!cancelled) {
          setSettings({ ...defaultDeposit, ...data.global });
          setServices(data.services || []);
          setServiceDeposits(data.serviceDeposits || {});
        }
      } catch (err) {
        if (!cancelled) setError(err.message || t('vendor.deposit.load_error', 'Fehler beim Laden.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [t]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      await apiClient.put('/api/vendor/deposit-settings', {
        global: settings,
        serviceDeposits,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || t('vendor.deposit.save_error', 'Fehler beim Speichern.'));
    } finally {
      setSaving(false);
    }
  }, [settings, serviceDeposits, t]);

  function toggleServiceDeposit(serviceId) {
    setServiceDeposits(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        enabled: !prev[serviceId]?.enabled,
        deposit_type: prev[serviceId]?.deposit_type || 'percentage',
        deposit_amount: prev[serviceId]?.deposit_amount || 20,
      },
    }));
  }

  function updateServiceDeposit(serviceId, field, value) {
    setServiceDeposits(prev => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [field]: value },
    }));
  }

  const activeDeposits = Object.values(serviceDeposits).filter(s => s?.enabled).length;

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-brand" /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle size={40} className="text-danger mb-4" /><p className="text-sm text-gray-600">{error}</p>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">{t('vendor.deposit.title', 'Anzahlungseinstellungen')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('vendor.deposit.subtitle', 'Anzahlungen pro Dienstleistung konfigurieren.')}</p>
      </div>

      <DashboardGrid cols={3}>
        <StatCard
          icon={Wallet}
          label={t('vendor.deposit.stat_active', 'Aktive Anzahlungen')}
          value={activeDeposits}
          color="brand"
        />
        <StatCard
          icon={settings.deposit_type === 'percentage' ? Percent : DollarSign}
          label={t('vendor.deposit.stat_type', 'Standardtyp')}
          value={settings.deposit_type === 'percentage' ? `${settings.deposit_amount}%` : `€${settings.deposit_amount}`}
          color="info"
        />
        <StatCard
          icon={CheckCircle}
          label={t('vendor.deposit.stat_status', 'Status')}
          value={settings.enabled ? t('common.active', 'Aktiv') : t('common.inactive', 'Inaktiv')}
          color={settings.enabled ? 'success' : 'warning'}
        />
      </DashboardGrid>

      {/* Global Deposit Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mt-6 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">{t('vendor.deposit.global_settings', 'Globale Einstellungen')}</h2>

        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">{t('vendor.deposit.enable', 'Anzahlung aktivieren')}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('vendor.deposit.enable_desc', 'Anzahlung als Standard für alle Dienste.')}</p>
          </div>
          <button onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}>
            {settings.enabled
              ? <ToggleRight size={28} className="text-success" />
              : <ToggleLeft size={28} className="text-gray-300" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.deposit.type', 'Anzahlungstyp')}</label>
            <select
              value={settings.deposit_type}
              onChange={(e) => setSettings(prev => ({ ...prev, deposit_type: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="percentage">{t('vendor.deposit.type_percentage', 'Prozentual')}</option>
              <option value="fixed">{t('vendor.deposit.type_fixed', 'Fester Betrag')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              {settings.deposit_type === 'percentage'
                ? t('vendor.deposit.amount_pct', 'Prozentsatz (%)')
                : t('vendor.deposit.amount_fixed', 'Betrag (€)')}
            </label>
            <input
              type="number"
              min={0}
              max={settings.deposit_type === 'percentage' ? 100 : undefined}
              value={settings.deposit_amount}
              onChange={(e) => setSettings(prev => ({ ...prev, deposit_amount: Number(e.target.value) }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>
      </div>

      {/* Refund Policy */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">{t('vendor.deposit.refund_policy', 'Rückerstattungsrichtlinie')}</h2>
        <div className="space-y-3">
          {['non_refundable', 'partial_refund', 'full_refund'].map(policy => (
            <label key={policy} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 cursor-pointer hover:border-gray-200 transition-colors">
              <input
                type="radio"
                name="refund_policy"
                value={policy}
                checked={settings.refund_policy === policy}
                onChange={(e) => setSettings(prev => ({ ...prev, refund_policy: e.target.value }))}
                className="accent-brand"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {policy === 'non_refundable' && t('vendor.deposit.refund_none', 'Nicht erstattbar')}
                  {policy === 'partial_refund' && t('vendor.deposit.refund_partial', 'Teilweise erstattbar')}
                  {policy === 'full_refund' && t('vendor.deposit.refund_full', 'Vollständig erstattbar')}
                </p>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.deposit.refund_text', 'Richtlinientext')}</label>
          <textarea
            rows={3}
            value={settings.refund_policy_text}
            onChange={(e) => setSettings(prev => ({ ...prev, refund_policy_text: e.target.value }))}
            placeholder={t('vendor.deposit.refund_placeholder', 'Zusätzliche Informationen zur Rückerstattung...')}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none"
          />
        </div>
      </div>

      {/* Per-Service Deposits */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">{t('vendor.deposit.per_service', 'Pro Dienstleistung')}</h2>
        {services.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">{t('vendor.deposit.no_services', 'Keine Dienstleistungen vorhanden.')}</p>
        ) : (
          <div className="space-y-3">
            {services.map(svc => {
              const dep = serviceDeposits[svc.id] || { enabled: false, deposit_type: 'percentage', deposit_amount: 20 };
              return (
                <div key={svc.id} className="p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{svc.name}</p>
                      <p className="text-xs text-gray-400">€{svc.price}</p>
                    </div>
                    <button onClick={() => toggleServiceDeposit(svc.id)}>
                      {dep.enabled
                        ? <ToggleRight size={28} className="text-success" />
                        : <ToggleLeft size={28} className="text-gray-300" />}
                    </button>
                  </div>
                  {dep.enabled && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <select
                        value={dep.deposit_type}
                        onChange={(e) => updateServiceDeposit(svc.id, 'deposit_type', e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">€</option>
                      </select>
                      <input
                        type="number"
                        min={0}
                        value={dep.deposit_amount}
                        onChange={(e) => updateServiceDeposit(svc.id, 'deposit_amount', Number(e.target.value))}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {t('common.save', 'Speichern')}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-success font-medium">
            <CheckCircle size={16} /> {t('vendor.deposit.saved', 'Gespeichert')}
          </span>
        )}
        {error && (
          <span className="inline-flex items-center gap-1.5 text-sm text-danger font-medium">
            <AlertCircle size={16} /> {error}
          </span>
        )}
      </div>
    </div>
  );
}
