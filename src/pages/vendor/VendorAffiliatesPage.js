import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link2, Users, DollarSign, Loader2, AlertCircle, ExternalLink, Copy, CheckCircle, XCircle, Clock
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { formatAmount, formatDate } from '../../lib/utils';
import { toast } from 'sonner';

const payoutStatusColors = {
  pending: { bg: 'rgba(74,144,201,0.12)', text: 'var(--color-primary-light)' },
  completed: { bg: 'rgba(74,222,128,0.12)', text: 'var(--color-success)' },
  failed: { bg: 'rgba(220,38,38,0.1)', text: 'var(--color-danger)' },
};

export default function VendorAffiliatesPage() {
  const { t } = useTranslation();

  const [affiliates, setAffiliates] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [affRes, comRes] = await Promise.allSettled([
        apiClient.get('/api/vendor/affiliates').then(r => r.data),
        apiClient.get('/api/vendor/commissions').then(r => r.data),
      ]);

      if (affRes.status === 'fulfilled') {
        const d = affRes.value;
        setAffiliates(Array.isArray(d) ? d : (d.affiliates || d.data || []));
      }
      if (comRes.status === 'fulfilled') {
        const d = comRes.value;
        setCommissions(Array.isArray(d) ? d : (d.commissions || d.data || []));
      }

      if (affRes.status === 'rejected' && comRes.status === 'rejected') {
        setError(t('vendor.affiliates.load_error', 'Fehler beim Laden der Affiliate-Daten.'));
      }
    } catch (err) {
      setError(err.message || t('vendor.affiliates.error', 'Fehler beim Laden.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [t]);

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success(t('vendor.affiliates.copied', 'Link kopiert!'));
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error(t('vendor.affiliates.copy_error', 'Fehler beim Kopieren.'));
    }
  };

  const totalCommissions = commissions.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
  const paidCommissions = commissions.filter(c => c.status === 'paid' || c.status === 'completed').reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);

  return (
    <div data-testid="vendor-affiliates-page" style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.affiliates.title', 'Affiliate-Partner')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.affiliates.subtitle', 'Verwalte deine Affiliate-Partner, Trackinglinks und Provisionen.')}</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: 'var(--color-danger)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
          <button onClick={fetchData}
            className="px-6 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="w2g-page-stack">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl p-5"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
              <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {t('vendor.affiliates.total_commission', 'Provisionen gesamt')}
              </p>
              <p className="text-[26px] font-extrabold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                {formatAmount(totalCommissions)}
              </p>
            </div>
            <div className="rounded-xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
              <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.affiliates.pending', 'Ausstehend')}
              </p>
              <p className="text-[22px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {formatAmount(pendingCommissions)}
              </p>
            </div>
            <div className="rounded-xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
              <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {t('vendor.affiliates.paid', 'Bereits ausgezahlt')}
              </p>
              <p className="text-[22px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {formatAmount(paidCommissions)}
              </p>
            </div>
          </div>

          {/* Partner List */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Users size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.affiliates.partner_list', 'Partner')}
              </h2>
            </div>

            {affiliates.length === 0 ? (
              <p className="text-[13px] text-center py-6" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('vendor.affiliates.no_affiliates', 'Noch keine Affiliate-Partner.')}
              </p>
            ) : (
              <div className="space-y-2">
                {affiliates.map((aff, i) => (
                  <div key={aff.id || i}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                    style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'var(--color-accent-muted)' }}>
                      <Users size={15} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                        {aff.name || aff.full_name || aff.email || '–'}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        {aff.email} · {t('vendor.affiliates.rate', 'Provision')}: {aff.commission_rate || 0}%
                      </p>
                    </div>
                    <div className="text-[13px] font-semibold" style={{ color: 'var(--color-primary)' }}>
                      {formatAmount(aff.total_commission || 0)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tracking Links */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Link2 size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.affiliates.tracking_links', 'Trackinglinks')}
              </h2>
            </div>

            {affiliates.length === 0 ? (
              <p className="text-[13px] text-center py-6" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('vendor.affiliates.no_links', 'Keine Trackinglinks verfügbar.')}
              </p>
            ) : (
              <div className="space-y-2">
                {affiliates.map((aff, i) => {
                  const link = aff.tracking_link || aff.referral_link || `${window.location.origin}/ref/${aff.referral_code || aff.id}`;
                  return (
                    <div key={aff.id || i}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
                      style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider-subtle)' }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] truncate" style={{ color: 'var(--color-text-primary)' }}>
                          {link}
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                          {aff.name || aff.email} · {aff.click_count || 0} {t('vendor.affiliates.clicks', 'Klicks')}
                        </p>
                      </div>
                      <button onClick={() => copyToClipboard(link, aff.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
                        style={{
                          background: copiedId === aff.id ? 'rgba(74,222,128,0.12)' : 'var(--color-surface)',
                          color: copiedId === aff.id ? 'var(--color-success)' : 'var(--color-text-secondary)',
                          border: '1px solid var(--color-divider)',
                        }}>
                        {copiedId === aff.id ? <CheckCircle size={12} /> : <Copy size={12} />}
                        {copiedId === aff.id ? t('vendor.affiliates.copied', 'Kopiert!') : t('vendor.affiliates.copy', 'Kopieren')}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Commission History */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <DollarSign size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.affiliates.commission_history', 'Provisionsübersicht')}
              </h2>
            </div>

            {commissions.length === 0 ? (
              <p className="text-[13px] text-center py-6" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('vendor.affiliates.no_commissions', 'Noch keine Provisionen.')}
              </p>
            ) : (
              <div className="space-y-1">
                {commissions.map((c, i) => {
                  const pc = payoutStatusColors[c.status] || payoutStatusColors.pending;
                  return (
                    <div key={c.id || i}
                      className="flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                      style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                          {c.description || c.reason || c.booking?.service_name || t('vendor.affiliates.commission', 'Provision')}
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                          {c.affiliate_name || c.affiliate?.name || '–'} · {formatDate(c.created_at || c.date)}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: pc.bg, color: pc.text }}>
                        {c.status}
                      </span>
                      <p className="text-[13px] font-semibold w-[80px] text-right" style={{ color: 'var(--color-primary)' }}>
                        {formatAmount(c.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
