import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText, Loader2, AlertCircle, DollarSign, Send, CheckCircle, Filter,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { formatAmount, formatDate } from '../../lib/utils';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';

const statusStyles = {
  paid: 'bg-success-light text-success-dark',
  pending: 'bg-warning-light text-warning-dark',
  overdue: 'bg-danger-light text-danger-dark',
};

export default function AdminInvoicePage() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('');
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const params = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        if (vendorFilter) params.vendor_id = vendorFilter;
        const [invRes, vendorRes] = await Promise.allSettled([
          apiClient.get('/api/admin/invoices', { params }).then(r => r.data),
          apiClient.get('/api/admin/vendors?simple=1').then(r => r.data),
        ]);
        if (!cancelled) {
          if (invRes.status === 'fulfilled') setInvoices(Array.isArray(invRes.value) ? invRes.value : invRes.value.invoices || []);
          if (vendorRes.status === 'fulfilled') setVendors(Array.isArray(vendorRes.value) ? vendorRes.value : vendorRes.value.vendors || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [statusFilter, vendorFilter]);

  function toggleSelect(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function toggleAll() {
    setSelected(prev => prev.length === invoices.length ? [] : invoices.map(i => i.id));
  }

  async function bulkMarkPaid() {
    if (!selected.length) return;
    try {
      await Promise.all(selected.map(id => apiClient.put(`/api/admin/invoices/${id}`, { status: 'paid' })));
      const { data } = await apiClient.get('/api/admin/invoices');
      setInvoices(Array.isArray(data) ? data : data.invoices || []);
      setSelected([]);
    } catch { /* ponytail: toast */ }
  }

  async function bulkSendReminder() {
    if (!selected.length) return;
    try {
      await apiClient.post('/api/admin/invoices/reminder', { ids: selected });
      setSelected([]);
    } catch { /* ponytail: toast */ }
  }

  const totalRevenue = invoices.reduce((s, i) => s + (i.amount || 0), 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + (i.amount || 0), 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amount || 0), 0);

  const columns = [
    {
      header: '',
      key: 'id',
      render: (val) => (
        <input type="checkbox" checked={selected.includes(val)} onChange={() => toggleSelect(val)}
          className="w-4 h-4 text-brand rounded border-gray-300" />
      ),
    },
    {
      header: t('admin.invoices.col_number', 'Rechnungsnr.'),
      key: 'number',
      render: (val, row) => <span className="font-medium text-gray-900">{val || row.invoice_number || `#${row.id}`}</span>,
    },
    {
      header: t('admin.invoices.col_vendor', 'Anbieter'),
      key: 'vendor_name',
      render: (val, row) => val || row.vendor?.name || '–',
    },
    {
      header: t('admin.invoices.col_date', 'Datum'),
      key: 'date',
      render: (val, row) => formatDate(val || row.created_at),
    },
    {
      header: t('admin.invoices.col_amount', 'Betrag'),
      key: 'amount',
      render: (val) => <span className="font-semibold">{formatAmount(val)}</span>,
    },
    {
      header: t('admin.invoices.col_status', 'Status'),
      key: 'status',
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStyles[val] || 'bg-gray-100 text-gray-600'}`}>
          {t(`admin.invoices.status.${val}`, val)}
        </span>
      ),
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
        <h1 className="text-title-lg text-gray-900">{t('admin.invoices.title', 'Rechnungen')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('admin.invoices.subtitle', 'Alle Rechnungen aller Anbieter.')}</p>
      </div>

      <DashboardGrid cols={3} className="mb-6">
        <StatCard icon={DollarSign} label={t('admin.invoices.total_revenue', 'Gesamtumsatz')} value={formatAmount(totalRevenue)} color="brand" />
        <StatCard icon={FileText} label={t('admin.invoices.pending_amount', 'Offen')} value={formatAmount(pendingAmount)} color="warning" />
        <StatCard icon={FileText} label={t('admin.invoices.overdue_amount', 'Überfällig')} value={formatAmount(overdueAmount)} color="danger" />
      </DashboardGrid>

      {/* Filters + Bulk Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500"><Filter size={14} /><span>{t('common.filter', 'Filter')}:</span></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20">
          <option value="all">{t('admin.invoices.filter_all', 'Alle')}</option>
          <option value="paid">{t('admin.invoices.status.paid', 'Bezahlt')}</option>
          <option value="pending">{t('admin.invoices.status.pending', 'Offen')}</option>
          <option value="overdue">{t('admin.invoices.status.overdue', 'Überfällig')}</option>
        </select>
        <select value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20">
          <option value="">{t('admin.invoices.all_vendors', 'Alle Anbieter')}</option>
          {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>

        {selected.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500">{selected.length} {t('admin.invoices.selected', 'ausgewählt')}</span>
            <button onClick={bulkMarkPaid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-success-light text-success-dark rounded-lg hover:bg-success/20 transition-colors">
              <CheckCircle size={14} /> {t('admin.invoices.mark_paid', 'Als bezahlt markieren')}
            </button>
            <button onClick={bulkSendReminder}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand/[0.08] text-brand rounded-lg hover:bg-brand/[0.15] transition-colors">
              <Send size={14} /> {t('admin.invoices.send_reminder', 'Erinnerung senden')}
            </button>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        emptyText={t('admin.invoices.empty', 'Keine Rechnungen vorhanden.')}
        pageSize={15}
      />
    </div>
  );
}
