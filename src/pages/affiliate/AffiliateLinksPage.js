import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Plus, Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import { Card, CardContent } from '../../components/ui/card';

function formatDate(str) {
  if (!str) return '—';
  try { return new Date(str).toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric' }); }
  catch { return str; }
}

export default function AffiliateLinksPage() {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vendor_id: '', commission_percent: 10 });

  const { data: links = [], isLoading } = useAutoRefresh(
    ['affiliate', 'links'],
    () => apiClient.get('/api/affiliate/links').then(r => Array.isArray(r.data) ? r.data : []),
  );

  const createMutation = usePortalMutation({
    mutationFn: () => apiClient.post('/api/affiliate/link', form),
    invalidateKeys: [['affiliate', 'links'], ['affiliate', 'dashboard']],
    onSuccess: () => { setShowForm(false); setForm({ vendor_id: '', commission_percent: 10 }); },
    onError: (err) => alert(err?.response?.data?.detail || 'Fehler beim Erstellen'),
  });

  const copyToClipboard = (code) => {
    const url = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(code);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (isLoading) return <div className="p-6 flex items-center justify-center min-h-[40vh]"><Loader2 size={32} className="animate-spin" style={{color:'var(--color-accent)'}} /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{color:'var(--color-text-primary)'}}>{t('affiliate.links', 'Trackinglinks')}</h1>
          <p className="text-sm mt-1" style={{color:'var(--color-text-secondary)'}}>{t('affiliate.links_desc', 'Erstelle und verwalte deine Trackinglinks')}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] font-medium text-sm transition-all duration-150 active:scale-[0.97] text-white"
          style={{backgroundColor: 'var(--color-accent)'}}>
          <Plus size={16} /> {t('affiliate.create_link', 'Link erstellen')}
        </button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{color:'var(--color-text-primary)'}}>{t('affiliate.vendor_id', 'Vendor-ID')}</label>
              <input value={form.vendor_id} onChange={e => setForm(f => ({...f, vendor_id: e.target.value}))}
                className="w-full px-3 py-2 rounded-[var(--radius-md)] text-sm" placeholder="vendor-id-aus-dem-dashboard"
                style={{border:'1px solid var(--color-divider)', backgroundColor:'var(--color-surface)', color:'var(--color-text-primary)'}} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color:'var(--color-text-primary)'}}>{t('affiliate.commission_rate', 'Provisionssatz (%)')}</label>
              <input type="number" value={form.commission_percent} onChange={e => setForm(f => ({...f, commission_percent: Number(e.target.value)}))}
                className="w-full px-3 py-2 rounded-[var(--radius-md)] text-sm" min={0} max={100}
                style={{border:'1px solid var(--color-divider)', backgroundColor:'var(--color-surface)', color:'var(--color-text-primary)'}} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => createMutation.mutate()}
                className="px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 active:scale-[0.97] text-white"
                style={{backgroundColor:'var(--color-accent)'}}>
                {t('common.save', 'Speichern')}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150"
                style={{color:'var(--color-text-secondary)'}}>
                {t('common.cancel', 'Abbrechen')}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center" style={{color:'var(--color-text-muted)'}}>
          <ExternalLink size={40} />
          <p className="mt-3 text-sm font-medium" style={{color:'var(--color-text-secondary)'}}>{t('affiliate.no_links', 'Noch keine Trackinglinks')}</p>
          <p className="text-xs mt-1">{t('affiliate.no_links_desc', 'Erstelle deinen ersten Link, um mit dem Bewerben zu starten')}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {links.map(link => (
            <Card key={link.id} className="transition-all duration-150">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate" style={{color:'var(--color-text-primary)'}}>
                      {link.code || link.id?.slice(0,8)}
                    </p>
                    <p className="text-xs mt-0.5" style={{color:'var(--color-text-muted)'}}>
                      {link.commission_percent || 10}% · {formatDate(link.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => copyToClipboard(link.code || link.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-all duration-150 active:scale-[0.97]"
                      style={{backgroundColor:'var(--color-shell-bg)', color:'var(--color-text-secondary)'}}>
                      {copiedId === (link.code || link.id) ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      {copiedId === (link.code || link.id) ? t('common.copied', 'Kopiert') : t('common.copy', 'Kopieren')}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
