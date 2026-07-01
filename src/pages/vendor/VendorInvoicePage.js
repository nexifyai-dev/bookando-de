import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText, Download, Plus, Loader2, AlertCircle, Calendar, Filter,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { formatAmount, formatDate } from '../../lib/utils';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import { DashboardGrid, DashboardSection } from '../../components/dashboard/DashboardGrid';

const statusStyles = {
  paid: 'bg-success-light text-success-dark',
  pending: 'bg-warning-light text-warning-dark',
  overdue: 'bg-danger-light text-danger-dark',
};

export default function VendorInvoicePage() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        if (dateFrom) params.from = dateFrom;
        if (dateTo) params.to = dateTo;
        const { data } = await apiClient.get('/api/invoices', { params });
        if (!cancelled) setInvoices(Array.isArray(data) ? data : data.invoices || data.data || []);
      } catch (err) {
        if (!cancelled) setError(err.message || t('vendor.invoices.load_error', 'Fehler beim Laden der Rechnungen.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [statusFilter, dateFrom, dateTo, t]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      await apiClient.post('/api/invoices/generate');
      // reload
      const { data } = await apiClient.get('/api/invoices');
      setInvoices(Array.isArray(data) ? data : data.invoices || data.data || []);
    } catch {
      // ponnytail: toast feedback
    } finally {
      setGenerating(false);
    }
  }

  function handleDownloadPdf(invoice) {
    const url = `/api/invoices/${invoice.id}/pdf`;
    window.open(url, '_blank');
  }

  const total = invoices.reduce((s, i) => s + (i.amount || 0), 0);
  const paidCount = invoices.filter(i => i.status === 'paid').length;
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  const columns = [
    {
      header: t('vendor.invoices.col_number', 'Rechnungsnr.'),
      key: 'number',
      render: (val, row) => <span className="font-medium text-gray-900">{val || row.invoice_number || `#${row.id}`}</span>,
    },
    {
      header: t('vendor.invoices.col_date', 'Datum'),
      key: 'date',
      render: (val, row) => formatDate(val || row.created_at),
    },
    {
      header: t('vendor.invoices.col_customer', 'Kunde'),
      key: 'customer_name',
      render: (val, row) => val || row.customer?.name || '–',
    },
    {
      header: t('vendor.invoices.col_amount', 'Betrag'),
      key: 'amount',
      render: (val) => <span className="font-semibold">{formatAmount(val)}</span>,
    },
    {
      header: t('vendor.invoices.col_status', 'Status'),
      key: 'status',
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStyles[val] || 'bg-gray-100 text-gray-600'}`}>
          {t(`vendor.invoices.status.${val}`, val)}
        </span>
      ),
    },
    {
      header: '',
      key: 'id',
      render: (_, row) => (
        <button onClick={(e) => { e.stopPropagation(); handleDownloadPdf(row); }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-brand hover:bg-brand/[0.08] transition-colors"
          title={t('vendor.invoices.download_pdf', 'PDF herunterladen')}>
          <Download size={16} />
        </button>
      ),
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-brand" /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 bg-danger-light rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={24} className="text-danger" />
        </div>
        <p className="text-sm text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-lg text-gray-900">{t('vendor.invoices.title', 'Rechnungen')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('vendor.invoices.subtitle', 'Alle Rechnungen verwalten.')}</p>
        </div>
        <button onClick={handleGenerate} disabled={generating}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          {t('vendor.invoices.generate', 'Rechnung erstellen')}
        </button>
      </div>

      <DashboardGrid cols={3} className="mb-6">
        <StatCard icon={FileText} label={t('vendor.invoices.total', 'Gesamt')} value={invoices.length} color="brand" />
        <StatCard icon={FileText} label={t('vendor.invoices.total_amount', 'Gesamtbetrag')} value={formatAmount(total)} color="success"
          trend trendUp trendValue={`${paidCount} ${t('vendor.invoices.paid', 'bezahlt')}`} />
        <StatCard icon={FileText} label={t('vendor.invoices.overdue_count', 'Überfällig')} value={overdueCount} color="danger" />
      </DashboardGrid>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter size={14} />
          <span>{t('common.filter', 'Filter')}:</span>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20">
          <option value="all">{t('vendor.invoices.filter_all', 'Alle')}</option>
          <option value="paid">{t('vendor.invoices.status.paid', 'Bezahlt')}</option>
          <option value="pending">{t('vendor.invoices.status.pending', 'Offen')}</option>
          <option value="overdue">{t('vendor.invoices.status.overdue', 'Überfällig')}</option>
        </select>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
            placeholder={t('vendor.invoices.from', 'Von')} />
          <span className="text-gray-300">–</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
            placeholder={t('vendor.invoices.to', 'Bis')} />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        emptyText={t('vendor.invoices.empty', 'Keine Rechnungen vorhanden.')}
        pageSize={10}
      />
    </div>
  );
}
