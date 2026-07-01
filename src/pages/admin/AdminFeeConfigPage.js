import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Loader2, AlertCircle, Save, DollarSign, Percent, TrendingUp, CreditCard,
  Plus, Trash2, X, Settings
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import StatCard from '../../components/dashboard/StatCard';
import { DashboardGrid, DashboardSection } from '../../components/dashboard/DashboardGrid';
import { toast } from 'sonner';

/* ── Main Page ── */
export default function AdminFeeConfigPage() {
  const { t } = useTranslation();

  const { data: fees = {}, isLoading, isError } = useAutoRefresh(
    ['admin', 'fees'],
    () => apiClient.get('/api/admin/fees').then(r => r.data || {}),
  );

  const [form, setForm] = useState(null);
  const current = form ?? {
    platform_fee_percent: fees.platform_fee_percent ?? 5,
    payment_processing_percent: fees.payment_processing_percent ?? 2.9,
    payment_processing_fixed: fees.payment_processing_fixed ?? 0.30,
    minimum_payout: fees.minimum_payout ?? 50,
    fee_tiers: fees.fee_tiers || [],
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const saveMut = usePortalMutation({
    mutationFn: () => apiClient.put('/api/admin/fees', current),
    invalidateKeys: [['admin', 'fees']],
    onSuccess: () => toast.success(t('fees.saved', 'Gebühren gespeichert')),
    onError: () => toast.error(t('fees.save_error', 'Fehler')),
  });

  const addTier = () => {
    const tiers = [...(current.fee_tiers || []), { min_volume: 0, max_volume: null, fee_percent: current.platform_fee_percent }];
    set('fee_tiers', tiers);
  };

  const updateTier = (idx, key, val) => {
    const tiers = [...current.fee_tiers];
    tiers[idx] = { ...tiers[idx], [key]: val === '' ? null : parseFloat(val) || 0 };
    set('fee_tiers', tiers);
  };

  const removeTier = (idx) => {
    set('fee_tiers', current.fee_tiers.filter((_, i) => i !== idx));
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand" /></div>;
  if (isError) return <div className="flex items-center justify-center min-h-[60vh] text-danger"><AlertCircle size={20} className="mr-2" />{t('common.error', 'Fehler')}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-lg text-gray-900">{t('fees.title_page', 'Gebühren-Konfiguration')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('fees.desc', 'Plattform- und Zahlungsgebühren verwalten')}</p>
        </div>
        <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending || form === null}
          className="h-9 px-4 text-xs font-semibold rounded-lg bg-brand text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5">
          {saveMut.isPending && <Loader2 size={14} className="animate-spin" />}
          <Save size={14} /> {t('common.save', 'Speichern')}
        </button>
      </div>

      <DashboardGrid cols={3} className="mb-6">
        <StatCard icon={Percent} label={t('fees.platform_fee', 'Plattform-Gebühr')} value={`${current.platform_fee_percent}%`} color="brand" />
        <StatCard icon={CreditCard} label={t('fees.payment_processing', 'Zahlungsabwicklung')} value={`${current.payment_processing_percent}% + €${current.payment_processing_fixed}`} color="warning" />
        <StatCard icon={DollarSign} label={t('fees.min_payout', 'Min. Auszahlung')} value={`€${current.minimum_payout}`} color="info" />
      </DashboardGrid>

      {/* Core Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-5">
        <h3 className="text-sm font-bold text-gray-900">{t('fees.settings', 'Grundeinstellungen')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('fees.platform_fee', 'Plattform-Gebühr (%)')}</label>
            <input type="number" value={current.platform_fee_percent} onChange={e => set('platform_fee_percent', parseFloat(e.target.value) || 0)}
              min="0" max="100" step="0.1"
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('fees.processing_percent', 'Zahlung (%)')}</label>
            <input type="number" value={current.payment_processing_percent} onChange={e => set('payment_processing_percent', parseFloat(e.target.value) || 0)}
              min="0" max="100" step="0.01"
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('fees.processing_fixed', 'Zahlung (EUR fix)')}</label>
            <input type="number" value={current.payment_processing_fixed} onChange={e => set('payment_processing_fixed', parseFloat(e.target.value) || 0)}
              min="0" step="0.01"
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('fees.min_payout', 'Min. Auszahlung (€)')}</label>
            <input type="number" value={current.minimum_payout} onChange={e => set('minimum_payout', parseFloat(e.target.value) || 0)}
              min="0" step="1"
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
          </div>
        </div>
      </div>

      {/* Fee Tiers */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">{t('fees.tiers', 'Staffel-Gebühren (Volumen-basiert)')}</h3>
          <button onClick={addTier}
            className="h-8 px-3 text-[11px] font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1">
            <Plus size={12} /> {t('fees.add_tier', 'Stufe hinzufügen')}
          </button>
        </div>

        {(!current.fee_tiers || current.fee_tiers.length === 0) ? (
          <p className="text-sm text-gray-400 text-center py-6">{t('fees.no_tiers', 'Keine Staffel-Gebühren konfiguriert')}</p>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-3 px-3 pb-2 border-b border-gray-100">
              <span className="text-[11px] font-semibold text-gray-500 uppercase">{t('fees.min_volume', 'Min. Umsatz')}</span>
              <span className="text-[11px] font-semibold text-gray-500 uppercase">{t('fees.max_volume', 'Max. Umsatz')}</span>
              <span className="text-[11px] font-semibold text-gray-500 uppercase">{t('fees.tier_fee', 'Gebühr (%)')}</span>
              <span></span>
            </div>
            {current.fee_tiers.map((tier, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-3 items-center px-3 py-2 bg-gray-50 rounded-lg">
                <input type="number" value={tier.min_volume ?? ''} onChange={e => updateTier(idx, 'min_volume', e.target.value)} min="0" placeholder="0"
                  className="px-2 py-1.5 text-[13px] rounded border border-gray-200 outline-none focus:border-brand" />
                <input type="number" value={tier.max_volume ?? ''} onChange={e => updateTier(idx, 'max_volume', e.target.value)} min="0" placeholder="∞"
                  className="px-2 py-1.5 text-[13px] rounded border border-gray-200 outline-none focus:border-brand" />
                <input type="number" value={tier.fee_percent ?? ''} onChange={e => updateTier(idx, 'fee_percent', e.target.value)} min="0" max="100" step="0.1" placeholder="5"
                  className="px-2 py-1.5 text-[13px] rounded border border-gray-200 outline-none focus:border-brand" />
                <button onClick={() => removeTier(idx)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-danger justify-self-start">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
