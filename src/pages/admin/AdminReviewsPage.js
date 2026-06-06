import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewsApi } from '../../lib/api';
import { Loader2, AlertCircle, Search, Star, Eye, EyeOff, MessageSquare, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';

function formatDate(dateStr) {
  if (!dateStr) return '–';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function StarRating({ rating }) {
  const num = parseInt(rating) || 0;
  return (
    <div data-testid="admin-reviews-page" className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} fill={i <= num ? 'var(--color-accent)' : 'none'}
          style={{ color: i <= num ? 'var(--color-accent)' : 'var(--color-divider)' }} />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [hideReason, setHideReason] = useState('');
  const [hideModal, setHideModal] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = {};
      if (statusFilter === 'hidden') params.hidden = true;
      else if (statusFilter === 'flagged') params.flagged = true;
      const data = await ReviewsApi.adminList(params);
      setReviews(Array.isArray(data) ? data : (data.reviews || data.data || []));
    } catch (err) {
      setError(err?.message || t('common.error', 'Fehler beim Laden'));
    } finally { setLoading(false); }
  }, [statusFilter, t]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleHide = async (id) => {
    if (!hideReason.trim()) return;
    setActionLoading(id);
    try {
      await ReviewsApi.adminHide(id, hideReason);
      setHideModal(null); setHideReason('');
      await fetchReviews();
    } catch (err) {
      alert(err?.response?.data?.detail || t('common.error', 'Fehler'));
    } finally { setActionLoading(null); }
  };

  const handleUnhide = async (id) => {
    setActionLoading(id);
    try {
      await ReviewsApi.adminUnhide(id);
      await fetchReviews();
    } catch (err) {
      alert(err?.response?.data?.detail || t('common.error', 'Fehler'));
    } finally { setActionLoading(null); }
  };

  const filtered = reviews.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (r.user_name || r.user?.name || '').toLowerCase().includes(q)
      || (r.vendor_name || r.vendor?.name || '').toLowerCase().includes(q)
      || (r.comment || '').toLowerCase().includes(q);
  });

  if (loading) return (
    <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} /></div>
  );

  if (error) return (
    <div className="text-center py-20">
      <AlertCircle size={40} className="mx-auto mb-4" style={{ color: 'var(--color-danger)' }} />
      <p className="text-sm mb-4" style={{ color: 'var(--color-danger)' }}>{error}</p>
      <button onClick={fetchReviews} className="px-5 py-2 rounded-md border text-sm font-semibold cursor-pointer"
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
            {t('admin.reviews.title', 'Bewertungs-Moderation')}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {t('admin.reviews.subtitle', 'Bewertungen prüfen und moderieren')}
          </p>
        </div>
        <button onClick={fetchReviews}
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
                placeholder={t('admin.reviews.search_ph', 'Suchen (Kunde, Anbieter, Kommentar)...')}
                className="w-full h-[40px] pl-10 pr-3 rounded-md border text-sm"
                style={{ borderColor: 'var(--color-divider)', background: 'var(--color-surface)' }}
              />
            </div>
            <div className="flex gap-2">
              {[
                { key: 'all', label: t('common.all', 'Alle') },
                { key: 'visible', label: t('admin.reviews.visible', 'Sichtbar') },
                { key: 'hidden', label: t('admin.reviews.hidden', 'Ausgeblendet') },
                { key: 'flagged', label: t('admin.reviews.flagged', 'Gemarkt') },
              ].map(f => (
                <button key={f.key} onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer`}
                  style={{
                    background: statusFilter === f.key ? 'var(--color-primary)' : 'var(--color-surface)',
                    borderColor: statusFilter === f.key ? 'var(--color-primary)' : 'var(--color-divider)',
                    color: statusFilter === f.key ? '#fff' : 'var(--color-text-secondary)',
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <MessageSquare size={40} style={{ color: 'var(--color-text-tertiary)' }} className="mb-4" />
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('admin.reviews.no_reviews', 'Keine Bewertungen gefunden.')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <Card key={review.id} className={`transition-all ${review.is_hidden ? 'opacity-60' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                        {review.user_name || review.user?.name || review.user?.email || t('common.anonymous', 'Anonym')}
                      </span>
                      <StarRating rating={review.rating} />
                      <Badge variant={review.is_hidden ? 'danger' : 'success'}>
                        {review.is_hidden ? t('admin.reviews.hidden', 'Ausgeblendet') : t('admin.reviews.visible', 'Sichtbar')}
                      </Badge>
                      {review.is_flagged && <Badge variant="warning">{t('admin.reviews.flagged', 'Gemarkt')}</Badge>}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      {t('admin.reviews.for_vendor', 'Für')}: <strong>{review.vendor_name || review.vendor?.name || '–'}</strong>
                      {' · '}{formatDate(review.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {review.is_hidden ? (
                      <button onClick={() => handleUnhide(review.id)} disabled={actionLoading === review.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border cursor-pointer transition-colors"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-divider)', color: 'var(--color-text-secondary)' }}>
                        <Eye size={12} /> {t('admin.reviews.show', 'Einblenden')}
                      </button>
                    ) : (
                      <button onClick={() => setHideModal(review.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border cursor-pointer transition-colors"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-danger-border)', color: 'var(--color-danger)' }}>
                        <EyeOff size={12} /> {t('admin.reviews.hide', 'Ausblenden')}
                      </button>
                    )}
                  </div>
                </div>
                {review.comment && (
                  <div className="p-3 rounded-md text-sm leading-relaxed" style={{ background: 'var(--color-surface-sunken)', color: 'var(--color-text-primary)' }}>
                    {review.comment}
                  </div>
                )}
                {review.vendor_response && (
                  <div className="mt-2 p-3 rounded-md text-sm border-l-2" style={{
                    background: 'var(--color-accent-subtle)',
                    borderColor: 'var(--color-accent)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    <p className="text-[11px] font-semibold mb-1" style={{ color: 'var(--color-accent)' }}>
                      {t('admin.reviews.vendor_response', 'Antwort des Anbieters')}:
                    </p>
                    {review.vendor_response}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Hide Modal */}
      {hideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-md rounded-xl p-6" style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-modal)' }}>
            <h3 className="text-base font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              {t('admin.reviews.hide_title', 'Bewertung ausblenden')}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {t('admin.reviews.hide_desc', 'Bitte gib einen Grund für das Ausblenden an.')}
            </p>
            <textarea value={hideReason} onChange={e => setHideReason(e.target.value)}
              rows={3} className="w-full p-3 rounded-md border text-sm resize-none mb-4"
              style={{ borderColor: 'var(--color-divider)', background: 'var(--color-surface)' }}
              placeholder={t('admin.reviews.reason_ph', 'Grund für das Ausblenden...')}
            />
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => { setHideModal(null); setHideReason(''); }}
                className="px-4 py-2 text-sm font-medium rounded-md border cursor-pointer"
                style={{ borderColor: 'var(--color-divider)', color: 'var(--color-text-secondary)' }}>
                {t('common.cancel', 'Abbrechen')}
              </button>
              <button onClick={() => handleHide(hideModal)} disabled={actionLoading === hideModal || !hideReason.trim()}
                className="px-4 py-2 text-sm font-medium rounded-md text-white cursor-pointer disabled:opacity-50"
                style={{ background: 'var(--color-danger)' }}>
                {actionLoading === hideModal ? <Loader2 size={14} className="animate-spin" /> : t('admin.reviews.hide_btn', 'Ausblenden')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
