import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Loader2, AlertCircle, Copy, ExternalLink, MousePointerClick, ShoppingCart, DollarSign,
  Megaphone, Link2, X, ChevronLeft, Save, ToggleLeft, ToggleRight
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import ChartCard from '../../components/dashboard/ChartCard';
import { DashboardGrid, DashboardSection } from '../../components/dashboard/DashboardGrid';
import { toast } from 'sonner';

/* ── Simple inline line chart (ponytail: no recharts dep, upgrade when chart lib added) ── */
function MiniLineChart({ data = [], lines = [], height = 160 }) {
  if (!data.length) return <div className="text-xs text-gray-400 text-center py-8">Keine Daten</div>;
  const allVals = data.flatMap(d => lines.map(l => d[l.key] || 0));
  const max = Math.max(...allVals, 1);
  const w = 100 / Math.max(data.length - 1, 1);
  const colors = ['text-brand', 'text-success'];

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      {lines.map((line, li) => {
        const pts = data.map((d, i) => `${i * w},${height - ((d[line.key] || 0) / max) * (height - 20)}`).join(' ');
        return (
          <g key={li}>
            <polyline fill="none" stroke="currentColor" strokeWidth="0.8" className={colors[li] || 'text-gray-400'} points={pts} />
            {data.map((d, i) => (
              <circle key={i} cx={i * w} cy={height - ((d[line.key] || 0) / max) * (height - 20)} r="1.2"
                fill="currentColor" className={colors[li] || 'text-gray-400'} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Create Campaign Modal ── */
function CreateCampaignModal({ onClose, onCreated }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '', target_type: 'vendor', target_id: '', commission_type: 'percent', commission_value: '10', duration_days: '30',
  });

  const mut = usePortalMutation({
    mutationFn: (data) => apiClient.post('/api/affiliate/campaigns', { ...data, commission_value: parseFloat(data.commission_value) || 0, duration_days: parseInt(data.duration_days, 10) || 30 }),
    invalidateKeys: [['affiliate', 'campaigns']],
    onSuccess: () => { toast.success(t('campaign.created', 'Kampagne erstellt')); onCreated(); },
    onError: () => toast.error(t('campaign.create_error', 'Fehler beim Erstellen')),
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-12 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mb-12">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">{t('campaign.create', 'Neue Kampagne')}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mut.mutate(form); }} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('campaign.name', 'Name')}</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('campaign.target_type', 'Zieltyp')}</label>
              <select value={form.target_type} onChange={e => set('target_type', e.target.value)}
                className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand">
                <option value="vendor">{t('campaign.vendor', 'Anbieter')}</option>
                <option value="service">{t('campaign.service', 'Leistung')}</option>
                <option value="package">{t('campaign.package', 'Paket')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('campaign.target_id', 'Ziel-ID')}</label>
              <input value={form.target_id} onChange={e => set('target_id', e.target.value)}
                className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('campaign.commission_type', 'Provision')}</label>
              <select value={form.commission_type} onChange={e => set('commission_type', e.target.value)}
                className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand">
                <option value="percent">%</option>
                <option value="fixed">€</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('campaign.commission_value', 'Wert')}</label>
              <input type="number" value={form.commission_value} onChange={e => set('commission_value', e.target.value)} min="0" step="0.01"
                className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('campaign.duration', 'Tage')}</label>
              <input type="number" value={form.duration_days} onChange={e => set('duration_days', e.target.value)} min="1"
                className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="h-9 px-4 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">{t('common.cancel', 'Abbrechen')}</button>
            <button type="submit" disabled={mut.isPending} className="h-9 px-4 text-xs font-medium rounded-lg bg-brand text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5">
              {mut.isPending && <Loader2 size={14} className="animate-spin" />}<Save size={14} /> {t('common.save', 'Speichern')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Campaign Detail ── */
function CampaignDetail({ campaign, onBack }) {
  const { t } = useTranslation();
  const { data: stats = {}, isLoading } = useAutoRefresh(
    ['affiliate', 'campaigns', campaign.id, 'stats'],
    () => apiClient.get(`/api/affiliate/campaigns/${campaign.id}/stats`).then(r => r.data || {}),
  );
  const timeline = Array.isArray(stats.timeline) ? stats.timeline : [];

  const copyLink = () => {
    const link = stats.tracking_link || `${window.location.origin}/ref/${campaign.id}`;
    navigator.clipboard.writeText(link).then(() => toast.success(t('campaign.link_copied', 'Link kopiert')));
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 mb-4">
        <ChevronLeft size={14} /> {t('common.back', 'Zurück')}
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{campaign.name}</h2>
          <p className="text-xs text-gray-400">{campaign.target_type} · {campaign.commission_type === 'percent' ? `${campaign.commission_value}%` : `€${campaign.commission_value}`}</p>
        </div>
        <button onClick={copyLink} className="h-9 px-4 text-xs font-semibold rounded-lg bg-brand text-white hover:opacity-90 flex items-center gap-1.5">
          <Link2 size={14} /> {t('campaign.copy_link', 'Tracking-Link kopieren')}
        </button>
      </div>

      <DashboardGrid cols={3} className="mb-6">
        <StatCard icon={MousePointerClick} label={t('campaign.clicks', 'Klicks')} value={(stats.clicks || 0).toLocaleString()} color="warning" />
        <StatCard icon={ShoppingCart} label={t('campaign.conversions', 'Konversionen')} value={(stats.conversions || 0).toLocaleString()} color="success" />
        <StatCard icon={DollarSign} label={t('campaign.revenue', 'Umsatz')} value={`€${(stats.revenue || 0).toLocaleString()}`} color="brand" />
      </DashboardGrid>

      <ChartCard title={t('campaign.performance', 'Performance')} subtitle={t('campaign.over_time', 'Klicks & Konversionen über Zeit')}>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-brand" /></div>
        ) : (
          <>
            <MiniLineChart data={timeline} lines={[{ key: 'clicks' }, { key: 'conversions' }]} />
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-[11px] text-gray-500"><span className="w-3 h-0.5 bg-brand rounded inline-block" /> {t('campaign.clicks', 'Klicks')}</span>
              <span className="flex items-center gap-1 text-[11px] text-gray-500"><span className="w-3 h-0.5 bg-success rounded inline-block" /> {t('campaign.conversions', 'Konversionen')}</span>
            </div>
          </>
        )}
      </ChartCard>
    </div>
  );
}

/* ── Main Page ── */
export default function AffiliateCampaignPage() {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data: campaigns = [], isLoading, isError } = useAutoRefresh(
    ['affiliate', 'campaigns'],
    () => apiClient.get('/api/affiliate/campaigns').then(r => Array.isArray(r.data) ? r.data : []),
  );

  if (selected) return <CampaignDetail campaign={selected} onBack={() => setSelected(null)} />;

  const totalClicks = campaigns.reduce((s, c) => s + (c.clicks || 0), 0);
  const totalConversions = campaigns.reduce((s, c) => s + (c.conversions || 0), 0);
  const totalRevenue = campaigns.reduce((s, c) => s + (c.revenue || 0), 0);

  const columns = [
    { key: 'name', header: t('campaign.name', 'Name'), render: v => <span className="font-medium text-gray-900">{v}</span> },
    { key: 'target_type', header: t('campaign.type', 'Typ'), render: v => (
      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-info/10 text-info capitalize">{v}</span>
    )},
    { key: 'status', header: t('campaign.status', 'Status'), render: v => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${v === 'active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'}`}>
        {v === 'active' ? t('campaign.active', 'Aktiv') : t('campaign.paused', 'Pausiert')}
      </span>
    )},
    { key: 'clicks', header: t('campaign.clicks', 'Klicks'), render: v => (v || 0).toLocaleString() },
    { key: 'conversions', header: t('campaign.conversions', 'Konv.'), render: v => (v || 0).toLocaleString() },
    { key: 'revenue', header: t('campaign.revenue', 'Umsatz'), render: v => `€${(v || 0).toLocaleString()}` },
  ];

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand" /></div>;
  if (isError) return <div className="flex items-center justify-center min-h-[60vh] text-danger"><AlertCircle size={20} className="mr-2" />{t('common.error', 'Fehler')}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-lg text-gray-900">{t('campaign.title_page', 'Kampagnen')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('campaign.desc', 'Verwalte deine Affiliate-Kampagnen')}</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="h-9 px-4 text-xs font-semibold rounded-lg bg-brand text-white hover:opacity-90 flex items-center gap-1.5">
          <Plus size={14} /> {t('campaign.create', 'Neue Kampagne')}
        </button>
      </div>

      <DashboardGrid cols={3} className="mb-6">
        <StatCard icon={Megaphone} label={t('campaign.count', 'Kampagnen')} value={campaigns.length} color="brand" />
        <StatCard icon={MousePointerClick} label={t('campaign.total_clicks', 'Klicks gesamt')} value={totalClicks.toLocaleString()} color="warning" />
        <StatCard icon={DollarSign} label={t('campaign.total_revenue', 'Umsatz gesamt')} value={`€${totalRevenue.toLocaleString()}`} color="success" />
      </DashboardGrid>

      <DashboardSection title={t('campaign.all', 'Alle Kampagnen')}>
        <DataTable columns={columns} data={campaigns} emptyText={t('campaign.empty', 'Keine Kampagnen')} onRowClick={setSelected} />
      </DashboardSection>

      {createOpen && <CreateCampaignModal onClose={() => setCreateOpen(false)} onCreated={() => setCreateOpen(false)} />}
    </div>
  );
}
