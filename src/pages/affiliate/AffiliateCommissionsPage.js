import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Filter } from 'lucide-react';
import apiClient from '../../lib/apiClient';

const STATUS_STYLES = {
  pending: { bg:'rgba(245,158,11,0.12)', color:'var(--color-warning)' },
  approved: { bg:'rgba(56,161,105,0.12)', color:'var(--color-success)' },
  paid: { bg:'rgba(49,130,206,0.12)', color:'#3182CE' },
  cancelled: { bg:'rgba(229,62,62,0.12)', color:'var(--color-danger)' },
};

function formatDate(str) {
  if (!str) return '—';
  try { return new Date(str).toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
  catch { return str; }
}

function formatEuro(v) { return v != null ? `${Number(v).toFixed(2)} €` : '—'; }

export default function AffiliateCommissionsPage() {
  const { t } = useTranslation();
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const res = await apiClient.get('/api/affiliate/commissions', { params });
      setCommissions(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setError(err?.response?.data?.detail || 'Fehler beim Laden'); }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="p-6 flex items-center justify-center min-h-[40vh]"><Loader2 size={32} className="animate-spin" style={{color:'var(--color-accent)'}} /></div>;
  if (error) return <div className="p-6 flex flex-col items-center justify-center min-h-[40vh]" style={{color:'var(--color-danger)'}}><p>{error}</p><button onClick={fetch} className="mt-4 px-4 py-2 rounded text-sm text-white" style={{backgroundColor:'var(--color-accent)'}}>Erneut</button></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{color:'var(--color-text-primary)'}}>{t('affiliate.commissions', 'Provisionen')}</h1>
          <p className="text-sm mt-1" style={{color:'var(--color-text-secondary)'}}>{t('affiliate.commissions_desc', 'Deine verdienten Provisionen im Überblick')}</p>
        </div>
        <div className="flex gap-2">
          {['all','pending','approved','paid','cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-all duration-150 active:scale-[0.97]"
              style={{
                backgroundColor: statusFilter === s ? 'var(--color-accent)' : 'var(--color-surface)',
                color: statusFilter === s ? '#fff' : 'var(--color-text-secondary)',
                border: statusFilter === s ? 'none' : '1px solid var(--color-divider)',
              }}>
              {s === 'all' ? 'Alle' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {commissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center" style={{color:'var(--color-text-muted)'}}>
          <Filter size={40} />
          <p className="mt-3 text-sm" style={{color:'var(--color-text-secondary)'}}>{t('affiliate.no_commissions', 'Noch keine Provisionen')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-md)]" style={{border:'1px solid var(--color-divider)'}}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{backgroundColor:'var(--color-shell-bg)'}}>
                {['Buchung','Betrag','Satz','Status','Datum'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{color:'var(--color-text-muted)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commissions.map(c => {
                const st = STATUS_STYLES[c.status] || {};
                return (
                  <tr key={c.id} className="transition-colors" style={{borderTop:'1px solid var(--color-divider)', backgroundColor:'var(--color-surface)'}}>
                    <td className="px-4 py-3 font-mono text-xs" style={{color:'var(--color-text-secondary)'}}>{c.booking_id?.slice(0,12) || '—'}…</td>
                    <td className="px-4 py-3 font-semibold" style={{color:'var(--color-text-primary)'}}>{formatEuro(c.amount)}</td>
                    <td className="px-4 py-3" style={{color:'var(--color-text-secondary)'}}>{c.rate ? `${c.rate}%` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{backgroundColor:st.bg, color:st.color}}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{color:'var(--color-text-muted)'}}>{formatDate(c.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
