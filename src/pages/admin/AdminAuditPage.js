import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AuditApi } from '../../lib/api';
import { Loader2, AlertCircle, Search, Shield, Filter, ChevronDown, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';

function formatTimestamp(dateStr) {
  if (!dateStr) return '–';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function AuditEventBadge({ action }) {
  const colorMap = {
    create: 'success', update: 'info', delete: 'danger',
    login: 'info', logout: 'neutral', register: 'success',
    payment: 'warning', refund: 'danger',
  };
  const variant = colorMap[action?.toLowerCase()] || 'neutral';
  return <Badge variant={variant}>{action || 'unknown'}</Badge>;
}

export default function AdminAuditPage() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = {};
      if (actionFilter) params.action = actionFilter;
      const data = await AuditApi.list(params);
      setLogs(Array.isArray(data) ? data : (data.logs || data.data || data.items || []));
    } catch (err) {
      setError(err?.message || t('common.error', 'Fehler beim Laden'));
    } finally { setLoading(false); }
  }, [actionFilter, t]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = logs.filter(l => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (l.user_email || l.user?.email || '').toLowerCase().includes(q)
      || (l.action || '').toLowerCase().includes(q)
      || (l.resource || '').toLowerCase().includes(q)
      || (l.details || '').toLowerCase().includes(q);
  });

  const ACTIONS = ['create', 'update', 'delete', 'login', 'logout', 'register', 'payment', 'refund'];

  if (loading) return (
    <div data-testid="admin-audit-page" className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} /></div>
  );

  if (error) return (
    <div className="text-center py-20">
      <AlertCircle size={40} className="mx-auto mb-4" style={{ color: 'var(--color-danger)' }} />
      <p className="text-sm mb-4" style={{ color: 'var(--color-danger)' }}>{error}</p>
      <button onClick={fetchLogs} className="px-5 py-2 rounded-md border text-sm font-semibold cursor-pointer"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-divider)', color: 'var(--color-primary)' }}>
        {t('common.retry', 'Erneut versuchen')}
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('admin.audit.title', 'Audit-Log')}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {t('admin.audit.subtitle', 'Sicherheits- & Aktivitätsprotokoll')}
          </p>
        </div>
        <button onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border cursor-pointer transition-colors"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-divider)', color: 'var(--color-text-secondary)' }}>
          <RefreshCw size={14} /> {t('common.refresh', 'Aktualisieren')}
        </button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('admin.audit.search_ph', 'Suchen (E-Mail, Aktion, Details)...')}
                className="w-full h-[40px] pl-10 pr-3 rounded-md border text-sm"
                style={{ borderColor: 'var(--color-divider)', background: 'var(--color-surface)' }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActionFilter('')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                  !actionFilter ? '' : 'hover:bg-[var(--color-surface-sunken)]'
                }`}
                style={{
                  background: !actionFilter ? 'var(--color-primary)' : 'var(--color-surface)',
                  borderColor: !actionFilter ? 'var(--color-primary)' : 'var(--color-divider)',
                  color: !actionFilter ? '#fff' : 'var(--color-text-secondary)',
                }}>
                {t('common.all', 'Alle')}
              </button>
              {ACTIONS.map(a => (
                <button key={a} onClick={() => setActionFilter(a)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                    actionFilter === a ? '' : 'hover:bg-[var(--color-surface-sunken)]'
                  }`}
                  style={{
                    background: actionFilter === a ? 'var(--color-primary)' : 'var(--color-surface)',
                    borderColor: actionFilter === a ? 'var(--color-primary)' : 'var(--color-divider)',
                    color: actionFilter === a ? '#fff' : 'var(--color-text-secondary)',
                  }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <Shield size={40} style={{ color: 'var(--color-text-tertiary)' }} className="mb-4" />
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              {search || actionFilter
                ? t('admin.audit.no_filtered', 'Keine Einträge für diese Filter.')
                : t('admin.audit.no_logs', 'Keine Audit-Einträge vorhanden.')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((log, idx) => (
            <div key={log.id || idx}
              className="rounded-lg border cursor-pointer transition-colors hover:bg-[var(--color-surface-elevated)]"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-divider)' }}>
              <div className="px-5 py-3 flex items-center gap-4" onClick={() => setExpanded(expanded === (log.id || idx) ? null : (log.id || idx))}>
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <AuditEventBadge action={log.action} />
                  </div>
                  <p className="truncate font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {log.user_email || log.user?.email || t('admin.audit.system', 'System')}
                  </p>
                  <p className="truncate" style={{ color: 'var(--color-text-secondary)' }}>
                    {log.resource || '–'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    {formatTimestamp(log.created_at || log.timestamp)}
                  </p>
                </div>
                <ChevronDown size={14} className="shrink-0 transition-transform" style={{
                  color: 'var(--color-text-tertiary)',
                  transform: expanded === (log.id || idx) ? 'rotate(180deg)' : '',
                }} />
              </div>
              {expanded === (log.id || idx) && log.details && (
                <div className="px-5 pb-3">
                  <Separator className="mb-3" />
                  <pre className="text-xs p-3 rounded-md overflow-x-auto" style={{
                    background: 'var(--color-surface-sunken)',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
