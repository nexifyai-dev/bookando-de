import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Wallet, Download, Loader2, AlertCircle, ArrowUpRight,
  Clock, CheckCircle2, XCircle, AlertTriangle, CreditCard, Mail,
  DollarSign, Info
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { formatAmount, formatDate } from '../../lib/utils';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';

const STATUS_MAP = {
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning-light', labelKey: 'vendor.payout.status_pending', fallback: 'Ausstehend' },
  processing: { icon: Loader2, color: 'text-info', bg: 'bg-info-light', labelKey: 'vendor.payout.status_processing', fallback: 'Wird verarbeitet' },
  completed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success-light', labelKey: 'vendor.payout.status_completed', fallback: 'Abgeschlossen' },
  failed: { icon: XCircle, color: 'text-danger', bg: 'bg-danger-light', labelKey: 'vendor.payout.status_failed', fallback: 'Fehlgeschlagen' },
};

const PAYOUT_FEE_PCT = 2.5;
const MIN_PAYOUT = 50;

export default function VendorPayoutRequestPage() {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [bankIban, setBankIban] = useState('');
  const [bankBic, setBankBic] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      setLoading(true);
      setError(null);
      try {
        const [balRes, payRes] = await Promise.allSettled([
          apiClient.get('/api/wallet').then(r => r.data),
          apiClient.get('/api/wallet/payouts').then(r => r.data),
        ]);
        if (!cancelled) {
          if (balRes.status === 'fulfilled') setBalance(balRes.value);
          if (payRes.status === 'fulfilled') {
            const d = payRes.value;
            setPayouts(Array.isArray(d) ? d : (d.payouts || d.data || []));
          }
          if (balRes.status === 'rejected' && payRes.status === 'rejected') {
            setError(t('vendor.payout.load_error', 'Fehler beim Laden der Auszahlungsdaten.'));
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || t('common.error', 'Fehler'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [t, reloadKey]);

  const available = balance?.available ?? balance?.balance ?? 0;
  const numericAmount = parseFloat(amount) || 0;
  const fee = numericAmount * (PAYOUT_FEE_PCT / 100);
  const netAmount = numericAmount - fee;
  const canSubmit = numericAmount >= MIN_PAYOUT && numericAmount <= available && (
    method === 'bank' ? (bankIban.trim().length > 0) : (paypalEmail.trim().length > 0)
  );

  const handleMax = () => setAmount(String(Math.floor(available * 100) / 100));

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await apiClient.post('/api/wallet/payouts/request', {
        amount: numericAmount,
        method,
        bank_iban: method === 'bank' ? bankIban : undefined,
        bank_bic: method === 'bank' ? bankBic : undefined,
        paypal_email: method === 'paypal' ? paypalEmail : undefined,
      });
      setSubmitSuccess(true);
      setShowConfirm(false);
      setAmount('');
      setBankIban('');
      setBankBic('');
      setPaypalEmail('');
      setReloadKey(k => k + 1);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || t('vendor.payout.submit_error', 'Fehler bei der Auszahlungsanfrage.'));
    } finally {
      setSubmitting(false);
    }
  }, [numericAmount, method, bankIban, bankBic, paypalEmail, t]);

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
        <button onClick={() => setReloadKey(k => k + 1)} className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          {t('common.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  const payoutColumns = [
    {
      header: t('vendor.payout.col_date', 'Datum'),
      key: 'created_at',
      render: (val, row) => <span className="text-gray-500">{formatDate(val || row.date)}</span>,
    },
    {
      header: t('vendor.payout.col_amount', 'Betrag'),
      key: 'amount',
      render: (val) => <span className="font-semibold text-gray-900">{formatAmount(val)}</span>,
    },
    {
      header: t('vendor.payout.col_method', 'Methode'),
      key: 'method',
      render: (val) => (
        <span className="flex items-center gap-1.5 text-gray-500">
          {val === 'paypal' ? <Mail size={14} /> : <CreditCard size={14} />}
          {val === 'paypal' ? 'PayPal' : t('vendor.payout.bank_transfer', 'Überweisung')}
        </span>
      ),
    },
    {
      header: t('vendor.payout.col_status', 'Status'),
      key: 'status',
      render: (val) => {
        const s = STATUS_MAP[val] || STATUS_MAP.pending;
        const Icon = s.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.bg} ${s.color}`}>
            <Icon size={12} className={val === 'processing' ? 'animate-spin' : ''} />
            {t(s.labelKey, s.fallback)}
          </span>
        );
      },
    },
    {
      header: t('vendor.payout.col_fee', 'Gebühr'),
      key: 'fee',
      render: (val, row) => <span className="text-gray-400">{formatAmount(val ?? (row.amount * PAYOUT_FEE_PCT / 100))}</span>,
    },
    {
      header: t('vendor.payout.col_net', 'Auszahlung'),
      key: 'net_amount',
      render: (val, row) => <span className="font-bold text-gray-900">{formatAmount(val ?? (row.amount - (row.fee || row.amount * PAYOUT_FEE_PCT / 100)))}</span>,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">{t('vendor.payout.title', 'Auszahlungen')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('vendor.payout.subtitle', 'Verwalten Sie Ihre Auszahlungen und Guthaben.')}</p>
      </div>

      {/* Stats */}
      <DashboardGrid cols={3} className="mb-6">
        <StatCard icon={Wallet} label={t('vendor.payout.available', 'Verfügbar')} value={formatAmount(available)} color="brand" />
        <StatCard icon={DollarSign} label={t('vendor.payout.pending_balance', 'Ausstehend')} value={formatAmount(balance?.pending ?? 0)} color="warning" />
        <StatCard icon={CheckCircle2} label={t('vendor.payout.total_paid', 'Ausgezahlt')} value={formatAmount(balance?.total_paid ?? 0)} color="success" />
      </DashboardGrid>

      {/* Payout Request Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowUpRight size={16} className="text-brand" />
          {t('vendor.payout.request_title', 'Auszahlung beantragen')}
        </h2>

        {submitSuccess && (
          <div className="mb-4 flex items-center gap-3 bg-success/5 border border-success/20 rounded-xl px-5 py-3">
            <CheckCircle2 size={18} className="text-success flex-shrink-0" />
            <p className="text-sm text-success font-medium">{t('vendor.payout.request_success', 'Auszahlungsanfrage erfolgreich eingereicht.')}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('vendor.payout.amount', 'Betrag')}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">€</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                step="0.01"
                min={MIN_PAYOUT}
                max={available}
                className="w-full h-11 pl-8 pr-20 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                placeholder="0.00"
              />
              <button type="button" onClick={handleMax} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-3 rounded-md bg-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                {t('vendor.payout.max', 'Max')}
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Info size={12} /> {t('vendor.payout.min_threshold', 'Mindestauszahlung: {{amount}}', { amount: formatAmount(MIN_PAYOUT) })}</span>
              <span>{t('vendor.payout.fee_label', 'Gebühr: {{pct}}%', { pct: PAYOUT_FEE_PCT })}</span>
            </div>
            {amount && numericAmount > 0 && (
              <div className="mt-2 bg-gray-50 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs">
                <span className="text-gray-500">{t('vendor.payout.fee_deducted', 'Abzüglich Gebühr')}</span>
                <span className="font-bold text-gray-900">{formatAmount(netAmount)}</span>
              </div>
            )}
            {amount && numericAmount < MIN_PAYOUT && numericAmount > 0 && (
              <p className="mt-1.5 text-xs text-danger">{t('vendor.payout.below_min', 'Betrag liegt unter der Mindestauszahlung.')}</p>
            )}
            {amount && numericAmount > available && (
              <p className="mt-1.5 text-xs text-danger">{t('vendor.payout.exceeds_balance', 'Betrag übersteigt verfügbares Guthaben.')}</p>
            )}
          </div>

          {/* Method */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('vendor.payout.method', 'Auszahlungsmethode')}</label>
              <div className="grid grid-cols-2 gap-3">
                {['bank', 'paypal'].map(m => (
                  <button key={m} type="button" onClick={() => setMethod(m)} className={`relative p-4 rounded-xl border-2 text-left transition-all ${method === m ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    {method === m && <div className="absolute top-2 right-2 w-4 h-4 bg-brand rounded-full flex items-center justify-center"><CheckCircle2 size={10} className="text-white" /></div>}
                    {m === 'bank' ? <CreditCard size={20} className={method === m ? 'text-brand' : 'text-gray-400'} /> : <Mail size={20} className={method === m ? 'text-brand' : 'text-gray-400'} />}
                    <p className="text-xs font-bold text-gray-700 mt-1.5">{m === 'bank' ? t('vendor.payout.bank', 'Banküberweisung') : 'PayPal'}</p>
                  </button>
                ))}
              </div>
            </div>

            {method === 'bank' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">IBAN</label>
                  <input value={bankIban} onChange={e => setBankIban(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="DE89 3704 0044 0532 0130 00" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">BIC</label>
                  <input value={bankBic} onChange={e => setBankBic(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="COBADEFFXXX" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">PayPal E-Mail</label>
                <input value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} type="email" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="paypal@beispiel.de" />
              </div>
            )}
          </div>
        </div>

        {submitError && (
          <div className="mt-4 flex items-center gap-2 text-sm text-danger">
            <AlertCircle size={16} /> {submitError}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={!canSubmit || submitting}
            className="h-11 px-6 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand-hover transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowUpRight size={16} /> {t('vendor.payout.request_btn', 'Auszahlung beantragen')}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">{t('vendor.payout.confirm_title', 'Auszahlung bestätigen')}</h3>
            <p className="text-sm text-gray-500 mb-5">{t('vendor.payout.confirm_desc', 'Bitte überprüfen Sie die Auszahlungsdetails:')}</p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('vendor.payout.amount', 'Betrag')}</span>
                <span className="font-bold text-gray-900">{formatAmount(numericAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('vendor.payout.fee', 'Gebühr ({{pct}}%)', { pct: PAYOUT_FEE_PCT })}</span>
                <span className="text-gray-700">-{formatAmount(fee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                <span className="font-semibold text-gray-700">{t('vendor.payout.net_payout', 'Auszahlungsbetrag')}</span>
                <span className="font-extrabold text-gray-900">{formatAmount(netAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('vendor.payout.method', 'Methode')}</span>
                <span className="text-gray-700">{method === 'bank' ? `IBAN: ${bankIban.slice(-4).padStart(bankIban.length, '*')}` : `PayPal: ${paypalEmail}`}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 h-11 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                {t('common.cancel', 'Abbrechen')}
              </button>
              <button onClick={handleSubmit} disabled={submitting} className="flex-1 h-11 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <>{t('vendor.payout.confirm_btn', 'Bestätigen')}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payout History */}
      <DataTable
        columns={payoutColumns}
        data={payouts}
        pageSize={10}
        emptyText={t('vendor.payout.no_history', 'Noch keine Auszahlungen vorhanden.')}
      />
    </div>
  );
}
