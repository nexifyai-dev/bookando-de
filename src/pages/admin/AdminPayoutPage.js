import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Wallet, Loader2, AlertCircle, DollarSign, CheckCircle, Clock, ArrowRight,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { formatAmount, formatDate } from '../../lib/utils';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';

const statusStyles = {
  completed: 'bg-success-light text-success-dark',
  pending: 'bg-warning-light text-warning-dark',
  processing: 'bg-info-light text-info-dark',
  failed: 'bg-danger-light text-danger-dark',
};

export default function AdminPayoutPage() {
  const { t } = useTranslation();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/api/admin/payouts', { params: { status: tab } });
        if (!cancelled) setPayouts(Array.isArray(data) ? data : data.payouts || data.data || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [tab]);

  async function handleProcess(id) {
    setProcessing(id);
    try {
      await apiClient.post('/api/admin/payouts/process', { payout_id: id });
      const { data } = await apiClient.get('/api/admin/payouts', { params: { status: tab } });
      setPayouts(Array.isArray(data) ? data : data.payouts || data.data || []);
    } catch {
      // ponytail: toast
    } finally {
      setProcessing(null);
    }
  }

  const pendingTotal = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0);
  const completedTotal = payouts.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0);

  const columns = [
    {
      header: t('admin.payouts.col_vendor', 'Anbieter'),
      key: 'vendor_name',
      render: (val, row) => <span className="font-medium text-gray-900">{val || row.vendor?.name || '–'}</span>,
    },
    {
      header: t('admin.payouts.col_amount', 'Betrag'),
      key: 'amount',
      render: (val) => <span className="font-semibold">{formatAmount(val)}</span>,
    },
    {
      header: t('admin.payouts.col_date', 'Datum'),
      key: 'date',
      render: (val, row) => formatDate(val || row.created_at),
    },
    {
      header: t('admin.payouts.col_status', 'Status'),
      key: 'status',
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStyles[val] || 'bg-gray-100 text-gray-600'}`}>
          {t(`admin.payouts.status.${val}`, val)}
        </span>
      ),
    },
    {
      header: '',
      key: 'id',
      render: (val, row) => row.status === 'pending' ? (
        <button onClick={(e) => { e.stopPropagation(); handleProcess(val); }} disabled={processing === val}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50">
          {processing === val ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
          {t('admin.payouts.process', 'Auszahlen')}
        </button>
      ) : null,
    },
  ];

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-brand" /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle size={40} className="text-danger mb-4" /><p className="text-sm text-gray-600 mb-4">{error}</p>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">{t('admin.payouts.title', 'Auszahlungen')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('admin.payouts.subtitle', 'Auszahlungen an Anbieter verwalten.')}</p>
      </div>

      <DashboardGrid cols={2} className="mb-6">
        <StatCard icon={Clock} label={t('admin.payouts.pending_total', 'Ausstehend')} value={formatAmount(pendingTotal)} color="warning" />
        <StatCard icon={CheckCircle} label={t('admin.payouts.completed_total', 'Ausgezahlt')} value={formatAmount(completedTotal)} color="success" />
      </DashboardGrid>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4">
        {['pending', 'completed', 'all'].map(t2 => (
          <button key={t2} onClick={() => setTab(t2)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === t2 ? 'bg-brand text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            {t(`admin.payouts.tab_${t2}`, t2)}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={payouts}
        emptyText={t('admin.payouts.empty', 'Keine Auszahlungen vorhanden.')}
        pageSize={15}
      />
    </div>
  );
}
