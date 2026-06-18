import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search } from 'lucide-react';
import PageLoadingState from '../../../src/components/shared/PageLoadingState';
import PageEmptyState from '../../../src/components/shared/PageEmptyState';
import PageErrorState from '../../../src/components/shared/PageErrorState';

export default function StaffCustomersPage() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try { setLoading(true); setError(null);
        const res = await fetch('/api/crm/contacts');
        if (!res.ok) throw new Error('Fehler beim Laden der Kunden');
        const data = await res.json();
        if (!cancelled) setCustomers(Array.isArray(data) ? data : []);
      } catch (err) { if (!cancelled) setError(err.message); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = customers.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <PageLoadingState text={t('staff.loading', 'Kunden werden geladen…')} />;
  if (error) return <PageErrorState title={t('staff.customers.error', 'Fehler beim Laden')} message={error} onRetry={() => window.location.reload()} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">{t('staff.customers.title', 'Kunden')}</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('staff.customers.search', 'Suchen…')}
              className="pl-9 pr-3 py-2 border border-[var(--color-divider)] text-xs w-48" style={{borderRadius:'var(--radius-sm)'}} />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <PageEmptyState icon={Users} title={t('staff.customers.empty', 'Keine Kunden gefunden')}
          description={search ? t('staff.customers.noResults', 'Keine Kunden entsprechen der Suche.') : t('staff.customers.noCustomers', 'Es sind noch keine Kunden vorhanden.')} />
      ) : (
        <div className="bg-white border border-[var(--color-divider-subtle)] overflow-hidden" style={{borderRadius:'var(--radius-lg)'}}>
          <div className="divide-y divide-[var(--color-divider-subtle)]">
            {filtered.map(c => (
              <div key={c.id || c.contact_id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[var(--color-surface-sunken)] transition-colors">
                <div className="h-9 w-9 flex items-center justify-center bg-[var(--color-primary-bg)] shrink-0 text-xs font-bold text-[var(--color-primary)]" style={{borderRadius:'var(--radius-full)'}}>
                  {(c.name || c.email || '?')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{c.name || c.email || 'Kunde'}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{c.email || '—'} · {c.phone || '—'}</p>
                </div>
                <span className="text-xs text-[var(--color-text-tertiary)]">{c.last_booking ? `Letzte Buchung: ${new Date(c.last_booking).toLocaleDateString('de-DE')}` : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
