import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Wallet, ArrowUpRight, ArrowDownRight, Loader2, AlertCircle, Plus, X, CreditCard, History, CheckCircle
} from 'lucide-react';
import { formatAmount, formatDate } from '../../lib/utils';
import apiClient from '../../lib/apiClient';
import { toast } from 'sonner';

function PayoutModal({ onClose, onRequest, balance, loading }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    if (val > balance) {
      toast.error(t('vendor.wallet.insufficient', 'Nicht genügend Guthaben.'));
      return;
    }
    onRequest({ amount: val, method });
  };

  return (
    <div data-testid="vendor-wallet-page" className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-xl p-6 animate-fade-in"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.wallet.payout_title', 'Auszahlung beantragen')}
          </h3>
          <button onClick={onClose} className="cursor-pointer p-1 rounded-lg hover:bg-[var(--color-surface-sunken)]"
            style={{ color: 'var(--color-text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface-sunken)' }}>
            <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.wallet.available_balance', 'Verfügbares Guthaben')}
            </p>
            <p className="text-[24px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              {formatAmount(balance)}
            </p>
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.wallet.amount', 'Betrag (€)')} *
            </label>
            <input type="number" step="0.01" min="1" max={balance} value={amount}
              onChange={e => setAmount(e.target.value)} required
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              {t('vendor.wallet.method', 'Auszahlungsmethode')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'bank_transfer', label: t('vendor.wallet.bank_transfer', 'Überweisung') },
                { value: 'paypal', label: 'PayPal' },
              ].map(m => (
                <button key={m.value} type="button" onClick={() => setMethod(m.value)}
                  className="px-3 py-2.5 text-[12px] font-semibold rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: method === m.value ? 'var(--color-primary)' : 'var(--color-surface-sunken)',
                    color: method === m.value ? '#fff' : 'var(--color-text-secondary)',
                    border: method === m.value ? 'none' : '1px solid var(--color-divider)',
                  }}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading || !amount || parseFloat(amount) <= 0}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}>
              {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('vendor.wallet.request_payout', 'Auszahlung beantragen')}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}>
              {t('common.cancel', 'Abbrechen')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VendorWalletPage() {
  const { t } = useTranslation();

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const fetchWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get('/api/vendor/wallet').then(r => r.data);
      setWallet({
        balance: data.balance || 0,
        pending: data.pending || 0,
        total_earned: data.total_earned || data.total || 0,
      });
      const txData = data.transactions || data.ledger || [];
      setTransactions(Array.isArray(txData) ? txData : []);
    } catch (err) {
      setError(err.message || t('vendor.wallet.load_error', 'Fehler beim Laden des Wallets.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWallet(); }, [t]);

  const handlePayoutRequest = async (payload) => {
    setRequesting(true);
    try {
      await apiClient.post('/api/vendor/wallet/payout', payload);
      toast.success(t('vendor.wallet.payout_success', 'Auszahlung beantragt.'));
      setPayoutOpen(false);
      fetchWallet();
    } catch (err) {
      toast.error(err.message || t('vendor.wallet.payout_error', 'Fehler bei der Auszahlung.'));
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.wallet.title', 'Wallet')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.wallet.subtitle', 'Guthaben, Transaktionen und Auszahlungen.')}</p>
        </div>
        <button onClick={() => setPayoutOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer"
          style={{ background: 'var(--color-primary)' }}>
          <Plus size={16} /> {t('vendor.wallet.request_payout', 'Auszahlung')}
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: '#EF4444', margin: '0 auto 16px' }} />
          <p style={{ color: '#EF4444', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
          <button onClick={fetchWallet}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="w2g-page-stack">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl p-6"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
              <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {t('vendor.wallet.balance', 'Guthaben')}
              </p>
              <p className="text-[32px] font-extrabold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                {formatAmount(wallet?.balance || 0)}
              </p>
            </div>
            <div className="rounded-xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
              <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.wallet.pending', 'Ausstehend')}
              </p>
              <p className="text-[22px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {formatAmount(wallet?.pending || 0)}
              </p>
            </div>
            <div className="rounded-xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
              <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.wallet.total_earned', 'Gesamt verdient')}
              </p>
              <p className="text-[22px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {formatAmount(wallet?.total_earned || 0)}
              </p>
            </div>
          </div>

          {/* Transactions */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <History size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.wallet.transactions', 'Transaktionshistorie')}
              </h2>
            </div>

            {transactions.length === 0 ? (
              <p className="text-[13px] text-center py-8" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('vendor.wallet.no_transactions', 'Noch keine Transaktionen.')}
              </p>
            ) : (
              <div className="space-y-1">
                {transactions.map((tx, i) => (
                  <div key={tx.id || i}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                    style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: tx.type === 'credit' || tx.type === 'deposit' ? 'rgba(74,222,128,0.12)' : 'rgba(239,68,68,0.12)' }}>
                      {tx.type === 'credit' || tx.type === 'deposit'
                        ? <ArrowDownRight size={14} style={{ color: 'var(--color-success)' }} />
                        : <ArrowUpRight size={14} style={{ color: '#EF4444' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                        {tx.description || tx.reason || tx.type || '–'}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        {formatDate(tx.created_at || tx.date)}
                      </p>
                    </div>
                    <p className="text-[13px] font-semibold shrink-0" style={{
                      color: tx.type === 'credit' || tx.type === 'deposit' ? 'var(--color-success)' : '#EF4444'
                    }}>
                      {(tx.type === 'credit' || tx.type === 'deposit' ? '+' : '-')}{formatAmount(Math.abs(tx.amount || 0))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {payoutOpen && (
        <PayoutModal onClose={() => setPayoutOpen(false)} onRequest={handlePayoutRequest}
          balance={wallet?.balance || 0} loading={requesting} />
      )}
    </div>
  );
}
