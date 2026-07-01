import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Wallet, Plus, ArrowUpRight, ArrowDownLeft, Loader2, AlertCircle, Filter, CreditCard
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { formatAmount } from '../../lib/utils';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/dashboard/DataTable';

const txTypeStyles = {
  deposit: 'bg-success-light text-success-dark',
  withdrawal: 'bg-danger-light text-danger-dark',
  booking: 'bg-info-light text-info-dark',
  refund: 'bg-warning-light text-warning-dark',
  bonus: 'bg-brand/10 text-brand',
};

const txTypeIcons = {
  deposit: ArrowDownLeft,
  withdrawal: ArrowUpRight,
  booking: ArrowUpRight,
  refund: ArrowDownLeft,
  bonus: ArrowDownLeft,
};

function formatDate(dateStr) {
  if (!dateStr) return '–';
  try {
    return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function CustomerWalletPage() {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [balRes, txRes] = await Promise.allSettled([
        apiClient.get('/api/wallet/balance').then(r => r.data),
        apiClient.get('/api/wallet/transactions').then(r => r.data),
      ]);
      if (balRes.status === 'fulfilled') {
        const b = balRes.value;
        setBalance(typeof b === 'number' ? b : b.balance ?? b.amount ?? 0);
      } else {
        setBalance(0);
      }
      if (txRes.status === 'fulfilled') {
        const d = txRes.value;
        setTransactions(Array.isArray(d) ? d : d.transactions || d.data || []);
      }
      if (balRes.status === 'rejected' && txRes.status === 'rejected') {
        setError(t('customer.wallet.load_error', 'Fehler beim Laden des Wallets.'));
      }
    } catch (err) {
      setError(err.response?.data?.message || t('customer.wallet.error', 'Fehler beim Laden.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredTx = typeFilter === 'all'
    ? transactions
    : transactions.filter((tx) => tx.type === typeFilter);

  const txTypes = [...new Set(transactions.map((tx) => tx.type).filter(Boolean))];

  const columns = [
    {
      header: t('customer.wallet.col_date', 'Datum'),
      key: 'created_at',
      render: (val) => <span className="text-gray-500">{formatDate(val)}</span>,
    },
    {
      header: t('customer.wallet.col_type', 'Typ'),
      key: 'type',
      render: (val) => {
        const Icon = txTypeIcons[val] || ArrowUpRight;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${txTypeStyles[val] || 'bg-gray-100 text-gray-600'}`}>
            <Icon size={12} />
            {val || '–'}
          </span>
        );
      },
    },
    {
      header: t('customer.wallet.col_description', 'Beschreibung'),
      key: 'description',
      render: (val) => <span className="text-gray-700">{val || '–'}</span>,
    },
    {
      header: t('customer.wallet.col_amount', 'Betrag'),
      key: 'amount',
      render: (val, row) => {
        const isPositive = row.type === 'deposit' || row.type === 'refund' || row.type === 'bonus';
        return (
          <span className={`font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? '+' : '-'}{formatAmount(Math.abs(val || 0))}
          </span>
        );
      },
    },
    {
      header: t('customer.wallet.col_status', 'Status'),
      key: 'status',
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
          val === 'completed' ? 'bg-success-light text-success-dark'
            : val === 'pending' ? 'bg-warning-light text-warning-dark'
            : val === 'failed' ? 'bg-danger-light text-danger-dark'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {val || '–'}
        </span>
      ),
    },
  ];

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
        <button
          onClick={fetchData}
          className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {t('common.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-title-lg text-gray-900">
            {t('customer.wallet.title', 'Mein Wallet')}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {t('customer.wallet.subtitle', 'Guthaben und Transaktionsverlauf.')}
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors"
          title={t('customer.wallet.add_funds_placeholder', 'Funktion folgt')}
        >
          <Plus size={16} />
          {t('customer.wallet.add_funds', 'Guthaben aufladen')}
        </button>
      </div>

      {/* Stats */}
      <DashboardGrid cols={3} className="mb-6">
        <StatCard
          icon={Wallet}
          label={t('customer.wallet.current_balance', 'Aktuelles Guthaben')}
          value={formatAmount(balance || 0)}
          color="brand"
        />
        <StatCard
          icon={ArrowDownLeft}
          label={t('customer.wallet.total_deposited', 'Einzahlungen gesamt')}
          value={formatAmount(transactions.filter(tx => tx.type === 'deposit' || tx.type === 'bonus').reduce((s, tx) => s + Math.abs(tx.amount || 0), 0))}
          color="success"
        />
        <StatCard
          icon={CreditCard}
          label={t('customer.wallet.total_spent', 'Ausgaben gesamt')}
          value={formatAmount(transactions.filter(tx => tx.type === 'booking' || tx.type === 'withdrawal').reduce((s, tx) => s + Math.abs(tx.amount || 0), 0))}
          color="danger"
        />
      </DashboardGrid>

      {/* Transaction filter */}
      <div className="flex items-center gap-2 mb-4">
        <Filter size={16} className="text-gray-400" />
        <div className="flex gap-1.5">
          {[t('customer.wallet.filter_all', 'Alle'), ...txTypes].map((type) => {
            const key = type === t('customer.wallet.filter_all', 'Alle') ? 'all' : type;
            return (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  typeFilter === key
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transactions table */}
      <DataTable
        columns={columns}
        data={filteredTx}
        pageSize={10}
        emptyText={t('customer.wallet.no_transactions', 'Noch keine Transaktionen vorhanden.')}
      />
    </div>
  );
}
