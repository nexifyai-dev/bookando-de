import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Wallet, ArrowUpRight, Clock } from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { Card, CardContent } from '../../components/ui/card';

function formatDate(str) {
  if (!str) return '—';
  try { return new Date(str).toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
  catch { return str; }
}

export default function AffiliateWalletPage() {
  const { t } = useTranslation();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const [wRes, tRes] = await Promise.allSettled([
        apiClient.get('/api/wallet/balance'),
        apiClient.get('/api/wallet/transactions'),
      ]);
      if (wRes.status === 'fulfilled') setWallet(wRes.value.data);
      if (tRes.status === 'fulfilled') setTransactions(Array.isArray(tRes.value.data) ? tRes.value.data : []);
    } catch (err) { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) return;
    setWithdrawing(true);
    try {
      await apiClient.post('/api/wallet/withdraw', { amount });
      alert('Auszahlung beantragt');
      setWithdrawAmount('');
      await fetch();
    } catch (err) {
      alert(err?.response?.data?.detail || 'Fehler bei Auszahlung');
    }
    setWithdrawing(false);
  };

  if (loading) return <div className="p-6 flex items-center justify-center min-h-[40vh]"><Loader2 size={32} className="animate-spin" style={{color:'var(--color-accent)'}} /></div>;

  const balance = wallet?.balance || wallet?.current_balance || 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold" style={{color:'var(--color-text-primary)'}}>{t('affiliate.wallet', 'Wallet')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium" style={{color:'var(--color-text-secondary)'}}>{t('wallet.balance', 'Guthaben')}</p>
            <p className="text-3xl font-bold mt-2" style={{color:'var(--color-accent)'}}>{Number(balance).toFixed(2)} €</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium" style={{color:'var(--color-text-secondary)'}}>{t('wallet.pending', 'Ausstehend')}</p>
            <p className="text-3xl font-bold mt-2" style={{color:'var(--color-text-primary)'}}>{(wallet?.pending_balance || wallet?.pending || 0).toFixed(2)} €</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium" style={{color:'var(--color-text-secondary)'}}>{t('wallet.transactions', 'Transaktionen')}</p>
            <p className="text-3xl font-bold mt-2" style={{color:'var(--color-text-primary)'}}>{transactions.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Auszahlung */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold" style={{color:'var(--color-text-primary)'}}>{t('wallet.request_payout', 'Auszahlung beantragen')}</h3>
          <div className="flex gap-3">
            <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
              className="flex-1 px-3 py-2 rounded-[var(--radius-md)] text-sm" placeholder="Betrag in €"
              style={{border:'1px solid var(--color-divider)', backgroundColor:'var(--color-surface)', color:'var(--color-text-primary)'}}
              max={balance} />
            <button onClick={handleWithdraw} disabled={withdrawing || !withdrawAmount}
              className="px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-50 text-white"
              style={{backgroundColor:'var(--color-accent)'}}>
              {withdrawing ? '...' : t('wallet.withdraw', 'Auszahlen')}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Transaktionen */}
      <h3 className="font-semibold" style={{color:'var(--color-text-primary)'}}>{t('wallet.transaction_history', 'Transaktionshistorie')}</h3>
      {transactions.length === 0 ? (
        <p className="text-sm" style={{color:'var(--color-text-muted)'}}>{t('wallet.no_transactions', 'Noch keine Transaktionen')}</p>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-md)]" style={{border:'1px solid var(--color-divider)'}}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{backgroundColor:'var(--color-shell-bg)'}}>
                {['Typ', 'Betrag', 'Status', 'Datum'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{color:'var(--color-text-muted)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id || i} style={{borderTop:'1px solid var(--color-divider)', backgroundColor:'var(--color-surface)'}}>
                  <td className="px-4 py-3" style={{color:'var(--color-text-primary)'}}>{t.type || t.description || '—'}</td>
                  <td className="px-4 py-3 font-semibold" style={{color: (t.amount || 0) >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}}>
                    {(t.amount || 0) >= 0 ? '+' : ''}{Number(t.amount || 0).toFixed(2)} €
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{color:'var(--color-text-secondary)'}}>{t.status || 'completed'}</span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{color:'var(--color-text-muted)'}}>{formatDate(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
